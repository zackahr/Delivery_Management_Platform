import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Client } from './client.schema';
import { Product } from './product.schema';

@Schema()
export class Command extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Client', required: true })
    client: Client;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    totalPrice: number;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
