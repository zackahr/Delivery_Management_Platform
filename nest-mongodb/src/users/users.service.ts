import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async findOne(userId: string): Promise<User | null> {
        return this.userModel.findById(userId).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }
    
    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    async deleteUser(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }
}
