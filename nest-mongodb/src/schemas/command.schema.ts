// src/command/schemas/command.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Command extends Document {
  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  productPrice: number;

  @Prop({ required: true })
  productQuantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  priceGivenByClient: number;

  @Prop()
  priceRest: number;

  @Prop({ required: true })
  clientStatus: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommandSchema = SchemaFactory.createForClass(Command);

export type CommandDocument = Command & Document;