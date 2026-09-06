import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface VehicleItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  organizationId?: string;
  vehicleType: 'TRACTOR' | 'TRACTOR_TRAILER' | 'MINI_TRUCK' | 'TRUCK' | 'PICKUP' | 'TANKER' | 'TEMPO' | 'OTHER';
  registrationNumber: string;
  brand: string;
  model: string;
  manufacturingYear?: number;
  capacity: number; // in kg or unit specified
  capacityUnit: string; // "kg", "quintals", "tonnes", "litres"
  condition: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED';
  baseVillage: string;
  baseMandal: string;
  baseDistrict: string;
  serviceRadiusKm: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: string;
}

@Injectable()
export class VehicleService {
  private vehicles: VehicleItem[] = [
    {
      id: 'veh-eicher-01',
      ownerId: 'usr-ravi-transport',
      ownerName: 'Ravi Logistics & Transport',
      ownerPhone: '+91 98481 99001',
      vehicleType: 'MINI_TRUCK',
      registrationNumber: 'TS-08-UB-4821',
      brand: 'Eicher',
      model: 'Pro 2049 (14ft Deck)',
      manufacturingYear: 2023,
      capacity: 3500, // 3.5 tonnes
      capacityUnit: 'kg',
      condition: 'Excellent',
      status: 'ACTIVE',
      baseVillage: 'Tangipalli',
      baseMandal: 'Tandur',
      baseDistrict: 'Vikarabad',
      serviceRadiusKm: 45.0,
      assignedDriverId: 'drv-narsimha-01',
      assignedDriverName: 'B. Narsimha (Heavy Commercial)',
      createdAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'veh-tractor-trailer-02',
      ownerId: 'usr-suresh-002',
      ownerName: 'Suresh Reddy (Tractor Owner)',
      ownerPhone: '+91 98481 12233',
      vehicleType: 'TRACTOR_TRAILER',
      registrationNumber: 'TS-08-TR-9012',
      brand: 'Mahindra',
      model: '575 DI + 5-Ton Hydraulic Tipping Trailer',
      manufacturingYear: 2024,
      capacity: 5000, // 5 tonnes
      capacityUnit: 'kg',
      condition: 'Good',
      status: 'ACTIVE',
      baseVillage: 'Tangipalli North',
      baseMandal: 'Tandur',
      baseDistrict: 'Vikarabad',
      serviceRadiusKm: 25.0,
      assignedDriverId: 'drv-suresh-02',
      assignedDriverName: 'Suresh Reddy (Owner-Driver)',
      createdAt: '2026-01-15T09:30:00Z',
    },
    {
      id: 'veh-tata-truck-03',
      ownerId: 'usr-deccan-transport',
      ownerName: 'Deccan Regional Logistics Co.',
      ownerPhone: '+91 98482 77665',
      organizationId: 'org-kalyan-fpo',
      vehicleType: 'TRUCK',
      registrationNumber: 'TS-07-TK-7744',
      brand: 'Tata',
      model: 'LPT 1618 (6-Wheeler 10-Ton)',
      manufacturingYear: 2022,
      capacity: 10000, // 10 tonnes
      capacityUnit: 'kg',
      condition: 'Good',
      status: 'ACTIVE',
      baseVillage: 'Kalyan Central',
      baseMandal: 'Kalyan Zone',
      baseDistrict: 'Mahbubnagar',
      serviceRadiusKm: 80.0,
      assignedDriverId: 'drv-anand-03',
      assignedDriverName: 'K. Anand (HMV Certified)',
      createdAt: '2026-01-20T11:00:00Z',
    },
    {
      id: 'veh-tanker-04',
      ownerId: 'usr-contractor-003',
      ownerName: 'M. Anjaneyulu (Water Supply)',
      ownerPhone: '+91 98482 99001',
      vehicleType: 'TANKER',
      registrationNumber: 'TS-08-WT-3301',
      brand: 'Ashok Leyland',
      model: 'Ecomet 5000L Water Tanker',
      manufacturingYear: 2023,
      capacity: 5000,
      capacityUnit: 'litres',
      condition: 'Good',
      status: 'ACTIVE',
      baseVillage: 'Tandur Town',
      baseMandal: 'Tandur',
      baseDistrict: 'Vikarabad',
      serviceRadiusKm: 35.0,
      createdAt: '2026-02-01T14:00:00Z',
    },
    {
      id: 'veh-bolero-pickup-05',
      ownerId: 'usr-balaji-02',
      ownerName: 'Balaji Kisan Logistics',
      ownerPhone: '+91 98765 43211',
      vehicleType: 'PICKUP',
      registrationNumber: 'TS-08-PK-5566',
      brand: 'Mahindra',
      model: 'Bolero Maxi Truck Plus',
      manufacturingYear: 2023,
      capacity: 1700, // 1.7 tonnes / ~35 bags
      capacityUnit: 'kg',
      condition: 'Excellent',
      status: 'ACTIVE',
      baseVillage: 'Peddapalli',
      baseMandal: 'Kalyan Zone',
      baseDistrict: 'Mahbubnagar',
      serviceRadiusKm: 30.0,
      createdAt: '2026-02-05T16:00:00Z',
    },
  ];

  listVehicles(filter?: {
    ownerId?: string;
    organizationId?: string;
    vehicleType?: string;
    status?: string;
    minCapacity?: number;
  }): VehicleItem[] {
    return this.vehicles.filter((v) => {
      if (filter?.ownerId && v.ownerId !== filter.ownerId) return false;
      if (filter?.organizationId && v.organizationId !== filter.organizationId) return false;
      if (filter?.vehicleType && v.vehicleType !== filter.vehicleType) return false;
      if (filter?.status && v.status !== filter.status) return false;
      if (filter?.minCapacity && v.capacity < filter.minCapacity) return false;
      return true;
    });
  }

  getVehicle(id: string): VehicleItem {
    const vehicle = this.vehicles.find((v) => v.id === id || v.registrationNumber.toLowerCase() === id.toLowerCase());
    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${id} not found`);
    }
    return vehicle;
  }

  registerVehicle(data: {
    ownerId: string;
    ownerName: string;
    ownerPhone: string;
    organizationId?: string;
    vehicleType: 'TRACTOR' | 'TRACTOR_TRAILER' | 'MINI_TRUCK' | 'TRUCK' | 'PICKUP' | 'TANKER' | 'TEMPO' | 'OTHER';
    registrationNumber: string;
    brand: string;
    model: string;
    manufacturingYear?: number;
    capacity: number;
    capacityUnit?: string;
    condition?: string;
    baseVillage: string;
    baseMandal: string;
    baseDistrict: string;
    serviceRadiusKm?: number;
    assignedDriverId?: string;
    assignedDriverName?: string;
  }): VehicleItem {
    const exists = this.vehicles.some(
      (v) => v.registrationNumber.replace(/[\s-]/g, '').toLowerCase() === data.registrationNumber.replace(/[\s-]/g, '').toLowerCase()
    );
    if (exists) {
      throw new BadRequestException(`Vehicle with registration ${data.registrationNumber} already exists`);
    }

    const newVehicle: VehicleItem = {
      id: `veh-${Date.now().toString(36)}`,
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      organizationId: data.organizationId,
      vehicleType: data.vehicleType,
      registrationNumber: data.registrationNumber.toUpperCase(),
      brand: data.brand,
      model: data.model,
      manufacturingYear: data.manufacturingYear || new Date().getFullYear(),
      capacity: data.capacity,
      capacityUnit: data.capacityUnit || 'kg',
      condition: data.condition || 'Good',
      status: 'ACTIVE',
      baseVillage: data.baseVillage,
      baseMandal: data.baseMandal,
      baseDistrict: data.baseDistrict,
      serviceRadiusKm: data.serviceRadiusKm || 35.0,
      assignedDriverId: data.assignedDriverId,
      assignedDriverName: data.assignedDriverName,
      createdAt: new Date().toISOString(),
    };

    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  updateVehicleStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED'): VehicleItem {
    const vehicle = this.getVehicle(id);
    vehicle.status = status;
    return vehicle;
  }

  assignDriver(vehicleId: string, driverId: string, driverName: string): VehicleItem {
    const vehicle = this.getVehicle(vehicleId);
    vehicle.assignedDriverId = driverId;
    vehicle.assignedDriverName = driverName;
    return vehicle;
  }
}

