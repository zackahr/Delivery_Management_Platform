import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
  location: MongooseSchema.Types.ObjectId; // Ensure this is of type ObjectId

  @Prop({ default: 0 })
  balance: number; // New balance field
}

export const ClientSchema = SchemaFactory.createForClass(Client);

export type ClientDocument = Client & Document;
