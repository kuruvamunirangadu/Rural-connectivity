import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface TransportOfferItem {
  id: string;
  transportRequestId: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  vehicleId: string;
  vehicleDetails: string;
  driverId?: string;
  driverName?: string;
  priceINR: number;
  currency: string;
  message?: string;
  expiresAt: string;
  status: 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  submittedAt: string;
}

@Injectable()
export class TransportOfferService {
  private offers: TransportOfferItem[] = [
    {
      id: 'toff-01',
      transportRequestId: 'trq-cotton-harvest-01',
      providerId: 'usr-suresh-002',
      providerName: 'Suresh Reddy (Tractor & Transport)',
      providerPhone: '+91 98481 12233',
      vehicleId: 'veh-tractor-trailer-02',
      vehicleDetails: 'Mahindra 575 DI + 5-Ton Tipping Trailer',
      driverId: 'drv-suresh-02',
      driverName: 'Suresh Reddy (Owner-Driver)',
      priceINR: 2200,
      currency: 'INR',
      message: 'Equipped with heavy-duty tarpaulin. Ready for immediate pickup from farm gate.',
      expiresAt: '2026-09-10T23:59:59Z',
      status: 'OFFERED',
      submittedAt: '2026-02-18T10:00:00Z',
    },
    {
      id: 'toff-02',
      transportRequestId: 'trq-fertilizer-supply-02',
      providerId: 'usr-deccan-transport',
      providerName: 'Deccan Regional Logistics Co.',
      providerPhone: '+91 98482 77665',
      vehicleId: 'veh-tata-truck-03',
      vehicleDetails: 'Tata LPT 1618 (10-Ton 6-Wheeler)',
      driverId: 'drv-anand-03',
      driverName: 'K. Anand (HMV Certified)',
      priceINR: 4800,
      currency: 'INR',
      message: 'Includes mechanical loading ramp and 2 loaders.',
      expiresAt: '2026-09-12T23:59:59Z',
      status: 'OFFERED',
      submittedAt: '2026-02-19T12:00:00Z',
    },
  ];

  listOffers(transportRequestId?: string): TransportOfferItem[] {
    if (transportRequestId) {
      return this.offers.filter((o) => o.transportRequestId === transportRequestId);
    }
    return this.offers;
  }

  getOffer(id: string): TransportOfferItem {
    const offer = this.offers.find((o) => o.id === id);
    if (!offer) {
      throw new NotFoundException(`Transport offer ${id} not found`);
    }
    return offer;
  }

  submitOffer(data: {
    transportRequestId: string;
    providerId: string;
    providerName: string;
    providerPhone: string;
    vehicleId: string;
    vehicleDetails: string;
    driverId?: string;
    driverName?: string;
    priceINR: number;
    message?: string;
  }): TransportOfferItem {
    const newOffer: TransportOfferItem = {
      id: `toff-${Date.now().toString(36)}`,
      transportRequestId: data.transportRequestId,
      providerId: data.providerId,
      providerName: data.providerName,
      providerPhone: data.providerPhone,
      vehicleId: data.vehicleId,
      vehicleDetails: data.vehicleDetails,
      driverId: data.driverId,
      driverName: data.driverName,
      priceINR: data.priceINR,
      currency: 'INR',
      message: data.message,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: 'OFFERED',
      submittedAt: new Date().toISOString(),
    };

    this.offers.push(newOffer);
    return newOffer;
  }

  acceptOffer(offerId: string): TransportOfferItem {
    const offer = this.getOffer(offerId);
    offer.status = 'ACCEPTED';

    // Reject other offers for same request
    this.offers
      .filter((o) => o.transportRequestId === offer.transportRequestId && o.id !== offerId)
      .forEach((o) => {
        o.status = 'REJECTED';
      });

    return offer;
  }
}

