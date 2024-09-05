import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Define a schema for client-specific location as a subdocument
@Schema()
export class ClientLocation {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address?: string;  // Optional address field
}

const ClientLocationSchema = SchemaFactory.createForClass(ClientLocation);

@Schema()
export class Client extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
  location: MongooseSchema.Types.ObjectId; // Reference to an external Location schema

  @Prop({ default: 0 })
  balance: number; // Balance field

  @Prop({ type: ClientLocationSchema, required: true })
  clientLocation: ClientLocation;  // Embedded client-specific location field
}

export const ClientSchema = SchemaFactory.createForClass(Client);

export type ClientDocument = Client & Document;
