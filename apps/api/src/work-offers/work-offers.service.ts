import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class WorkOffersService {
  private offers = [
    {
      id: 'offer-001',
      workRequestId: 'wr_10001',
      customerId: 'usr-ravi-001',
      providerId: 'to-suresh-002',
      resourceType: 'TRACTOR',
      resourceId: 'tr-002', // Suresh's Mahindra 575
      price: 5000.0,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      createdAt: new Date(),
    },
  ];

  async getMyOffers() {
    return this.offers;
  }

  async getOfferById(id: string) {
    const offer = this.offers.find((o) => o.id === id);
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }
    return offer;
  }

  async createOffer(dto: any) {
    if (!dto.workRequestId || !dto.providerId || !dto.resourceId) {
      throw new BadRequestException('workRequestId, providerId, and resourceId are required to create an offer');
    }

    const newOffer = {
      id: `offer-${Date.now()}`,
      workRequestId: dto.workRequestId,
      customerId: dto.customerId || 'usr-ravi-001',
      providerId: dto.providerId,
      resourceType: dto.resourceType || 'TRACTOR',
      resourceId: dto.resourceId,
      price: dto.price ? Number(dto.price) : 5000.0,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      createdAt: new Date(),
    };

    this.offers.push(newOffer);
    return newOffer;
  }

  async acceptOffer(id: string) {
    const offer = await this.getOfferById(id);
    if (offer.status !== 'PENDING') {
      throw new BadRequestException(`Offer ${id} is already ${offer.status} and cannot be accepted`);
    }

    offer.status = 'ACCEPTED';

    const bookingPayload = {
      id: `BK${Math.floor(1000 + Math.random() * 9000)}`,
      workRequestId: offer.workRequestId,
      offerId: offer.id,
      customerId: offer.customerId,
      providerId: offer.providerId,
      resourceType: offer.resourceType,
      resourceId: offer.resourceId,
      scheduledDate: new Date('2026-09-05T07:00:00Z'),
      startTime: '07:00 AM',
      agreedPrice: offer.price,
      status: 'SCHEDULED',
    };

    return {
      success: true,
      offerId: offer.id,
      status: offer.status,
      message: 'Offer accepted by tractor owner. Booking created successfully.',
      booking: bookingPayload,
    };
  }

  async rejectOffer(id: string, reason?: string) {
    const offer = await this.getOfferById(id);
    if (offer.status !== 'PENDING') {
      throw new BadRequestException(`Offer ${id} is already ${offer.status} and cannot be rejected`);
    }

    offer.status = 'REJECTED';
    return {
      success: true,
      offerId: offer.id,
      status: offer.status,
      message: 'Offer rejected',
      reason: reason || 'Provider unavailable',
    };
  }
}
