import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string; // This will store the plaintext password

    @Prop({ required: true, enum: ['admin', 'delivery'], default: 'delivery' })
    role: string; // Role of the user, defaults to 'delivery'
}

export const UserSchema = SchemaFactory.createForClass(User);