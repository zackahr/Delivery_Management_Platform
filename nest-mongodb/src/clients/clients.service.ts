import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly clientModel: Model<Client>) {}

    async createClient(createClientDto: CreateClientDto) {
        const { name } = createClientDto;

        // Check if a client with the same name already exists
        const existingClient = await this.clientModel.findOne({ name }).exec();
        if (existingClient) {
            throw new ConflictException('Client with this name already exists.');
        }

        // Create new client if no existing client with the same name
        const newClient = new this.clientModel(createClientDto);
        return newClient.save();
    }

    async findAll(): Promise<Client[]> {
        return this.clientModel.find().exec();
    }

    async findOne(id: string): Promise<Client> {
        const client = await this.clientModel.findById(id).exec();
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        return client;
    }

    async findByAddress(address: string) {
        return this.clientModel.find({ address }).exec();
    }
    
    async updateClient(id: string, updateClientDto: CreateClientDto): Promise<Client> {
        const updatedClient = await this.clientModel.findByIdAndUpdate(id, updateClientDto, { new: true });
        if (!updatedClient) {
            throw new NotFoundException('Client not found');
        }
        return updatedClient;
    }
    
    async removeClient(id: string): Promise<Client> {
        const deletedClient = await this.clientModel.findByIdAndDelete(id);
        if (!deletedClient) {
            throw new NotFoundException('Client not found');
        }
        return deletedClient;
    }
    async findByUsername(username: string): Promise<Client | null> {
        const client = await this.clientModel.findOne({ username }).exec();
        if (!client) {
          throw new NotFoundException('Client not found');
        }
        return client;
      }
}
