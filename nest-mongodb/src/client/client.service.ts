import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthenticatedRequest } from '../auth/request.interface';
import { UserService } from '../user/user.service';
import { Command } from '../schemas/command.schema';
import { Location, LocationDocument } from '../schemas/location.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Command.name) private commandModel: Model<Command>,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createClientDto: CreateClientDto, request: AuthenticatedRequest): Promise<Client> {
    const user = await this.userService.findById(request.user._id);

    if (!user || !user.location) {
      throw new UnauthorizedException('User is not authenticated or does not have a location assigned.');
    }

    const newClient = new this.clientModel({
      ...createClientDto,
      location: user.location, // Assign user's location to the client
      balance: 0, // Initialize balance to 0
      clientLocation: createClientDto.clientLocation, // Include client-specific location
    });

    return newClient.save();
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().populate('location').exec();
  }

  async findById(id: string): Promise<Client> {
    return this.clientModel.findById(id).populate('location').exec();
  }

  async findByLocation(locationId: string): Promise<Client[]> {
    return this.clientModel
      .find({ location: locationId })
      .populate('location') // Populate the location field
      .exec();
  }

  async findByName(clientName: string): Promise<Client> {
    console.log("client name: ", clientName);
    return this.clientModel.findOne({ name: clientName }).exec();
  }

  async update(id: string, updateClientDto: CreateClientDto): Promise<Client> {
    return this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .populate('location')
      .exec();
  }

  async delete(id: string): Promise<Client> {
    return this.clientModel.findByIdAndDelete(id).exec();
  }

  async updateClientBalance(clientName: string): Promise<void> {
    // Fetch all commands for the given client name
    const commands = await this.commandModel.find({ clientName }).exec();
  
    // Calculate the balance based on the fetched commands
    const balance = commands.reduce((acc, command) => {
      const rest = command.priceGivenByClient - (command.productPrice * command.productQuantity);
      console.log(`Command ID: ${command._id}, rest: ${rest}, current acc: ${acc}`);
      return acc + rest;
    }, 0);
  
    console.log(`Calculated balance for client ${clientName} is ${balance}`);
  
    // Update the client's balance in the database
    const updateResult = await this.clientModel.updateOne({ name: clientName }, { balance }).exec();
    console.log(`Update result: ${updateResult}`);
  }

  async findByLocationName(locationName: string): Promise<Client[]> {
    // Find the location by name
    const location = await this.locationModel.findOne({ name: locationName }).exec();
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Find clients by the location's _id
    return this.clientModel.find({ location: location._id }).populate('location').exec();
  }
}
