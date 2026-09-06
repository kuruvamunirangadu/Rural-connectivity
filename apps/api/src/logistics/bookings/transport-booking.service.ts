import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransportOfferService } from '../offers/transport-offer.service';
import { TransportRequestService } from '../requests/transport-request.service';

export type TransportBookingState =
  | 'CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'VEHICLE_ASSIGNED'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface TransportBookingItem {
  id: string;
  referenceCode: string; // e.g. "TBK-2026-0001"
  transportRequestId: string;
  offerId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  vehicleId: string;
  vehicleDetails: string;
  driverId?: string;
  driverName?: string;
  cargoType: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  status: TransportBookingState;
  scheduledAt: string;
  agreedPriceINR: number;
  tripId?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class TransportBookingService {
  constructor(
    private readonly offerService: TransportOfferService,
    private readonly requestService: TransportRequestService
  ) {}

  private bookings: TransportBookingItem[] = [
    {
      id: 'tbk-01',
      referenceCode: 'TBK-2026-0001',
      transportRequestId: 'trq-cotton-harvest-01',
      offerId: 'toff-01',
      customerId: 'usr-ramesh-001',
      customerName: 'Ramesh Reddy (Farmer / Member)',
      customerPhone: '+91 98765 43210',
      providerId: 'usr-suresh-002',
      providerName: 'Suresh Reddy (Tractor Owner)',
      providerPhone: '+91 98481 12233',
      vehicleId: 'veh-tractor-trailer-02',
      vehicleDetails: 'Mahindra 575 DI + 5T Trailer',
      driverId: 'drv-suresh-02',
      driverName: 'Suresh Reddy (Owner-Driver)',
      cargoType: 'Cotton (Long-Staple)',
      quantity: 5000,
      unit: 'kg',
      origin: 'Garladinne Farm Gate #2',
      destination: 'Kalyandurg FPO Central Warehouse',
      status: 'IN_TRANSIT',
      scheduledAt: '2026-09-10T07:30:00Z',
      agreedPriceINR: 2200,
      tripId: 'trip-01',
      createdAt: '2026-02-18T10:30:00Z',
      updatedAt: '2026-02-18T11:00:00Z',
    },
    {
      id: 'tbk-02',
      referenceCode: 'TBK-2026-0002',
      transportRequestId: 'trq-fertilizer-supply-02',
      offerId: 'toff-02',
      customerId: 'usr-kalyan-fpo-mgr',
      customerName: 'Suresh Gowd (FPO Ops Manager)',
      customerPhone: '+91 98765 43211',
      providerId: 'usr-deccan-transport',
      providerName: 'Deccan Regional Logistics Co.',
      providerPhone: '+91 98482 77665',
      vehicleId: 'veh-tata-truck-03',
      vehicleDetails: 'Tata LPT 1618 (10-Ton)',
      driverId: 'drv-anand-03',
      driverName: 'K. Anand (HMV)',
      cargoType: 'Neem Urea (200 Bags)',
      quantity: 200,
      unit: 'bags',
      origin: 'Tandur Supplier Depot',
      destination: 'Peddapalli Village FPO Hub',
      status: 'READY',
      scheduledAt: '2026-09-12T09:00:00Z',
      agreedPriceINR: 4800,
      tripId: 'trip-02',
      createdAt: '2026-02-19T12:30:00Z',
      updatedAt: '2026-02-19T13:00:00Z',
    },
  ];

  listBookings(filter?: { customerId?: string; providerId?: string; status?: string }): TransportBookingItem[] {
    return this.bookings.filter((b) => {
      if (filter?.customerId && b.customerId !== filter.customerId) return false;
      if (filter?.providerId && b.providerId !== filter.providerId) return false;
      if (filter?.status && b.status !== filter.status) return false;
      return true;
    });
  }

  getBooking(id: string): TransportBookingItem {
    const booking = this.bookings.find((b) => b.id === id || b.referenceCode.toLowerCase() === id.toLowerCase());
    if (!booking) {
      throw new NotFoundException(`Transport Booking ${id} not found`);
    }
    return booking;
  }

  createBookingFromOffer(offerId: string, customerId: string): TransportBookingItem {
    const offer = this.offerService.acceptOffer(offerId);
    const request = this.requestService.getRequest(offer.transportRequestId);
    this.requestService.updateStatus(request.id, 'BOOKED');

    const referenceCode = `TBK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: TransportBookingItem = {
      id: `tbk-${Date.now().toString(36)}`,
      referenceCode,
      transportRequestId: request.id,
      offerId: offer.id,
      customerId,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      providerId: offer.providerId,
      providerName: offer.providerName,
      providerPhone: offer.providerPhone,
      vehicleId: offer.vehicleId,
      vehicleDetails: offer.vehicleDetails,
      driverId: offer.driverId,
      driverName: offer.driverName,
      cargoType: request.requirements[0]?.cargoType || 'Agricultural Cargo',
      quantity: request.requirements[0]?.quantity || 1000,
      unit: request.requirements[0]?.unit || 'kg',
      origin: `${request.originName} (${request.originVillage})`,
      destination: `${request.destinationName} (${request.destinationVillage})`,
      status: 'CONFIRMED',
      scheduledAt: new Date(request.requestedDate).toISOString(),
      agreedPriceINR: offer.priceINR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  transitionStatus(id: string, newStatus: TransportBookingState): TransportBookingItem {
    const booking = this.getBooking(id);

    // Valid state transitions
    const validTransitions: Record<TransportBookingState, TransportBookingState[]> = {
      CONFIRMED: ['DRIVER_ASSIGNED', 'VEHICLE_ASSIGNED', 'READY', 'CANCELLED'],
      DRIVER_ASSIGNED: ['VEHICLE_ASSIGNED', 'READY', 'CANCELLED'],
      VEHICLE_ASSIGNED: ['READY', 'CANCELLED'],
      READY: ['PICKED_UP', 'CANCELLED'],
      PICKED_UP: ['IN_TRANSIT', 'DISPUTED'],
      IN_TRANSIT: ['DELIVERED', 'DISPUTED'],
      DELIVERED: ['COMPLETED', 'DISPUTED'],
      COMPLETED: [],
      CANCELLED: [],
      DISPUTED: ['COMPLETED', 'CANCELLED'],
    };

    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition transport booking from ${booking.status} to ${newStatus}`);
    }

    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }
}
