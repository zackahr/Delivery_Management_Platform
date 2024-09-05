// src/command/command.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommandService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/request.interface';
import { Command } from '../schemas/command.schema';

@Controller('api/command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCommand(@Body() createCommandDto: CreateCommandDto, @Req() request: AuthenticatedRequest) {
    return this.commandService.create(createCommandDto, request.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCommandsByUser(@Req() request: AuthenticatedRequest) {
    const commands = await this.commandService.findByUserId(request.user._id);
    return {
      message: 'Commands successfully retrieved',
      data: commands,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCommands() {
    return this.commandService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCommandById(@Param('id') id: string) {
    return this.commandService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // async updateCommand(@Param('id') id: string, @Body() updateCommandDto: CreateCommandDto) {
  //   return this.commandService.update(id, updateCommandDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCommand(@Param('id') id: string) {
    return this.commandService.delete(id);
  }
  
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCommand(@Param('id') id: string, @Body() commandDto: any): Promise<Command> {
    return this.commandService.updateCommand(id, commandDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('balance/:clientId')
  async getClientBalance(@Param('clientId') clientId: string): Promise<{ balance: number }> {
    const balance = await this.commandService.getClientBalance(clientId);
    return { balance };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':clientId')
  async getClientCommands(@Param('clientId') clientId: string): Promise<Command[]> {
    console.log("client is ==>",clientId)
    return this.commandService.getClientCommands(clientId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/client/:name')
  async getCommandsByClientName(@Param('name') clientName: string): Promise<Command[]> {
    return this.commandService.findByClientName(clientName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/creator/:userId')
  async getCommandsByCreator(@Param('userId') userId: string): Promise<Command[]> {
    return this.commandService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('date/:date')
  async getCommandsByDate(
    @Req() request: AuthenticatedRequest, 
    @Param('date') date: string,
  ) {
    const parsedDate = new Date(date);
    const commands = await this.commandService.getCommandsByDate(request.user._id, parsedDate);
    return {
      // message: 'Commands successfully retrieved',
      data: commands,
    };
  }
}
