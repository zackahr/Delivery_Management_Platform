import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { Command, CommandSchema } from '../schemas/command.schema';
import { Client, ClientSchema } from '../schemas/client.schema';
import { ProductsModule } from '../products/products.module'; // Ensure correct path to ProductsModule
import { ProductsService } from '../products/products.service'; // Ensure correct path to ProductsService

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
        MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
        ProductsModule, // Ensure ProductsModule is imported correctly
    ],
    controllers: [CommandsController],
    providers: [
        CommandsService,
        // ProductsService, // Ensure ProductsService is included in providers
    ],
})
export class CommandsModule {}
