import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  role?: string;
  resourceType?: string;
  referenceType?: string;
  referenceId?: string;
  locationId?: string;
  metadata?: Record<string, any>;
  occurredAt: string;
}

@Injectable()
export class AnalyticsEventService implements OnModuleInit {
  constructor(private readonly eventBus: EventBusService) {}

  private events: AnalyticsEvent[] = [];
  private processedEventIds = new Set<string>();

  onModuleInit() {
    // Listen to Booking Confirmed
    this.eventBus.subscribe('BookingConfirmedEvent', (evt) => {
      this.recordEvent({
        id: `aevt-${evt.eventId}`,
        eventType: 'BOOKING_CREATED',
        userId: evt.payload.customerId,
        role: 'FARMER',
        resourceType: evt.payload.resourceType || 'TRACTOR',
        referenceType: 'BOOKING',
        referenceId: evt.payload.bookingId,
        metadata: { amount: evt.payload.totalAmount },
      });
    });

    // Listen to Provider Arrived
    this.eventBus.subscribe('ProviderArrivedEvent', (evt) => {
      this.recordEvent({
        id: `aevt-${evt.eventId}`,
        eventType: 'PROVIDER_ARRIVED',
        userId: evt.payload.providerId,
        role: 'TRACTOR_OWNER',
        referenceType: 'BOOKING',
        referenceId: evt.payload.bookingId,
      });
    });

    // Listen to Work Started
    this.eventBus.subscribe('WorkStartedEvent', (evt) => {
      this.recordEvent({
        id: `aevt-${evt.eventId}`,
        eventType: 'WORK_STARTED',
        userId: evt.payload.providerId,
        role: 'TRACTOR_OWNER',
        referenceType: 'BOOKING',
        referenceId: evt.payload.bookingId,
      });
    });

    // Listen to Work Completed
    this.eventBus.subscribe('WorkCompletedEvent', (evt) => {
      this.recordEvent({
        id: `aevt-${evt.eventId}`,
        eventType: 'BOOKING_COMPLETED',
        userId: evt.payload.providerId,
        role: 'TRACTOR_OWNER',
        referenceType: 'BOOKING',
        referenceId: evt.payload.bookingId,
      });
    });
  }

  recordEvent(dto: {
    id?: string;
    eventType: string;
    userId?: string;
    role?: string;
    resourceType?: string;
    referenceType?: string;
    referenceId?: string;
    locationId?: string;
    metadata?: any;
  }): AnalyticsEvent | null {
    const eventId = dto.id || `aevt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Idempotency check
    if (this.processedEventIds.has(eventId)) {
      return null;
    }
    this.processedEventIds.add(eventId);

    const aEvent: AnalyticsEvent = {
      id: eventId,
      eventType: dto.eventType,
      userId: dto.userId,
      role: dto.role,
      resourceType: dto.resourceType,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
      locationId: dto.locationId,
      metadata: dto.metadata,
      occurredAt: new Date().toISOString(),
    };

    this.events.push(aEvent);
    return aEvent;
  }

  getEvents(eventType?: string): AnalyticsEvent[] {
    if (eventType) return this.events.filter((e) => e.eventType === eventType);
    return this.events;
  }
}
