import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProduceOfferService } from './produce-offer.service';

@Controller('produce-offers')
export class ProduceOfferController {
  constructor(private readonly offerService: ProduceOfferService) {}

  @Get()
  listOffers(
    @Query('listingId') listingId?: string,
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string
  ) {
    return this.offerService.listOffers({ listingId, buyerId, sellerId, status });
  }

  @Get(':id')
  getOffer(@Param('id') id: string) {
    return this.offerService.getOffer(id);
  }

  @Post()
  createOffer(@Body() body: any) {
    return this.offerService.createOffer(body);
  }

  @Post(':id/counter')
  counterOffer(@Param('id') id: string, @Body() body: any) {
    return this.offerService.counterOffer(id, body);
  }

  @Post(':id/accept')
  acceptOffer(@Param('id') id: string) {
    return this.offerService.acceptOffer(id);
  }

  @Post(':id/reject')
  rejectOffer(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.offerService.rejectOffer(id, body.reason);
  }
}
