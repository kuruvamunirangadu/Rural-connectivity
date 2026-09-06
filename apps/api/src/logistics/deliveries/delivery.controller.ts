import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('logistics/deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':tripId')
  getDelivery(@Param('tripId') tripId: string) {
    return this.deliveryService.getDeliveryByTrip(tripId);
  }

  @Post('confirm')
  confirmDelivery(@Body() body: any) {
    return this.deliveryService.confirmDelivery(body);
  }
}
