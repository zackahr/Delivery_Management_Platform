import { Controller, Post, Body, Get, Put, Param, Delete, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { usersService } from "./users.service";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: usersService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.usersService.createUser(createUserDto);
    }

    // @Get()
    // async findAll() {
    //     return this.usersService.findAll();
    // }

    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     return this.usersService.findOne(id);
    // }

    // @Put(':id')
    // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(id, updateUserDto);
    // }

    // @Delete(':id')
    // async remove(@Param('id') id: string) {
    //     return this.usersService.remove(id);
    // }
}