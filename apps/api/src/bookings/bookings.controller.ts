import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() body: any) {
    return this.bookingsService.createBooking(body);
  }

  @Get('my')
  async getMyBookings() {
    return this.bookingsService.getMyBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Post(':id/arrived')
  async markArrived(@Param('id') id: string) {
    return this.bookingsService.markArrived(id);
  }

  @Post(':id/start')
  async startWork(@Param('id') id: string) {
    return this.bookingsService.startWork(id);
  }

  @Post(':id/complete')
  async completeWork(
    @Param('id') id: string,
    @Body() body: { actualHours: number; actualArea: number; notes?: string }
  ) {
    return this.bookingsService.completeWork(id, body);
  }

  @Post(':id/confirm')
  async confirmCompletion(@Param('id') id: string) {
    return this.bookingsService.confirmCompletion(id);
  }

  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string, @Body() body: { reason: string; cancelledBy?: string }) {
    return this.bookingsService.cancelBooking(id, body.reason, body.cancelledBy);
  }

  @Post(':id/dispute')
  async raiseDispute(@Param('id') id: string, @Body() body: { reason: string; description?: string }) {
    return this.bookingsService.raiseDispute(id, body);
  }

  @Post(':id/rating')
  async submitRating(
    @Param('id') id: string,
    @Body() body: { score: number; review?: string; fromUserId?: string; toUserId?: string }
  ) {
    return this.bookingsService.submitRating(id, body);
  }
}
