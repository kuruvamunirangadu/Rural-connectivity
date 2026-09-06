import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface TransportStopItem {
  id: string;
  sequence: number;
  stopType: 'PICKUP' | 'DELIVERY' | 'WAYPOINT';
  locationName: string;
  village: string;
  mandal: string;
  district: string;
  plannedTime?: string;
  actualTime?: string;
  status: 'PLANNED' | 'ARRIVED' | 'DEPARTED' | 'SKIPPED';
}

export interface TransportRequirementItem {
  id: string;
  cargoType: string; // "Cotton (Bales)", "Neem Urea (45kg Bags)", "Paddy (Quintals)", "Sprayer Machinery", "Irrigation Water"
  quantity: number;
  unit: string; // "kg", "bags", "quintals", "litres"
  vehicleTypeRequired: 'TRACTOR' | 'TRACTOR_TRAILER' | 'MINI_TRUCK' | 'TRUCK' | 'PICKUP' | 'TANKER' | 'TEMPO' | 'OTHER';
  minimumCapacityKg: number;
  requiredVehicleFeatures?: string;
  specialInstructions?: string;
}

export interface TransportRequestItem {
  id: string;
  code: string;
  createdById: string;
  customerName: string;
  customerPhone: string;
  organizationId?: string;
  organizationName?: string;
  requestType: 'INPUT_DELIVERY' | 'PRODUCE_TRANSPORT' | 'EQUIPMENT_TRANSPORT' | 'WATER_TRANSPORT' | 'PERSON_TRANSPORT' | 'GENERAL_CARGO' | 'OTHER';
  originName: string;
  originVillage: string;
  originMandal: string;
  destinationName: string;
  destinationVillage: string;
  destinationMandal: string;
  requestedDate: string;
  pickupTimeWindow: string; // e.g. "07:00 AM - 10:00 AM"
  status: 'OPEN' | 'MATCHED' | 'OFFERED' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  requirements: TransportRequirementItem[];
  stops: TransportStopItem[];
  estimatedDistanceKm: number;
  estimatedPriceINR: number;
  createdAt: string;
}

@Injectable()
export class TransportRequestService {
  private requests: TransportRequestItem[] = [
    {
      id: 'trq-cotton-harvest-01',
      code: 'TRQ-2026-COT-001',
      createdById: 'usr-ramesh-001',
      customerName: 'Ramesh Reddy (Farmer / Member)',
      customerPhone: '+91 98765 43210',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      requestType: 'PRODUCE_TRANSPORT',
      originName: 'Ramesh Reddy North Farm (Field Gate #2)',
      originVillage: 'Garladinne',
      originMandal: 'Kalyan Zone',
      destinationName: 'Kalyandurg FPO Central Aggregation Godown',
      destinationVillage: 'Kalyan Central',
      destinationMandal: 'Kalyan Zone',
      requestedDate: '2026-09-10',
      pickupTimeWindow: '07:30 AM - 11:30 AM',
      status: 'OPEN',
      requirements: [
        {
          id: 'treq-01',
          cargoType: 'Freshly Harvested Cotton (Long-Staple Bt-2)',
          quantity: 5000,
          unit: 'kg', // 50 Quintals / 5 tonnes
          vehicleTypeRequired: 'TRACTOR_TRAILER',
          minimumCapacityKg: 5000,
          requiredVehicleFeatures: 'High-mesh tarpaulin cover for loose cotton',
          specialInstructions: 'Farm approach road is unpaved red soil; high-ground-clearance tractor+trailer required.',
        },
      ],
      stops: [
        {
          id: 'stop-01',
          sequence: 1,
          stopType: 'PICKUP',
          locationName: 'North Farm Gate #2',
          village: 'Garladinne',
          mandal: 'Kalyan Zone',
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
        {
          id: 'stop-02',
          sequence: 2,
          stopType: 'DELIVERY',
          locationName: 'FPO Central Warehouse Yard',
          village: 'Kalyan Central',
          mandal: 'Kalyan Zone',
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
      ],
      estimatedDistanceKm: 12.5,
      estimatedPriceINR: 2200,
      createdAt: '2026-02-18T09:00:00Z',
    },
    {
      id: 'trq-fertilizer-supply-02',
      code: 'TRQ-2026-FERT-002',
      createdById: 'usr-kalyan-fpo-mgr',
      customerName: 'Suresh Gowd (FPO Operations Manager)',
      customerPhone: '+91 98765 43211',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      requestType: 'INPUT_DELIVERY',
      originName: 'Sri Venkateshwara Agri Inputs Godown',
      originVillage: 'Tandur Market Yard',
      originMandal: 'Tandur',
      destinationName: 'Peddapalli Village Primary Agri Cooperative Hub',
      destinationVillage: 'Peddapalli',
      destinationMandal: 'Kalyan Zone',
      requestedDate: '2026-09-12',
      pickupTimeWindow: '09:00 AM - 01:00 PM',
      status: 'OPEN',
      requirements: [
        {
          id: 'treq-02',
          cargoType: 'Neem Coated Urea (45kg Bags)',
          quantity: 200,
          unit: 'bags', // 9 tonnes
          vehicleTypeRequired: 'TRUCK',
          minimumCapacityKg: 9000,
          requiredVehicleFeatures: 'Waterproof tarpaulin cover to protect fertilizer bags from rain',
          specialInstructions: 'Includes unloading at village hub ramp.',
        },
      ],
      stops: [
        {
          id: 'stop-03',
          sequence: 1,
          stopType: 'PICKUP',
          locationName: 'Supplier Main Depot',
          village: 'Tandur Market Yard',
          mandal: 'Tandur',
          district: 'Vikarabad',
          status: 'PLANNED',
        },
        {
          id: 'stop-04',
          sequence: 2,
          stopType: 'DELIVERY',
          locationName: 'Peddapalli FPO Point',
          village: 'Peddapalli',
          mandal: 'Kalyan Zone',
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
      ],
      estimatedDistanceKm: 34.0,
      estimatedPriceINR: 4800,
      createdAt: '2026-02-19T10:30:00Z',
    },
    {
      id: 'trq-fpo-to-mill-03',
      code: 'TRQ-2026-BULK-003',
      createdById: 'usr-kalyan-fpo-mgr',
      customerName: 'Kalyandurg Producer Co.',
      customerPhone: '+91 98765 43210',
      organizationId: 'org-kalyan-fpo',
      requestType: 'PRODUCE_TRANSPORT',
      originName: 'FPO Central Aggregation Yard',
      originVillage: 'Kalyan Central',
      originMandal: 'Kalyan Zone',
      destinationName: 'Deccan Cotton Ginning & Spinning Mills Pvt Ltd',
      destinationVillage: 'Mahbubnagar Industrial Area',
      destinationMandal: 'Mahbubnagar HQ',
      requestedDate: '2026-09-15',
      pickupTimeWindow: '06:00 AM - 10:00 AM',
      status: 'OPEN',
      requirements: [
        {
          id: 'treq-03',
          cargoType: 'Aggregated Grade-A Cotton (200 Quintals)',
          quantity: 20000,
          unit: 'kg', // 20 Tonnes
          vehicleTypeRequired: 'TRUCK',
          minimumCapacityKg: 10000, // Two 10-ton lorries
          specialInstructions: 'Direct mill delivery with electronic weighbridge verification slip.',
        },
      ],
      stops: [
        {
          id: 'stop-05',
          sequence: 1,
          stopType: 'PICKUP',
          locationName: 'FPO Main Yard',
          village: 'Kalyan Central',
          mandal: 'Kalyan Zone',
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
        {
          id: 'stop-06',
          sequence: 2,
          stopType: 'DELIVERY',
          locationName: 'Deccan Mills Inward Bay #3',
          village: 'Mahbubnagar Industrial Area',
          mandal: 'Mahbubnagar HQ',
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
      ],
      estimatedDistanceKm: 52.0,
      estimatedPriceINR: 9500,
      createdAt: '2026-02-20T11:00:00Z',
    },
  ];

  listRequests(filter?: { createdById?: string; organizationId?: string; status?: string; requestType?: string }): TransportRequestItem[] {
    return this.requests.filter((r) => {
      if (filter?.createdById && r.createdById !== filter.createdById) return false;
      if (filter?.organizationId && r.organizationId !== filter.organizationId) return false;
      if (filter?.status && r.status !== filter.status) return false;
      if (filter?.requestType && r.requestType !== filter.requestType) return false;
      return true;
    });
  }

  getRequest(id: string): TransportRequestItem {
    const req = this.requests.find((r) => r.id === id || r.code.toLowerCase() === id.toLowerCase());
    if (!req) {
      throw new NotFoundException(`Transport Request ${id} not found`);
    }
    return req;
  }

  createRequest(data: {
    createdById: string;
    customerName: string;
    customerPhone: string;
    organizationId?: string;
    organizationName?: string;
    requestType: 'INPUT_DELIVERY' | 'PRODUCE_TRANSPORT' | 'EQUIPMENT_TRANSPORT' | 'WATER_TRANSPORT' | 'PERSON_TRANSPORT' | 'GENERAL_CARGO' | 'OTHER';
    originName: string;
    originVillage: string;
    originMandal: string;
    destinationName: string;
    destinationVillage: string;
    destinationMandal: string;
    requestedDate: string;
    pickupTimeWindow?: string;
    cargoType: string;
    quantity: number;
    unit?: string;
    vehicleTypeRequired?: 'TRACTOR' | 'TRACTOR_TRAILER' | 'MINI_TRUCK' | 'TRUCK' | 'PICKUP' | 'TANKER' | 'TEMPO' | 'OTHER';
    minimumCapacityKg?: number;
    specialInstructions?: string;
    estimatedDistanceKm?: number;
    estimatedPriceINR?: number;
  }): TransportRequestItem {
    const code = `TRQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const reqId = `trq-${Date.now().toString(36)}`;
    const dist = data.estimatedDistanceKm || 15.0;
    const estPrice = data.estimatedPriceINR || Math.round(500 + dist * 35 + (data.quantity > 3000 ? 800 : 0));

    const newReq: TransportRequestItem = {
      id: reqId,
      code,
      createdById: data.createdById,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      requestType: data.requestType,
      originName: data.originName,
      originVillage: data.originVillage,
      originMandal: data.originMandal,
      destinationName: data.destinationName,
      destinationVillage: data.destinationVillage,
      destinationMandal: data.destinationMandal,
      requestedDate: data.requestedDate,
      pickupTimeWindow: data.pickupTimeWindow || '08:00 AM - 12:00 PM',
      status: 'OPEN',
      requirements: [
        {
          id: `treq-${Date.now().toString(36)}`,
          cargoType: data.cargoType,
          quantity: data.quantity,
          unit: data.unit || 'kg',
          vehicleTypeRequired: data.vehicleTypeRequired || 'MINI_TRUCK',
          minimumCapacityKg: data.minimumCapacityKg || data.quantity,
          specialInstructions: data.specialInstructions,
        },
      ],
      stops: [
        {
          id: `stop-${Date.now().toString(36)}-1`,
          sequence: 1,
          stopType: 'PICKUP',
          locationName: data.originName,
          village: data.originVillage,
          mandal: data.originMandal,
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
        {
          id: `stop-${Date.now().toString(36)}-2`,
          sequence: 2,
          stopType: 'DELIVERY',
          locationName: data.destinationName,
          village: data.destinationVillage,
          mandal: data.destinationMandal,
          district: 'Mahbubnagar',
          status: 'PLANNED',
        },
      ],
      estimatedDistanceKm: dist,
      estimatedPriceINR: estPrice,
      createdAt: new Date().toISOString(),
    };

    this.requests.push(newReq);
    return newReq;
  }

  updateStatus(id: string, status: 'OPEN' | 'MATCHED' | 'OFFERED' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'): TransportRequestItem {
    const req = this.getRequest(id);
    req.status = status;
    return req;
  }
}
