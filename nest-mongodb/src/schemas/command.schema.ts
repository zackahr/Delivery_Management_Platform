// src/schemas/command.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from './client.schema'; // Import Client schema
import { Product } from './product.schema';

@Schema()
export class Command extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Client' }) // Reference to Client schema
    clientId: Client['_id'];

    @Prop({ type: Types.ObjectId, ref: 'Product' }) // Reference to Product schema
    productId: Product['_id'];

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    totalPrice: number;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
