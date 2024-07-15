import { Controller, Post, Body, Get, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/request.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
            const user = await this.authService.validateUser(loginUserDto.username, loginUserDto.password);
            return this.authService.login(user);
        } catch (error) {
            throw new HttpException('Username or Password is Incorrect', HttpStatus.UNAUTHORIZED);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsers() {
        console.log("recieved")
        return await this.usersService.findAll(); // Fetch all users
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: AuthenticatedRequest) {
        try {
            const userId = req.user.userId; // Assuming your token payload has userId
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
        }
        const user = await this.usersService.getUserById(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
        }
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return updatedUser;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
        }
        const deletedUser = await this.usersService.deleteUser(id);
        if (!deletedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return deletedUser;
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const createdUser = await this.usersService.register(createUserDto);
            return { username: createdUser.username };
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
