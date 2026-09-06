import { Controller, Get, Query } from '@nestjs/common';
import { ProduceSearchService, SearchQueryDto } from './produce-search.service';

@Controller('marketplace')
export class MarketplaceSearchController {
  constructor(private readonly searchService: ProduceSearchService) {}

  @Get('search')
  searchProduce(
    @Query('query') query?: string,
    @Query('crop') crop?: string,
    @Query('variety') variety?: string,
    @Query('qualityGrade') qualityGrade?: string,
    @Query('district') district?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minQuantity') minQuantity?: string,
    @Query('sellerType') sellerType?: 'FARMER' | 'FPO',
    @Query('status') status?: string
  ) {
    const params: SearchQueryDto = {
      query,
      crop,
      variety,
      qualityGrade,
      district,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minQuantity: minQuantity ? parseFloat(minQuantity) : undefined,
      sellerType,
      status,
    };
    return this.searchService.searchListings(params);
  }

  @Get('price-trends')
  getPriceTrends() {
    return this.searchService.getPriceTrends();
  }

  @Get('categories')
  getCategories() {
    return this.searchService.getCategories();
  }
}
