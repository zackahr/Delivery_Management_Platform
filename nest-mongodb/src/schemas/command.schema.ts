import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Command extends Document {
  @Prop({ required: true })
  commandOwner: string; // Command owner

  @Prop({ required: true })
  userAddress: string; // User address

  @Prop({ required: true })
  productName: string; // Product name

  @Prop({ required: true})
  productPrice: number;

  @Prop({ required: true })
  productQuantity: number; // Product Quantity

  @Prop({ required: false })
  totalPrice: number; // Total Price

  @Prop({ default: 0 })
  paidAmount: number; // Paid Amount

  @Prop({ default: 0 })
  paidRemain: number; // Paid Remain

  @Prop({ default: false })
  paidStatus: boolean; // Paid Status

  @Prop({ default: Date.now })
  createdAt: Date; // Created at
}

export const CommandSchema = SchemaFactory.createForClass(Command);
