import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command } from '../schemas/command.schema';
import { CreateCommandDto } from './dto/create-command.dto';

@Injectable()
export class CommandsService {
  constructor(
    @InjectModel(Command.name) private readonly commandModel: Model<Command>,
  ) {}

  async createCommand(createCommandDto: CreateCommandDto) {
    try {
      // Calculate totalPrice
      const totalPrice = createCommandDto.productPrice * createCommandDto.productQuantity;

      // Calculate paidRemain and paidStatus
      const paidRemain = totalPrice - createCommandDto.paidAmount;
      const paidStatus = paidRemain === 0 ? true : false;

      // Create new command object
      const newCommand = new this.commandModel({
        ...createCommandDto,
        totalPrice,
        paidRemain,
        paidStatus,
        createdAt: createCommandDto.createdAt || new Date(),
      });

      // Save to database
      const createdCommand = await newCommand.save();

      return {
        _id: createdCommand._id,
        commandOwner: createdCommand.commandOwner,
        userAddress: createdCommand.userAddress,
        productName: createdCommand.productName,
        productPrice: createdCommand.productPrice,
        productQuantity: createdCommand.productQuantity,
        totalPrice: createdCommand.totalPrice,
        paidAmount: createdCommand.paidAmount,
        paidRemain: createdCommand.paidRemain,
        paidStatus: createdCommand.paidStatus,
        createdAt: createdCommand.createdAt,
      };
    } catch (error) {
      console.error('Error creating command:', error);
      throw new InternalServerErrorException('Failed to create command');
    }
  }

  async findAll() {
    return this.commandModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const command = await this.commandModel.findById(id).exec();
    if (!command) {
      throw new NotFoundException('Command not found');
    }
    // Return a DTO that includes the `_id`
    return {
      _id: command._id,
      ...command.toJSON(),
    };
  }

  async updateCommand(id: string, updateCommandDto: Partial<CreateCommandDto>) {
    // Log the incoming updateCommandDto from the frontend
    console.log('Update Command DTO:', updateCommandDto);
  
    const existingCommand = await this.commandModel.findById(id).exec();
    if (!existingCommand) {
      throw new NotFoundException('Command not found');
    }
  
    const updatedFields: Partial<CreateCommandDto> = { ...updateCommandDto };
  
    // Recalculate totalPrice if quantity or price is updated
    if (updateCommandDto.productQuantity !== undefined || updateCommandDto.productPrice !== undefined) {
      const quantity = updateCommandDto.productQuantity !== undefined ? updateCommandDto.productQuantity : existingCommand.productQuantity;
      const price = updateCommandDto.productPrice !== undefined ? updateCommandDto.productPrice : existingCommand.productPrice;
      updatedFields.totalPrice = price * quantity;
    }
  
    // Calculate remain based on paidAmount
    if (updateCommandDto.paidAmount !== undefined) {
      const remain = updatedFields.totalPrice - updateCommandDto.paidAmount; // Calculate based on updated totalPrice
      updatedFields.paidRemain = remain;
  
      // Determine paidStatus based on paidRemain
      updatedFields.paidStatus = remain === 0;
    }
  
    await this.commandModel.findByIdAndUpdate(id, updatedFields).exec();
  
    // Fetch and return the updated command
    return this.commandModel.findById(id).exec();
  }
  

  async removeCommand(id: string) {
    try {
      const deletedCommand = await this.commandModel.findByIdAndDelete(id).exec();
      if (!deletedCommand) {
        throw new NotFoundException('Command not found');
      }
      return deletedCommand;
    } catch (error) {
      console.error('Error deleting command:', error);
      throw new InternalServerErrorException('Failed to delete command');
    }
  }
}
