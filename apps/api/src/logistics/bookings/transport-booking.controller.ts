import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { TransportBookingService, TransportBookingState } from './transport-booking.service';

@Controller('logistics/bookings')
export class TransportBookingController {
  constructor(private readonly bookingService: TransportBookingService) {}

  @Get()
  listBookings(
    @Query('customerId') customerId?: string,
    @Query('providerId') providerId?: string,
    @Query('status') status?: string
  ) {
    return this.bookingService.listBookings({ customerId, providerId, status });
  }

  @Get(':id')
  getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }

  @Post('accept-offer/:offerId')
  createFromOffer(
    @Param('offerId') offerId: string,
    @Body('customerId') customerId: string
  ) {
    return this.bookingService.createBookingFromOffer(offerId, customerId);
  }

  @Patch(':id/status')
  transitionStatus(
    @Param('id') id: string,
    @Body('status') status: TransportBookingState
  ) {
    return this.bookingService.transitionStatus(id, status);
  }
}
