import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TripService } from './trip.service';
import { TrackingService } from '../tracking/tracking.service';

@Controller('logistics/trips')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly trackingService: TrackingService
  ) {}

  @Get()
  listTrips(@Query('status') status?: string) {
    return this.tripService.listTrips(status);
  }

  @Get(':id')
  getTrip(@Param('id') id: string) {
    return this.tripService.getTrip(id);
  }

  @Get(':id/events')
  getTripEvents(@Param('id') id: string) {
    return this.trackingService.getEventsForTrip(id);
  }

  @Post(':id/events')
  addTripEvent(
    @Param('id') id: string,
    @Body() body: { milestone: any; locationName: string; notes?: string; recordedBy?: string }
  ) {
    return this.trackingService.recordEvent({
      tripId: id,
      milestone: body.milestone,
      locationName: body.locationName,
      notes: body.notes,
      recordedBy: body.recordedBy,
    });
  }

  @Post('start')
  startTrip(@Body() body: { bookingId: string; notes?: string }) {
    return this.tripService.startTrip(body.bookingId, body.notes);
  }

  @Post(':id/complete')
  completeTrip(
    @Param('id') id: string,
    @Body() body: { actualDistanceKm?: number; durationMinutes?: number }
  ) {
    return this.tripService.completeTrip(id, body.actualDistanceKm, body.durationMinutes);
  }
}
