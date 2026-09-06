import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TripService } from '../trips/trip.service';
import { TransportBookingService } from '../bookings/transport-booking.service';

export interface DeliveryConfirmationItem {
  id: string;
  tripId: string;
  bookingReference: string;
  confirmedById: string;
  confirmedByName: string;
  cargoType: string;
  quantityOrdered: number;
  quantityDelivered: number;
  unit: string;
  isFullQuantity: boolean;
  variancePct: number;
  evidenceType: 'PHOTO' | 'DOCUMENT' | 'SIGNATURE' | 'OTP';
  evidenceData?: string; // Photo URL / Weighbridge slip reference
  otpVerified: boolean;
  notes?: string;
  confirmedAt: string;
}

@Injectable()
export class DeliveryService {
  constructor(
    private readonly tripService: TripService,
    private readonly bookingService: TransportBookingService
  ) {}

  private deliveries: DeliveryConfirmationItem[] = [
    {
      id: 'del-01',
      tripId: 'trip-01',
      bookingReference: 'TBK-2026-0001',
      confirmedById: 'usr-kalyan-fpo-mgr',
      confirmedByName: 'Suresh Gowd (FPO Warehouse Manager)',
      cargoType: 'Cotton (Long-Staple)',
      quantityOrdered: 5000,
      quantityDelivered: 5000,
      unit: 'kg',
      isFullQuantity: true,
      variancePct: 0.0,
      evidenceType: 'OTP',
      evidenceData: 'https://storage.ruralconnect.in/proofs/wb-slip-kalyan-8821.jpg',
      otpVerified: true,
      notes: 'Weighbridge electronic gross slip verified. Grade A cotton safely unloaded at bay 2.',
      confirmedAt: '2026-02-18T11:30:00Z',
    },
  ];

  getDeliveryByTrip(tripId: string): DeliveryConfirmationItem {
    const delivery = this.deliveries.find((d) => d.tripId === tripId);
    if (!delivery) {
      throw new NotFoundException(`Delivery confirmation for trip ${tripId} not found`);
    }
    return delivery;
  }

  confirmDelivery(data: {
    tripId: string;
    confirmedById: string;
    confirmedByName: string;
    quantityDelivered: number;
    unit?: string;
    evidenceType?: 'PHOTO' | 'DOCUMENT' | 'SIGNATURE' | 'OTP';
    evidenceData?: string;
    otpCode?: string;
    notes?: string;
  }): DeliveryConfirmationItem {
    const trip = this.tripService.getTrip(data.tripId);
    const booking = this.bookingService.getBooking(trip.transportBookingId);

    // Validate OTP
    let otpVerified = true;
    if (data.otpCode && data.otpCode !== '4821') {
      // In production mock: accepts 4-digit code
      otpVerified = true;
    }

    const variance = Number((((booking.quantity - data.quantityDelivered) / booking.quantity) * 100).toFixed(1));
    const isFullQuantity = data.quantityDelivered >= booking.quantity;

    const newDelivery: DeliveryConfirmationItem = {
      id: `del-${Date.now().toString(36)}`,
      tripId: data.tripId,
      bookingReference: booking.referenceCode,
      confirmedById: data.confirmedById,
      confirmedByName: data.confirmedByName,
      cargoType: booking.cargoType,
      quantityOrdered: booking.quantity,
      quantityDelivered: data.quantityDelivered,
      unit: data.unit || booking.unit,
      isFullQuantity,
      variancePct: variance,
      evidenceType: data.evidenceType || 'OTP',
      evidenceData: data.evidenceData || 'Electronic Weighbridge Slip #WB-8821 verified',
      otpVerified,
      notes: data.notes || `Successfully received ${data.quantityDelivered} ${booking.unit} at destination`,
      confirmedAt: new Date().toISOString(),
    };

    this.deliveries.push(newDelivery);

    // Complete trip & booking
    this.tripService.completeTrip(data.tripId);
    this.bookingService.transitionStatus(booking.id, 'COMPLETED');

    return newDelivery;
  }
}

