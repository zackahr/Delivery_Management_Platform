import { Controller, Post, Body, Get, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { usersService } from "./users.service";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { LoginUserDto } from "./dto/LoginUserDto";
import { CreateUserDto } from "./dto/CreateUser.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: usersService) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.usersService.findByCredentials(loginUserDto.username, loginUserDto.password);

        if (!user) {
            throw new HttpException('Username or Password is Incorrect', HttpStatus.UNAUTHORIZED);
        }

        // Assuming user has a `_id` property
        const { username, role } = user;
        return { username, role };
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

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto) {
        const createdUser = await this.usersService.register(createUserDto);
        return { username: createdUser.username };
    }
}
