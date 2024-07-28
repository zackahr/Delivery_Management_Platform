import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from './location.schema';
import { Command } from './command.schema';
import { Role } from '../user/enums/role.enum'; // Import the Role enum

// Define the User schema
@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(Role), default: Role.USER })
  role: Role;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  location: Location;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Command' }])
  commands: Command[];
}

// Create the schema factory for User
export const UserSchema = SchemaFactory.createForClass(User);

// Define the UserDocument type
export type UserDocument = User & Document;
