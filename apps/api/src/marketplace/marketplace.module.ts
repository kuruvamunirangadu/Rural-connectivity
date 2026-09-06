import { Module } from '@nestjs/common';
import { ProduceListingService } from './listings/produce-listing.service';
import { ProduceListingController } from './listings/produce-listing.controller';
import { ProduceSearchService } from './search/produce-search.service';
import { MarketplaceSearchController } from './search/marketplace-search.controller';
import { BuyerInterestService } from './interests/buyer-interest.service';
import { BuyerInterestController } from './interests/buyer-interest.controller';
import { ProduceOfferService } from './offers/produce-offer.service';
import { ProduceOfferController } from './offers/produce-offer.controller';
import { ProduceOrderService } from './orders/produce-order.service';
import { ProduceOrderController } from './orders/produce-order.controller';
import { ProduceAggregationService } from './aggregation/produce-aggregation.service';
import { ProduceAggregationController } from './aggregation/produce-aggregation.controller';
import { ProduceQualityService } from './quality/produce-quality.service';
import { ProduceQualityController } from './quality/produce-quality.controller';
import { FulfillmentService } from './fulfillment/fulfillment.service';
import { FulfillmentController } from './fulfillment/fulfillment.controller';

@Module({
  imports: [],
  controllers: [
    ProduceListingController,
    MarketplaceSearchController,
    BuyerInterestController,
    ProduceOfferController,
    ProduceOrderController,
    ProduceAggregationController,
    ProduceQualityController,
    FulfillmentController,
  ],
  providers: [
    ProduceListingService,
    ProduceSearchService,
    BuyerInterestService,
    ProduceOfferService,
    ProduceOrderService,
    ProduceAggregationService,
    ProduceQualityService,
    FulfillmentService,
  ],
  exports: [
    ProduceListingService,
    ProduceSearchService,
    BuyerInterestService,
    ProduceOfferService,
    ProduceOrderService,
    ProduceAggregationService,
    ProduceQualityService,
    FulfillmentService,
  ],
})
export class MarketplaceModule {}
