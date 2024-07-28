import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Location, LocationSchema } from '../schemas/location.schema';
import { Command, CommandSchema } from '../schemas/command.schema';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { CommandModule } from 'src/commands/commands.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    MongooseModule.forFeature([{ name: Command.name, schema: CommandSchema }]),
    forwardRef(() => AuthModule), // Use forwardRef if AuthModule is imported here
    forwardRef(() => CommandModule), // Use forwardRef if AuthModule is imported here
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
