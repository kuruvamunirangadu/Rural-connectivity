import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { ProduceListingService } from './produce-listing.service';
import { BuyerController } from './buyer.controller';

@Module({
  controllers: [BuyerController],
  providers: [BuyerService, ProduceListingService],
  exports: [BuyerService, ProduceListingService],
})
export class BuyerModule {}

