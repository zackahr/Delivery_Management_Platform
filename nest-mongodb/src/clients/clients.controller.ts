import { Controller, Get, ConflictException, NotFoundException, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from '../schemas/client.schema';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
        try {
            return await this.clientsService.createClient(createClientDto);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    async findAll(): Promise<Client[]> {
        return this.clientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Client> {
        return this.clientsService.findOne(id);
    }

    @Get('byAddress/:address')
    async findByAddress(@Param('address') address: string) {
        return this.clientsService.findByAddress(address);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updateClientDto: CreateClientDto): Promise<Client> {
        return this.clientsService.updateClient(id, updateClientDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Client> {
        return this.clientsService.removeClient(id);
    }
    @Get(':username')
    async getClientByUsername(@Param('username') username: string): Promise<Client> {
        try {
            const client = await this.clientsService.findByUsername(username);
            return client;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}
