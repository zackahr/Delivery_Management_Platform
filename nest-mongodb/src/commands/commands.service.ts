import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command } from '../schemas/command.schema';
import { CreateCommandDto } from './dto/create-command.dto';
import { ProductsService } from '../products/products.service';
import { Client } from '../schemas/client.schema';

@Injectable()
export class CommandsService {
    constructor(
        @InjectModel(Command.name) private readonly commandModel: Model<Command>,
        @InjectModel(Client.name) private readonly clientModel: Model<Client>,
        private readonly productsService: ProductsService
    ) {}

    async createCommand(createCommandDto: CreateCommandDto) {
        const { clientName, productName, quantity } = createCommandDto;

        // Fetch product by name
        const product = await this.productsService.findByName(productName);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Fetch client by name
        const client = await this.clientModel.findOne({ name: clientName }).exec();
        if (!client) {
            throw new NotFoundException('Client not found');
        }

        // Calculate total price
        const totalPrice = product.price * quantity;

        const newCommand = new this.commandModel({
            client: client._id,
            product: product._id,
            quantity,
            totalPrice,
        });

        return newCommand.save();
    }

    async findAll() {
        return this.commandModel.find().populate('client', 'name').populate('product', 'name').exec();
    }

    async findOne(id: string) {
        const command = await this.commandModel.findById(id).populate('client', 'name').populate('product', 'name').exec();
        if (!command) {
            throw new NotFoundException('Command not found');
        }
        return command;
    }

    async findCommandsByClientName(clientName: string) {
        const client = await this.clientModel.findOne({ name: clientName }).exec();
        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return this.commandModel.find({ client: client._id }).populate('client', 'name').populate('product', 'name').exec();
    }

    async updateCommand(id: string, updateCommandDto: CreateCommandDto) {
        const updatedCommand = await this.commandModel.findByIdAndUpdate(id, updateCommandDto, { new: true });
        if (!updatedCommand) {
            throw new NotFoundException('Command not found');
        }
        return updatedCommand;
    }

    async removeCommand(id: string) {
        const deletedCommand = await this.commandModel.findByIdAndDelete(id);
        if (!deletedCommand) {
            throw new NotFoundException('Command not found');
        }
        return deletedCommand;
    }
}
