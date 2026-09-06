import { Injectable, NotFoundException } from '@nestjs/common';

export interface TrackingEvent {
  id: string;
  tripId: string;
  milestone:
    | 'DRIVER_ASSIGNED'
    | 'VEHICLE_DISPATCHED'
    | 'ARRIVED_AT_PICKUP'
    | 'CARGO_LOADED'
    | 'IN_TRANSIT'
    | 'ARRIVED_AT_DROP'
    | 'UNLOADING_COMPLETED'
    | 'DELIVERY_CONFIRMED';
  locationName: string;
  notes?: string;
  timestamp: string;
  recordedBy: string;
}

@Injectable()
export class TrackingService {
  private events: TrackingEvent[] = [
    {
      id: 'trk-01',
      tripId: 'trip-01',
      milestone: 'DRIVER_ASSIGNED',
      locationName: 'Reddy Farm Hub, Anantapur',
      notes: 'Driver Suresh Reddy assigned with Mahindra 575 DI + Trailer.',
      timestamp: '2026-02-18T10:00:00Z',
      recordedBy: 'SYSTEM',
    },
    {
      id: 'trk-02',
      tripId: 'trip-01',
      milestone: 'ARRIVED_AT_PICKUP',
      locationName: 'Ravi Teja Farm, Gate 2',
      notes: 'Tractor trailer positioned at loading bay.',
      timestamp: '2026-02-18T10:20:00Z',
      recordedBy: 'DRIVER',
    },
    {
      id: 'trk-03',
      tripId: 'trip-01',
      milestone: 'CARGO_LOADED',
      locationName: 'Ravi Teja Farm, Gate 2',
      notes: '50 Quintals Cotton safely loaded and secured with tarpaulin rope.',
      timestamp: '2026-02-18T10:45:00Z',
      recordedBy: 'FARMER',
    },
    {
      id: 'trk-04',
      tripId: 'trip-01',
      milestone: 'IN_TRANSIT',
      locationName: 'Kalyandurg - Anantapur Rural Corridor (KM 8)',
      notes: 'Speed 28 km/h. Clear weather.',
      timestamp: '2026-02-18T11:15:00Z',
      recordedBy: 'DRIVER',
    },
  ];

  getEventsForTrip(tripId: string): TrackingEvent[] {
    return this.events
      .filter((e) => e.tripId === tripId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  recordEvent(dto: {
    tripId: string;
    milestone: TrackingEvent['milestone'];
    locationName: string;
    notes?: string;
    recordedBy?: string;
  }): TrackingEvent {
    const event: TrackingEvent = {
      id: `trk-${Date.now().toString(36)}`,
      tripId: dto.tripId,
      milestone: dto.milestone,
      locationName: dto.locationName,
      notes: dto.notes,
      timestamp: new Date().toISOString(),
      recordedBy: dto.recordedBy || 'SYSTEM',
    };

    this.events.push(event);
    return event;
  }
}

