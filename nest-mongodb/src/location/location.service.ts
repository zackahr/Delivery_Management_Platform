import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/location.schema';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
    constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) {}

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const createdLocation = new this.locationModel(createLocationDto);
        return createdLocation.save();
    }

    async findAll(): Promise<Location[]> {
        return this.locationModel.find().exec();
    }

    async findById(id: string): Promise<Location> {
        return this.locationModel.findById(id).exec();
    }

    async findByName(name: string): Promise<Location | null> {
        return this.locationModel.findOne({ name }).exec();
    }

    async update(id: string, updateLocationDto: CreateLocationDto): Promise<Location> {
        return this.locationModel.findByIdAndUpdate(id, updateLocationDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Location> {
        return this.locationModel.findByIdAndDelete(id).exec();
    }
}
