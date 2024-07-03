import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { Command, CommandSchema } from '../schemas/command.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
    ],
    controllers: [CommandsController],
    providers: [
        CommandsService,
        // ProductsService, // Ensure ProductsService is included in providers
    ],
})
export class CommandsModule {}
