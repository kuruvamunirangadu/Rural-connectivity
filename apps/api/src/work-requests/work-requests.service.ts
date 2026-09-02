import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class WorkRequestsService {
  private requests = [
    {
      id: 'wr_10001',
      createdById: 'usr-ravi-001',
      requestType: 'TRACTOR_WORK',
      work: 'Rotavator',
      farmId: 'farm-001',
      farmName: 'My Cotton Farm',
      area: 5.0,
      areaUnit: 'ACRE',
      requestedDate: '2026-09-05T07:00:00Z',
      time: '07:00 AM',
      locationId: 'loc-village-a',
      location: {
        village: 'Village A',
        mandal: 'Tandur',
        district: 'Vikarabad',
        state: 'Telangana',
      },
      status: 'OPEN',
      offeredTo: null as any,
      requirement: {
        resourceType: 'TRACTOR',
        quantity: 1,
        minimumHp: 45,
        tractorHpMin: 45,
        attachment: 'ROTAVATOR',
      },
      requirements: [
        {
          id: 'wreq-001',
          resourceType: 'TRACTOR',
          quantity: 1,
          tractorHpMin: 45,
          attachmentType: 'ROTAVATOR',
        },
      ],
    },
  ];

  private availableTractors = [
    {
      id: 'tr-001',
      ownerId: 'to-suresh-002',
      ownerName: 'Suresh Reddy',
      brand: 'John Deere',
      model: '5310',
      hp: 55,
      rating: 4.7,
      attachments: ['ROTAVATOR', 'PLOUGH', 'TRAILER'],
      distanceKm: 8.0,
      availableDate: '2026-09-05',
      availableTimeStart: '07:00',
      availableTimeEnd: '17:00',
      status: 'ACTIVE',
      ownerStatus: 'ACTIVE',
    },
    {
      id: 'tr-002',
      ownerId: 'to-ramesh-003',
      ownerName: 'Ramesh Goud',
      brand: 'Mahindra',
      model: '575 DI',
      hp: 50,
      rating: 4.5,
      attachments: ['ROTAVATOR', 'PLOUGH'],
      distanceKm: 12.0,
      availableDate: '2026-09-05',
      availableTimeStart: '07:00',
      availableTimeEnd: '17:00',
      status: 'ACTIVE',
      ownerStatus: 'ACTIVE',
    },
    {
      id: 'tr-003',
      ownerId: 'to-venkat-004',
      ownerName: 'Venkat Rao',
      brand: 'Swaraj',
      model: '735 FE',
      hp: 35, // Insufficient HP (< 45)
      rating: 4.8,
      attachments: ['ROTAVATOR'],
      distanceKm: 3.0,
      availableDate: '2026-09-05',
      availableTimeStart: '07:00',
      availableTimeEnd: '17:00',
      status: 'ACTIVE',
      ownerStatus: 'ACTIVE',
    },
    {
      id: 'tr-004',
      ownerId: 'to-laxman-005',
      ownerName: 'Laxman Naik',
      brand: 'Eicher',
      model: '557',
      hp: 55,
      rating: 4.6,
      attachments: ['PLOUGH'], // Missing Rotavator
      distanceKm: 5.0,
      availableDate: '2026-09-05',
      availableTimeStart: '07:00',
      availableTimeEnd: '17:00',
      status: 'ACTIVE',
      ownerStatus: 'ACTIVE',
    },
  ];

  async getMyRequests() {
    return this.requests;
  }

  async getById(id: string) {
    const request = this.requests.find((r) => r.id === id);
    if (!request) {
      throw new NotFoundException(`Work request ${id} not found`);
    }
    return request;
  }

  async create(dto: any) {
    const reqDate = dto.requestedDate ? new Date(dto.requestedDate).toISOString() : '2026-09-05T07:00:00Z';
    const newRequest = {
      id: `wr_${Math.floor(10000 + Math.random() * 90000)}`,
      createdById: 'usr-ravi-001',
      requestType: dto.requestType || 'TRACTOR_WORK',
      work: dto.work || 'Rotavator',
      farmId: dto.farmId || 'farm-001',
      farmName: dto.farmName || 'My Farm',
      area: Number(dto.area) || 5.0,
      areaUnit: dto.areaUnit || 'ACRE',
      requestedDate: reqDate,
      time: dto.time || '07:00 AM',
      locationId: dto.locationId || 'loc-village-a',
      location: {
        village: dto.village || 'Village A',
        mandal: dto.mandal || 'Tandur',
        district: dto.district || 'Vikarabad',
        state: dto.state || 'Telangana',
      },
      description: dto.description || '',
      status: 'OPEN',
      offeredTo: null as any,
      requirement: {
        minimumHp: Number(dto.tractorHpMin || 45),
        attachment: (dto.attachment || 'ROTAVATOR').toUpperCase(),
      },
      requirements: [
        {
          id: `wreq-${Date.now()}`,
          resourceType: 'TRACTOR',
          quantity: 1,
          tractorHpMin: Number(dto.tractorHpMin || 45),
          attachmentType: (dto.attachment || 'ROTAVATOR').toUpperCase(),
        },
      ],
      createdAt: new Date(),
    };

    this.requests.push(newRequest as any);
    return newRequest;
  }

  async getMatches(id: string, maxRadiusKm = 15) {
    const request = await this.getById(id);
    const minHp = request.requirement.minimumHp || 45;
    const requiredAttachment = (request.requirement.attachment || 'ROTAVATOR').toUpperCase();

    // Deterministic 5-factor evaluation
    const evaluated = this.availableTractors.map((tractor) => {
      const isOwnerActive = tractor.ownerStatus === 'ACTIVE';
      const isTractorActive = tractor.status === 'ACTIVE';
      const hasAttachment = tractor.attachments.includes(requiredAttachment);
      const hasSufficientHp = tractor.hp >= minHp;
      const isWithinRadius = tractor.distanceKm <= maxRadiusKm;
      const isAvailableOnDate = tractor.availableDate === '2026-09-05';

      const isEligible =
        isOwnerActive &&
        isTractorActive &&
        hasAttachment &&
        hasSufficientHp &&
        isWithinRadius &&
        isAvailableOnDate;

      if (!isEligible) {
        return {
          tractorId: tractor.id,
          brand: tractor.brand,
          model: tractor.model,
          hp: tractor.hp,
          isEligible: false,
          reasons: [
            !hasSufficientHp ? `Insufficient HP (${tractor.hp} < ${minHp})` : null,
            !hasAttachment ? `Missing required attachment (${requiredAttachment})` : null,
            !isWithinRadius ? `Outside radius (${tractor.distanceKm} km > ${maxRadiusKm} km)` : null,
          ].filter(Boolean),
        };
      }

      // Formula: Capability(40) + Availability(30) + Distance(20) + Rating(10)
      const capabilityScore = Math.min(40, (tractor.hp / minHp) * 35);
      const availabilityScore = 30;
      const distanceScore = Math.max(0, ((maxRadiusKm - tractor.distanceKm) / maxRadiusKm) * 20);
      const ratingScore = (tractor.rating / 5) * 10;

      const totalScore = Math.round(capabilityScore + availabilityScore + distanceScore + ratingScore);

      return {
        tractorId: tractor.id,
        ownerId: tractor.ownerId,
        ownerName: tractor.ownerName,
        brand: tractor.brand,
        model: tractor.model,
        hp: tractor.hp,
        attachments: tractor.attachments,
        distanceKm: tractor.distanceKm,
        rating: tractor.rating,
        isEligible: true,
        score: totalScore,
      };
    });

    const eligible = evaluated
      .filter((r) => r.isEligible)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const ineligible = evaluated.filter((r) => !r.isEligible);

    return {
      requestId: request.id,
      requirement: request.requirement,
      totalTractorsEvaluated: this.availableTractors.length,
      matchedTractors: eligible,
      excludedTractors: ineligible,
    };
  }

  async offerToOwner(requestId: string, tractorId: string, ownerId: string) {
    const request = await this.getById(requestId);
    request.status = 'OFFERED';
    request.offeredTo = {
      tractorId,
      ownerId,
      offeredAt: new Date().toISOString(),
    };

    return {
      success: true,
      requestId: request.id,
      status: request.status,
      message: `Work request offered to tractor owner ${ownerId}`,
      offeredTo: request.offeredTo,
    };
  }

  async updateStatus(requestId: string, newStatus: string) {
    const request = await this.getById(requestId);
    request.status = newStatus;
    return {
      success: true,
      requestId: request.id,
      status: request.status,
      message: `Request status updated to ${newStatus}`,
    };
  }
}
