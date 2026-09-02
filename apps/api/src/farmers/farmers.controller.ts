import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { FarmersService } from './farmers.service';

@Controller()
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get('farmers/me')
  async getFarmerProfile() {
    return this.farmersService.getProfile();
  }

  @Patch('farmers/me')
  async updateFarmerProfile(@Body() body: any) {
    return this.farmersService.updateProfile(body);
  }

  @Post('farms')
  async createFarm(@Body() body: any) {
    return this.farmersService.createFarm(body);
  }

  @Get('farms')
  async getFarms() {
    return this.farmersService.getFarms();
  }

  @Get('farms/:id')
  async getFarmById(@Param('id') id: string) {
    return this.farmersService.getFarmById(id);
  }

  @Patch('farms/:id')
  async updateFarm(@Param('id') id: string, @Body() body: any) {
    return this.farmersService.updateFarm(id, body);
  }

  @Delete('farms/:id')
  async deleteFarm(@Param('id') id: string) {
    return this.farmersService.deleteFarm(id);
  }
}
