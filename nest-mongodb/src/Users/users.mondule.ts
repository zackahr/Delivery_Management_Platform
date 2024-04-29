import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";

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
        
})

export class UsersModule {}