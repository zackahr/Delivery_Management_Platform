import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from '../schemas/client.schema';
import { UserModule } from '../user/user.module'; // Import UserModule
import { Command, CommandSchema } from '../schemas/command.schema';
import { Location, LocationSchema } from 'src/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),

    forwardRef(() => UserModule), // Use forwardRef here if there's a circular dependency
    // forwardRef(() => CommandModule), // Use forwardRef here if there's a circular dependency
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, MongooseModule],
})
export class ClientModule {}
