import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './Users/users.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/nestdb'),
    UsersModule,
    CommandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
