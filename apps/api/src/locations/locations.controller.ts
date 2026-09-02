import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async createLocation(@Body() body: any) {
    return this.locationsService.createLocation(body);
  }

  @Get()
  async getLocations(
    @Query('state') state?: string,
    @Query('district') district?: string,
    @Query('mandal') mandal?: string,
    @Query('village') village?: string
  ) {
    return this.locationsService.getLocations({ state, district, mandal, village });
  }

  @Get(':id')
  async getLocationById(@Param('id') id: string) {
    return this.locationsService.getLocationById(id);
  }

  @Patch(':id')
  async updateLocation(@Param('id') id: string, @Body() body: any) {
    return this.locationsService.updateLocation(id, body);
  }

  @Delete(':id')
  async deleteLocation(@Param('id') id: string) {
    return this.locationsService.deleteLocation(id);
  }
}
