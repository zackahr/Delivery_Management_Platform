import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location extends Document {
  @Prop({ required: true })
  name: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Export the type `LocationDocument` to be used in your service
export type LocationDocument = Location & Document;
