// src/command/command.module.ts
import { Module , forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from '../schemas/command.schema';
import { CommandService } from './commands.service';
import { CommandController } from './commands.controller';
import { UserModule } from '../user/user.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => ClientModule),
  ],
  providers: [CommandService],
  controllers: [CommandController],
  exports: [CommandService], // Export CommandService so it can be used in other modules
})
export class CommandModule {}
