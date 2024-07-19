import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';

@Controller('api/commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createCommandDto: CreateCommandDto) {
    // Determine paidStatus based on the provided paidAmount
    createCommandDto.paidStatus = createCommandDto.paidAmount === createCommandDto.productPrice * createCommandDto.productQuantity;

    const createdCommand = await this.commandsService.createCommand(createCommandDto);
    return {
      createdAt: createdCommand.createdAt,
      commandOwner: createdCommand.commandOwner,
      productName: createdCommand.productName,
      productQuantity: createdCommand.productQuantity,
      productPrice: createdCommand.productPrice,
      paidAmount: createdCommand.paidAmount,
    };
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
  async update(@Param('id') id: string, @Body() updateCommandDto: Partial<CreateCommandDto>) {
    return this.commandsService.updateCommand(id, updateCommandDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commandsService.removeCommand(id);
  }
}
