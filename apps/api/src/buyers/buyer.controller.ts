import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { ProduceListingService, BuyerPurchaseOrderDto } from './produce-listing.service';

@Controller('buyers')
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly produceListingService: ProduceListingService
  ) {}

  @Get()
  listBuyers(@Query('buyerType') buyerType?: string) {
    return this.buyerService.listBuyers({ buyerType });
  }

  @Get(':id')
  getBuyer(@Param('id') id: string) {
    return this.buyerService.getBuyer(id);
  }

  @Post()
  registerBuyer(@Body() body: any) {
    return this.buyerService.registerBuyer(body);
  }

  @Get('produce/listings')
  listProduceListings(
    @Query('crop') crop?: string,
    @Query('district') district?: string,
    @Query('status') status?: string
  ) {
    return this.produceListingService.listListings({ crop, district, status });
  }

  @Get('produce/listings/:id')
  getProduceListing(@Param('id') id: string) {
    return this.produceListingService.getListing(id);
  }

  @Post('produce/listings')
  createProduceListing(@Body() body: any) {
    return this.produceListingService.createListing(body);
  }

  @Post('produce/listings/:id/order')
  placeOrder(@Param('id') id: string, @Body() body: Omit<BuyerPurchaseOrderDto, 'listingId'>) {
    return this.produceListingService.placeOrder({ ...body, listingId: id });
  }

  @Get('orders/history')
  listOrders(@Query('buyerId') buyerId?: string) {
    return this.produceListingService.listOrders(buyerId);
  }
}
