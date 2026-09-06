import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { BuyerInterestService } from './buyer-interest.service';

@Controller('buyer-interests')
export class BuyerInterestController {
  constructor(private readonly interestService: BuyerInterestService) {}

  @Get()
  listInterests(
    @Query('listingId') listingId?: string,
    @Query('buyerId') buyerId?: string,
    @Query('status') status?: string
  ) {
    return this.interestService.listInterests({ listingId, buyerId, status });
  }

  @Get(':id')
  getInterest(@Param('id') id: string) {
    return this.interestService.getInterest(id);
  }

  @Post()
  createInterest(@Body() body: any) {
    return this.interestService.createInterest(body);
  }

  @Patch(':id/respond')
  respondToInterest(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.interestService.respondToInterest(id, body.notes);
  }

  @Patch(':id/convert-to-offer')
  convertToOffer(@Param('id') id: string) {
    return this.interestService.convertToOffer(id);
  }
}
