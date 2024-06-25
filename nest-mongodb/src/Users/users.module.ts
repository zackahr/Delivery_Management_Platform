import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { usersService } from "./users.service";
import { UsersController } from "./users.controller";
@Module({
    imports: [ 
        MongooseModule.forFeature([
            { 
                name: User.name,
                schema: UserSchema
            }
        ]
        ) 
    ],
    providers: [usersService],
    controllers: [UsersController],
})

export class UsersModule {}