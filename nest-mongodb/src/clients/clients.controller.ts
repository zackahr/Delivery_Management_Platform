// src/clients/clients.controller.ts

import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.createClient(createClientDto);
    }

    @Get()
    async findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updateClientDto: CreateClientDto) {
        return this.clientsService.updateClient(id, updateClientDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.clientsService.removeClient(id);
    }
}
