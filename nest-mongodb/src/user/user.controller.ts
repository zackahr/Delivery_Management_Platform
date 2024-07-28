import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/request.interface';
import { CommandService } from 'src/commands/commands.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly commandService: CommandService,
  ) {}

  // Endpoint to create a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Endpoint to log in a user
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Endpoint to get the current user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    const userData = await this.userService.findById(user._id);
    const commands = await this.commandService.findByUserId(user._id); // Fetch commands created by the user

    return {
      message: 'User successfully authenticated',
      data: {
        ...userData.toObject(), // Convert Mongoose document to plain object
        commands, // Add commands to the response
      },
    };
  }

  // Endpoint to get a user by username
  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  // Endpoint to get all users
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  // Endpoint to get a user by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    const commands = await this.commandService.findByUserId(id); // Fetch commands created by the user

    return {
      message: 'User successfully retrieved',
      data: {
        ...user.toObject(), // Convert Mongoose document to plain object
        commands, // Add commands to the response
      },
    };
  }

  // Endpoint to update a user
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // Endpoint to delete a user
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
