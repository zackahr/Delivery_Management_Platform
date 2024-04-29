import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class usersService{
    constructor( @InjectModel(User.name) private readonly userModel: Model<User> ) {}

    createUser(createUserDto: CreateUserDto){
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }
}