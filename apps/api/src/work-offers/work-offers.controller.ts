import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WorkOffersService } from './work-offers.service';

@Controller('work-offers')
export class WorkOffersController {
  constructor(private readonly workOffersService: WorkOffersService) {}

  @Post()
  async createOffer(@Body() body: any) {
    return this.workOffersService.createOffer(body);
  }

  @Get('my')
  async getMyOffers() {
    return this.workOffersService.getMyOffers();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: string) {
    return this.workOffersService.getOfferById(id);
  }

  @Post(':id/accept')
  async acceptOffer(@Param('id') id: string) {
    return this.workOffersService.acceptOffer(id);
  }

  @Post(':id/reject')
  async rejectOffer(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.workOffersService.rejectOffer(id, body?.reason);
  }
}
