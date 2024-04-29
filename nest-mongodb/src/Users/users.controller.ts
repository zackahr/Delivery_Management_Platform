import { Controller, Post, Body, Get, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { usersService } from "./users.service";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/UpdateUser.dto";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: usersService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    async getUsers() {    
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', 404);
        }
        const findUser = this.usersService.getUserById(id);
        return findUser;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', 404);
        }
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', 404);
        }
        return this.usersService.deleteUser(id);
    }
}