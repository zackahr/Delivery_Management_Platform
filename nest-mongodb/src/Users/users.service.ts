import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class usersService{
    constructor( @InjectModel(User.name) private readonly userModel: Model<User> ) {}

    async createUser(createUserDto: CreateUserDto){
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async getUsers(){
        return this.userModel.find();
    }

    async getUserById(id: string){
        return this.userModel.findById(id);
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deleteUser(id: string){
        return this.userModel.findByIdAndDelete(id);
    }

    async findByCredentials(username: string, password: string): Promise<User | null> {
        const user = await this.userModel.findOne({ username });

        if (!user) {
            return null; // User not found
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return null; // Passwords don't match
        }

        return user; // User found and password matches
    }
}