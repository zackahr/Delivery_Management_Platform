import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('api/location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Post()
    async createLocation(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.create(createLocationDto);
    }

    @Get()
    async getAllLocations() {
        return this.locationService.findAll();
    }

    @Get(':id')
    async getLocationById(@Param('id') id: string) {
        return this.locationService.findById(id);
    }

    @Get('/name/:name')
    async getLocationByName(@Param('name') name: string) {
        return this.locationService.findByName(name);
    }

    @Patch(':id')
    async updateLocation(@Param('id') id: string, @Body() updateLocationDto: CreateLocationDto) {
        return this.locationService.update(id, updateLocationDto);
    }

    @Delete(':id')
    async deleteLocation(@Param('id') id: string) {
        return this.locationService.delete(id);
    }
}

