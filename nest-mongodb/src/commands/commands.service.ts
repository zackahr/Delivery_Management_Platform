import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandDocument } from '../schemas/command.schema';
import { CreateCommandDto } from './dto/create-command.dto';
import { Client, ClientDocument } from '../schemas/client.schema';
import { ClientService } from 'src/client/client.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommandService {
  constructor(
    @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private clientService: ClientService,
    private userService: UserService,
  ) {}

  async create(createCommandDto: CreateCommandDto, userId: string): Promise<Command> {
    // Fetch the user creating the command
    const user = await this.userService.findById(userId);

    // Fetch the client based on the client name in the command DTO
    const client = await this.clientModel.findOne({ name: createCommandDto.clientName }).exec();

    // Verify that both user and client are found and that their locations match
    if (!user || !client || user.location.toString() !== client.location.toString()) {
      throw new UnauthorizedException('User is not authorized to create a command for this client.');
    }

    // Calculate the total price
    const totalPrice = createCommandDto.productPrice * createCommandDto.productQuantity;
    createCommandDto.totalPrice = totalPrice;

    // Calculate the rest price
    const priceRest = totalPrice - createCommandDto.priceGivenByClient;
    createCommandDto.priceRest = priceRest;

    // Determine the client status based on the price given
    createCommandDto.clientStatus = priceRest > 0 ? 'not paid' : 'paid';

    // Create and save the new command
    const createdCommand = new this.commandModel({
      ...createCommandDto,
      createdBy: userId,
    });

    // Save the new command first
    const savedCommand = await createdCommand.save();

    // Update the client balance after saving the command
    await this.clientService.updateClientBalance(savedCommand.clientName);

    return savedCommand;
  }

  async findByUserId(userId: string): Promise<Command[]> {
    return this.commandModel.find({ createdBy: userId }).exec();
  }

  async findAll(): Promise<Command[]> {
    return this.commandModel.find().exec();
  }

  async findById(id: string): Promise<Command> {
    return this.commandModel.findById(id).exec();
  }

  async updateCommand(id: string, updateCommandDto: CreateCommandDto): Promise<Command> {
    // Recalculate the total price, price rest, and client status
    const totalPrice = updateCommandDto.productPrice * updateCommandDto.productQuantity;
    updateCommandDto.totalPrice = totalPrice;

    const priceRest = totalPrice - updateCommandDto.priceGivenByClient;
    updateCommandDto.priceRest = priceRest;

    updateCommandDto.clientStatus = priceRest > 0 ? 'not paid' : 'paid';

    const updatedCommand = await this.commandModel.findByIdAndUpdate(id, updateCommandDto, { new: true }).exec();

    // Update the client balance after updating the command
    if (updatedCommand) {
      await this.clientService.updateClientBalance(updatedCommand.clientName);
    }

    return updatedCommand;
  }

  async findByClientName(clientName: string): Promise<Command[]> {
    console.log(`Finding commands for client: ${clientName}`);
    return this.commandModel.find({ clientName }).exec();
  }

  async delete(id: string): Promise<Command> {
    const deletedCommand = await this.commandModel.findByIdAndDelete(id).exec();

    // Update the client balance after deleting the command
    if (deletedCommand) {
      await this.clientService.updateClientBalance(deletedCommand.clientName);
    }

    return deletedCommand;
  }

  async getClientBalance(clientId: string): Promise<number> {
    const commands = await this.commandModel.find({ createdBy: clientId }).exec();
    console.log('Commands:', commands); // Log commands

    const totalBalance = commands.reduce((balance, command) => {
      const commandBalance = command.totalPrice - command.priceGivenByClient;
      console.log(`Command ID: ${command._id}, Total: ${command.totalPrice}, Given: ${command.priceGivenByClient}, Balance: ${commandBalance}`);
      return balance + commandBalance;
    }, 0);

    console.log('Total Balance:', totalBalance); // Log total balance
    return totalBalance;
  }

  async updateClientBalance(clientId: string): Promise<void> {
    const balance = await this.getClientBalance(clientId);
    await this.clientModel.findByIdAndUpdate(clientId, { balance }).exec();
  }

  async createCommand(commandDto: any): Promise<Command> {
    const command = new this.commandModel(commandDto);
    await command.save();
    await this.updateClientBalance(commandDto.createdBy.toString());
    return command;
  }

  async getClientCommands(clientId: string): Promise<Command[]> {
    console.log('Fetching commands for client:', clientId);
    return this.commandModel.find({ createdBy: clientId }).exec();
  }
}
