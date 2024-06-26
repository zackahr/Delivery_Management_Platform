import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string; // This will store the hashed password

    @Prop({ required: true, enum: ['admin', 'delivery'], default: 'delivery' })
    role: string; // Role of the user, defaults to 'delivery'
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
    const user = this as any; // Cast `this` to `any` type to access properties directly
    if (!user.isModified('password')) { // Check if password is modified
        return next();
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});
