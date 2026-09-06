import { Injectable, NotFoundException } from '@nestjs/common';
import { TransportBookingService } from '../bookings/transport-booking.service';

export interface TripItem {
  id: string;
  transportBookingId: string;
  referenceCode: string;
  cargoType: string;
  quantity: number;
  unit: string;
  driverName: string;
  vehicleDetails: string;
  startedAt: string;
  completedAt?: string;
  actualDistanceKm?: number;
  actualDurationMinutes?: number;
  status: 'PLANNED' | 'STARTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  currentMilestone: string;
  notes?: string;
  createdAt: string;
}

@Injectable()
export class TripService {
  constructor(private readonly bookingService: TransportBookingService) {}

  private trips: TripItem[] = [
    {
      id: 'trip-01',
      transportBookingId: 'tbk-01',
      referenceCode: 'TRIP-2026-0001',
      cargoType: 'Cotton (Long-Staple)',
      quantity: 5000,
      unit: 'kg',
      driverName: 'Suresh Reddy (Owner-Driver)',
      vehicleDetails: 'Mahindra 575 DI + 5T Trailer',
      startedAt: '2026-02-18T10:45:00Z',
      actualDistanceKm: 12.5,
      actualDurationMinutes: 35,
      status: 'IN_TRANSIT',
      currentMilestone: 'CARGO_LOADED_IN_TRANSIT',
      notes: 'Cotton loaded at farm gate #2. Tarpaulin secured. En route to FPO Warehouse.',
      createdAt: '2026-02-18T10:30:00Z',
    },
    {
      id: 'trip-02',
      transportBookingId: 'tbk-02',
      referenceCode: 'TRIP-2026-0002',
      cargoType: 'Neem Urea (200 Bags)',
      quantity: 200,
      unit: 'bags',
      driverName: 'K. Anand (HMV)',
      vehicleDetails: 'Tata LPT 1618 (10-Ton)',
      startedAt: '2026-02-19T13:00:00Z',
      status: 'PLANNED',
      currentMilestone: 'READY_FOR_DISPATCH',
      notes: 'Scheduled for pickup at supplier warehouse at 09:00 AM.',
      createdAt: '2026-02-19T12:30:00Z',
    },
  ];

  listTrips(status?: string): TripItem[] {
    if (status) {
      return this.trips.filter((t) => t.status === status);
    }
    return this.trips;
  }

  getTrip(id: string): TripItem {
    const trip = this.trips.find((t) => t.id === id || t.transportBookingId === id);
    if (!trip) {
      throw new NotFoundException(`Trip ${id} not found`);
    }
    return trip;
  }

  startTrip(bookingId: string, notes?: string): TripItem {
    const booking = this.bookingService.getBooking(bookingId);
    this.bookingService.transitionStatus(bookingId, 'PICKED_UP');
    this.bookingService.transitionStatus(bookingId, 'IN_TRANSIT');

    const tripId = `trip-${Date.now().toString(36)}`;
    const newTrip: TripItem = {
      id: tripId,
      transportBookingId: bookingId,
      referenceCode: `TRIP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cargoType: booking.cargoType,
      quantity: booking.quantity,
      unit: booking.unit,
      driverName: booking.driverName || 'Designated Driver',
      vehicleDetails: booking.vehicleDetails,
      startedAt: new Date().toISOString(),
      status: 'IN_TRANSIT',
      currentMilestone: 'IN_TRANSIT',
      notes: notes || `Departed from ${booking.origin} towards ${booking.destination}`,
      createdAt: new Date().toISOString(),
    };

    this.trips.push(newTrip);
    return newTrip;
  }

  completeTrip(tripId: string, actualDistanceKm?: number, durationMinutes?: number): TripItem {
    const trip = this.getTrip(tripId);
    trip.status = 'COMPLETED';
    trip.currentMilestone = 'ARRIVED_DESTINATION';
    trip.completedAt = new Date().toISOString();
    if (actualDistanceKm) trip.actualDistanceKm = actualDistanceKm;
    if (durationMinutes) trip.actualDurationMinutes = durationMinutes;

    this.bookingService.transitionStatus(trip.transportBookingId, 'DELIVERED');
    return trip;
  }
}

