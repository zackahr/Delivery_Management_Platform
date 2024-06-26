import { Controller, Post, Body, Get, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { usersService } from "./users.service";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { LoginUserDto } from "./dto/LoginUserDto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: usersService) {}

    // @Post()
    // @UsePipes(new ValidationPipe())
    // async create(@Body() createUserDto: CreateUserDto) {
    //     return this.usersService.createUser(createUserDto);
    // }


    // @Post('login')
    // @UsePipes(new ValidationPipe())
    // async login(@Body() loginUserDto: LoginUserDto) {
    //     const user = await this.usersService.findByCredentials(loginUserDto.username, loginUserDto.password);

    //     if (!user) {
    //         throw new HttpException('Username or Password is Incorrect', HttpStatus.UNAUTHORIZED);
    //     }

    //     // Here you can optionally return a token or user data as needed
    //     return { username: user.username };
    // }

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

    // @Post('register')
    // @UsePipes(new ValidationPipe())
    // async register(@Body() createUserDto: CreateUserDto) {
    //     const createdUser = await this.usersService.register(createUserDto);
    //     return { username: createdUser.username };
    // }
}