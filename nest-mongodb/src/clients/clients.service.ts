// src/clients/clients.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly clientModel: Model<Client>) {}

    async createClient(createClientDto: CreateClientDto) {
        const newClient = new this.clientModel(createClientDto);
        return newClient.save();
    }

    async findAll() {
        return this.clientModel.find().exec();
    }

    async findOne(id: string) {
        const client = await this.clientModel.findById(id).exec();
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        return client;
    }

    async updateClient(id: string, updateClientDto: CreateClientDto) {
        const updatedClient = await this.clientModel.findByIdAndUpdate(id, updateClientDto, { new: true });
        if (!updatedClient) {
            throw new NotFoundException('Client not found');
        }
        return updatedClient;
    }
    
    async findByName(name: string) {
        return this.clientModel.findOne({ name }).exec();
    }

    async removeClient(id: string) {
        const deletedClient = await this.clientModel.findByIdAndDelete(id);
        if (!deletedClient) {
            throw new NotFoundException('Client not found');
        }
        return deletedClient;
    }
}
