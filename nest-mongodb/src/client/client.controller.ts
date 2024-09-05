import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/request.interface';
import { Client } from '../schemas/client.schema';

@Controller('api/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createClient(@Body() createClientDto: CreateClientDto, @Req() request: AuthenticatedRequest) {
    return this.clientService.create(createClientDto, request);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllClients() {
    return this.clientService.findAll();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getClientById(@Param('id') id: string) {
    const client = await this.clientService.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateClient(@Param('id') id: string, @Body() updateClientDto: CreateClientDto) {
    const updatedClient = await this.clientService.update(id, updateClientDto);
    if (!updatedClient) {
      throw new NotFoundException('Client not found');
    }
    return updatedClient;
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    const deletedClient = await this.clientService.delete(id);
    if (!deletedClient) {
      throw new NotFoundException('Client not found');
    }
    return deletedClient;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/location/:locationId')
  async getClientsByLocation(@Param('locationId') locationId: string) {
    const clients = await this.clientService.findByLocation(locationId);
    if (!clients || clients.length === 0) {
      throw new NotFoundException('No clients found for this location');
    }
    return clients.map(client => ({
      ...client.toObject(),
      location: client.location // This will include the location details
    }));
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/location/name/:locationName')
  async getClientsByLocationName(@Param('locationName') locationName: string): Promise<Client[]> {
    const clients = await this.clientService.findByLocationName(locationName);
    if (!clients || clients.length === 0) {
      throw new NotFoundException('No clients found for this location');
    }
    return clients;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/username/:username')
  async getClientByUsername(@Param('username') username: string): Promise<Client> {
    const client = await this.clientService.findByName(username);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }
}
