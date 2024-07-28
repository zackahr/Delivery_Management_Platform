import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location, LocationSchema } from '../schemas/location.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationModule {}
