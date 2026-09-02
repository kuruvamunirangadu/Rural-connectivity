import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingStateMachine, BookingState } from './booking-state-machine';

export interface BookingEntity {
  id: string;
  workRequestId: string;
  offerId: string;
  customerId: string;
  providerId: string;
  resourceType: string;
  resourceId: string;
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  agreedPrice: number;
  status: BookingState;
  cancellationDetails?: {
    reason: string;
    cancelledBy: string;
    cancelledAt: string;
  } | null;
  workSession: {
    id: string;
    arrivedAt?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    actualHours?: number | null;
    actualArea?: number | null;
    notes?: string | null;
    status: string;
  };
  ratings: Array<{
    id: string;
    fromUserId: string;
    toUserId: string;
    score: number;
    review?: string;
    createdAt: string;
  }>;
  dispute?: {
    id: string;
    reason: string;
    description?: string;
    status: string;
    createdAt: string;
  } | null;
}

@Injectable()
export class BookingsService {
  private bookings: BookingEntity[] = [
    {
      id: 'BK1001',
      workRequestId: 'wr_10001',
      offerId: 'offer-001',
      customerId: 'usr-ravi-001',
      providerId: 'to-suresh-002',
      resourceType: 'TRACTOR',
      resourceId: 'tr-002',
      scheduledDate: '2026-09-05',
      startTime: '07:00 AM',
      agreedPrice: 5000.0,
      status: 'SCHEDULED',
      cancellationDetails: null,
      workSession: {
        id: 'ws-001',
        arrivedAt: null,
        startedAt: null,
        completedAt: null,
        actualHours: null,
        actualArea: null,
        notes: null,
        status: 'NOT_STARTED',
      },
      ratings: [],
      dispute: null,
    },
  ];

  async getMyBookings(): Promise<BookingEntity[]> {
    return this.bookings;
  }

  async getBookingById(id: string): Promise<BookingEntity> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  async createBooking(dto: any): Promise<BookingEntity> {
    // Conflict & Double-Booking Protection: Check existing active bookings for this tractor
    const conflicting = this.bookings.find(
      (b) =>
        b.resourceId === dto.resourceId &&
        b.scheduledDate === dto.scheduledDate &&
        ['SCHEDULED', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
    );

    if (conflicting) {
      throw new BadRequestException(
        `TRACTOR UNAVAILABLE: Tractor ${dto.resourceId} is already booked on ${dto.scheduledDate}. Double-booking prevented.`
      );
    }

    const newBooking: BookingEntity = {
      id: `BK${Math.floor(1000 + Math.random() * 9000)}`,
      workRequestId: dto.workRequestId,
      offerId: dto.offerId || `offer-${Date.now()}`,
      customerId: dto.customerId || 'usr-ravi-001',
      providerId: dto.providerId,
      resourceType: dto.resourceType || 'TRACTOR',
      resourceId: dto.resourceId,
      scheduledDate: dto.scheduledDate || '2026-09-05',
      startTime: dto.startTime || '07:00 AM',
      agreedPrice: dto.agreedPrice ? Number(dto.agreedPrice) : 5000.0,
      status: 'SCHEDULED',
      cancellationDetails: null,
      workSession: {
        id: `ws-${Date.now()}`,
        arrivedAt: null,
        startedAt: null,
        completedAt: null,
        actualHours: null,
        actualArea: null,
        notes: null,
        status: 'NOT_STARTED',
      },
      ratings: [],
      dispute: null,
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  async markArrived(id: string) {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'ARRIVED');

    booking.status = 'ARRIVED';
    booking.workSession.arrivedAt = new Date().toISOString();
    booking.workSession.status = 'ARRIVED';

    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      workSession: booking.workSession,
      message: 'Tractor provider marked as ARRIVED at farm location.',
    };
  }

  async startWork(id: string) {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'IN_PROGRESS');

    booking.status = 'IN_PROGRESS';
    booking.workSession.startedAt = new Date().toISOString();
    booking.workSession.status = 'IN_PROGRESS';

    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      workSession: booking.workSession,
      message: 'Work execution started (Status: IN_PROGRESS).',
    };
  }

  async completeWork(
    id: string,
    body: { actualHours: number; actualArea: number; notes?: string }
  ) {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'COMPLETED');

    if (!body.actualHours || !body.actualArea) {
      throw new BadRequestException('actualHours and actualArea are required to mark work completed.');
    }

    booking.status = 'COMPLETED';
    booking.workSession.completedAt = new Date().toISOString();
    booking.workSession.actualHours = Number(body.actualHours);
    booking.workSession.actualArea = Number(body.actualArea);
    booking.workSession.notes = body.notes || 'Completed successfully.';
    booking.workSession.status = 'COMPLETED';

    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      workSession: booking.workSession,
      message: `Work completed: ${body.actualArea} acres in ${body.actualHours} hours. Awaiting farmer confirmation.`,
    };
  }

  async confirmCompletion(id: string) {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'CONFIRMED');

    booking.status = 'CONFIRMED';
    // Auto transition to CLOSED once verified and rated
    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      message: 'Farmer confirmed work completion successfully. Ready for ratings and settlement.',
    };
  }

  async cancelBooking(id: string, reason: string, cancelledBy = 'CUSTOMER') {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'CANCELLED');

    booking.status = 'CANCELLED';
    booking.cancellationDetails = {
      reason: reason || 'Booking cancelled',
      cancelledBy,
      cancelledAt: new Date().toISOString(),
    };

    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      cancellationDetails: booking.cancellationDetails,
    };
  }

  async raiseDispute(id: string, body: { reason: string; description?: string }) {
    const booking = await this.getBookingById(id);
    BookingStateMachine.validateTransition(booking.status, 'DISPUTED');

    booking.status = 'DISPUTED';
    booking.dispute = {
      id: `disp-${Date.now()}`,
      reason: body.reason,
      description: body.description || '',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
      dispute: booking.dispute,
    };
  }

  async submitRating(
    id: string,
    body: { score: number; review?: string; fromUserId?: string; toUserId?: string }
  ) {
    const booking = await this.getBookingById(id);

    // Business Rule: Rating allowed only after COMPLETED or CONFIRMED
    if (!['COMPLETED', 'CONFIRMED', 'CLOSED'].includes(booking.status)) {
      throw new BadRequestException('Rating can only be submitted for completed or confirmed jobs.');
    }

    if (!body.score || body.score < 1 || body.score > 5) {
      throw new BadRequestException('Rating score must be between 1 and 5 stars.');
    }

    const fromUser = body.fromUserId || 'usr-ravi-001';
    const toUser = body.toUserId || (fromUser === booking.customerId ? booking.providerId : booking.customerId);

    // Business Rule: One rating per user per booking
    const existing = booking.ratings.find((r) => r.fromUserId === fromUser);
    if (existing) {
      throw new BadRequestException('You have already submitted a rating for this booking.');
    }

    const newRating = {
      id: `rat-${Date.now()}`,
      fromUserId: fromUser,
      toUserId: toUser,
      score: body.score,
      review: body.review || '',
      createdAt: new Date().toISOString(),
    };

    booking.ratings.push(newRating);

    // If both sides rated and confirmed, transition to CLOSED
    if (booking.status === 'CONFIRMED') {
      booking.status = 'CLOSED';
    }

    return {
      success: true,
      bookingId: booking.id,
      rating: newRating,
      bookingStatus: booking.status,
      message: 'Rating recorded successfully.',
    };
  }
}
