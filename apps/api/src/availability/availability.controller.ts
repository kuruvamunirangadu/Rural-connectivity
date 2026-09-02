import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  async createAvailability(@Body() body: any) {
    return this.availabilityService.create(body);
  }

  @Get('my')
  async getMyAvailability() {
    return this.availabilityService.getMyAvailability();
  }

  @Patch(':id')
  async updateAvailability(@Param('id') id: string, @Body() body: any) {
    return this.availabilityService.update(id, body);
  }

  @Delete(':id')
  async deleteAvailability(@Param('id') id: string) {
    return this.availabilityService.delete(id);
  }
}
