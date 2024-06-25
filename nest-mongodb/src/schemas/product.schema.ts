// src/products/product.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: Number })
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
