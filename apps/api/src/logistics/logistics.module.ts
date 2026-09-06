import { Module } from '@nestjs/common';
import { VehicleController } from './vehicles/vehicle.controller';
import { VehicleService } from './vehicles/vehicle.service';
import { DriverController } from './drivers/driver.controller';
import { DriverService } from './drivers/driver.service';
import { TransportRequestController } from './requests/transport-request.controller';
import { TransportRequestService } from './requests/transport-request.service';
import { TransportMatchingService } from './matching/transport-matching.service';
import { TransportOfferService } from './offers/transport-offer.service';
import { TransportBookingController } from './bookings/transport-booking.controller';
import { TransportBookingService } from './bookings/transport-booking.service';
import { TripController } from './trips/trip.controller';
import { TripService } from './trips/trip.service';
import { DeliveryController } from './deliveries/delivery.controller';
import { DeliveryService } from './deliveries/delivery.service';
import { TransportPricingService } from './pricing/transport-pricing.service';
import { TrackingService } from './tracking/tracking.service';

@Module({
  controllers: [
    VehicleController,
    DriverController,
    TransportRequestController,
    TransportBookingController,
    TripController,
    DeliveryController,
  ],
  providers: [
    VehicleService,
    DriverService,
    TransportRequestService,
    TransportMatchingService,
    TransportOfferService,
    TransportBookingService,
    TripService,
    DeliveryService,
    TransportPricingService,
    TrackingService,
  ],
  exports: [
    VehicleService,
    DriverService,
    TransportRequestService,
    TransportMatchingService,
    TransportOfferService,
    TransportBookingService,
    TripService,
    DeliveryService,
    TransportPricingService,
    TrackingService,
  ],
})
export class LogisticsModule {}

