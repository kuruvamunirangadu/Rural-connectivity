import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ProduceListingService } from './produce-listing.service';

@Controller('produce-listings')
export class ProduceListingController {
  constructor(private readonly listingService: ProduceListingService) {}

  @Get()
  listListings(
    @Query('crop') crop?: string,
    @Query('variety') variety?: string,
    @Query('qualityGrade') qualityGrade?: string,
    @Query('district') district?: string,
    @Query('status') status?: string,
    @Query('sellerType') sellerType?: 'FARMER' | 'FPO'
  ) {
    return this.listingService.listListings({ crop, variety, qualityGrade, district, status, sellerType });
  }

  @Get(':id')
  getListing(@Param('id') id: string) {
    return this.listingService.getListing(id);
  }

  @Post()
  createListing(@Body() body: any) {
    return this.listingService.createListing(body);
  }

  @Patch(':id')
  updateListing(@Param('id') id: string, @Body() body: any) {
    return this.listingService.updateListing(id, body);
  }

  @Delete(':id')
  deleteListing(@Param('id') id: string) {
    return this.listingService.deleteListing(id);
  }
}
