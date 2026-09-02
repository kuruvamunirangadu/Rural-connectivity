import { Injectable } from '@nestjs/common';

export type ReliabilityEventType =
  | 'BOOKING_COMPLETED'
  | 'BOOKING_CANCELLED'
  | 'NO_SHOW'
  | 'ARRIVED_ON_TIME'
  | 'ARRIVED_LATE'
  | 'DISPUTE_LOST'
  | 'DISPUTE_WON'
  | 'RATING_RECEIVED';

export interface ReliabilityEvent {
  id: string;
  userId: string;
  bookingId?: string;
  eventType: ReliabilityEventType;
  value?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ReliabilityMetrics {
  totalAcceptedBookings: number;
  completedJobsCount: number;
  completionRatePct: number;
  cancellationRatePct: number;
  noShowRatePct: number;
  punctualityRatePct: number;
  reliabilityScore: number; // 0 - 100
  isReliableProvider: boolean;
}

@Injectable()
export class ReliabilityService {
  private events: ReliabilityEvent[] = [
    // Pre-populate Ravi's historical track record (98 completed jobs out of 102 accepted, 2 cancellations, 1 no-show)
    ...Array.from({ length: 98 }, (_, i) => ({
      id: `rev-comp-${i}`,
      userId: 'usr-ravi-001',
      bookingId: `BK-HIST-${i}`,
      eventType: 'BOOKING_COMPLETED' as ReliabilityEventType,
      createdAt: '2026-08-01T10:00:00Z',
    })),
    ...Array.from({ length: 96 }, (_, i) => ({
      id: `rev-ontime-${i}`,
      userId: 'usr-ravi-001',
      bookingId: `BK-HIST-${i}`,
      eventType: 'ARRIVED_ON_TIME' as ReliabilityEventType,
      createdAt: '2026-08-01T10:00:00Z',
    })),
    { id: 'rev-canc-1', userId: 'usr-ravi-001', bookingId: 'BK-C-1', eventType: 'BOOKING_CANCELLED', createdAt: '2026-08-15T10:00:00Z' },
    { id: 'rev-canc-2', userId: 'usr-ravi-001', bookingId: 'BK-C-2', eventType: 'BOOKING_CANCELLED', createdAt: '2026-08-18T10:00:00Z' },
    { id: 'rev-noshow-1', userId: 'usr-ravi-001', bookingId: 'BK-NS-1', eventType: 'NO_SHOW', createdAt: '2026-08-25T10:00:00Z' },
  ];

  async recordEvent(userId: string, eventType: ReliabilityEventType, bookingId?: string, metadata?: any): Promise<ReliabilityEvent> {
    const event: ReliabilityEvent = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      bookingId,
      eventType,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }

  async getMetricsForUser(userId: string): Promise<ReliabilityMetrics> {
    const userEvents = this.events.filter((e) => e.userId === userId);

    const completed = userEvents.filter((e) => e.eventType === 'BOOKING_COMPLETED').length;
    const cancelled = userEvents.filter((e) => e.eventType === 'BOOKING_CANCELLED').length;
    const noShows = userEvents.filter((e) => e.eventType === 'NO_SHOW').length;
    const onTime = userEvents.filter((e) => e.eventType === 'ARRIVED_ON_TIME').length;

    const totalAccepted = completed + cancelled + noShows || 1;

    const completionRatePct = Math.round((completed / totalAccepted) * 1000) / 10;
    const cancellationRatePct = Math.round((cancelled / totalAccepted) * 1000) / 10;
    const noShowRatePct = Math.round((noShows / totalAccepted) * 1000) / 10;
    const punctualityRatePct = completed > 0 ? Math.round((onTime / completed) * 1000) / 10 : 100;

    // Reliability formula (0 - 100 scale)
    const score = Math.min(100, Math.max(0, Math.round(
      completionRatePct * 0.50 +
      (100 - cancellationRatePct * 5) * 0.20 +
      (100 - noShowRatePct * 10) * 0.20 +
      punctualityRatePct * 0.10
    )));

    return {
      totalAcceptedBookings: totalAccepted,
      completedJobsCount: completed,
      completionRatePct,
      cancellationRatePct,
      noShowRatePct,
      punctualityRatePct,
      reliabilityScore: score,
      isReliableProvider: score >= 90 && completed >= 5,
    };
  }
}
