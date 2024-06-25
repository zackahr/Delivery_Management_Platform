// src/commands/commands.controller.ts

import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';

@Controller('commands')
export class CommandsController {
    constructor(private readonly commandsService: CommandsService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createCommandDto: CreateCommandDto) {
        const createdCommand = await this.commandsService.createCommand(createCommandDto);
        return { commandId: createdCommand.id };
    }

    @Get()
    async findAll() {
        return this.commandsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.commandsService.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updateCommandDto: CreateCommandDto) {
        return this.commandsService.updateCommand(id, updateCommandDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.commandsService.removeCommand(id);
    }
}
