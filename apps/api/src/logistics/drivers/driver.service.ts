import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface DriverProfileItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  licenseType: 'LMV_COMMERCIAL' | 'HMV_HEAVY' | 'TRACTOR_TRAILER' | 'HAZARDOUS_TANKER';
  licenseNumber: string;
  licenseExpiry: string; // ISO date
  experienceYears: number;
  serviceRadiusKm: number;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'GOLD' | 'PLATINUM';
  rating: number;
  completedTripsCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  currentAssignedVehicleId?: string;
  createdAt: string;
}

@Injectable()
export class DriverService {
  private drivers: DriverProfileItem[] = [
    {
      id: 'drv-narsimha-01',
      userId: 'usr-laxman-004',
      userName: 'B. Narsimha',
      userPhone: '+91 98483 44556',
      licenseType: 'HMV_HEAVY',
      licenseNumber: 'DL-TS-2023-884912',
      licenseExpiry: '2028-12-31T23:59:59Z',
      experienceYears: 9,
      serviceRadiusKm: 50.0,
      verificationStatus: 'VERIFIED',
      rating: 4.8,
      completedTripsCount: 142,
      status: 'ACTIVE',
      currentAssignedVehicleId: 'veh-eicher-01',
      createdAt: '2026-01-05T10:00:00Z',
    },
    {
      id: 'drv-suresh-02',
      userId: 'usr-suresh-002',
      userName: 'Suresh Reddy (Owner-Driver)',
      userPhone: '+91 98481 12233',
      licenseType: 'TRACTOR_TRAILER',
      licenseNumber: 'DL-TS-2022-441098',
      licenseExpiry: '2029-06-30T23:59:59Z',
      experienceYears: 6,
      serviceRadiusKm: 25.0,
      verificationStatus: 'VERIFIED',
      rating: 4.9,
      completedTripsCount: 88,
      status: 'ACTIVE',
      currentAssignedVehicleId: 'veh-tractor-trailer-02',
      createdAt: '2026-01-10T12:00:00Z',
    },
    {
      id: 'drv-anand-03',
      userId: 'usr-anand-007',
      userName: 'K. Anand',
      userPhone: '+91 98482 77665',
      licenseType: 'HMV_HEAVY',
      licenseNumber: 'DL-TS-2021-992384',
      licenseExpiry: '2027-09-15T23:59:59Z',
      experienceYears: 12,
      serviceRadiusKm: 80.0,
      verificationStatus: 'GOLD',
      rating: 4.9,
      completedTripsCount: 265,
      status: 'ACTIVE',
      currentAssignedVehicleId: 'veh-tata-truck-03',
      createdAt: '2026-01-18T14:30:00Z',
    },
    {
      id: 'drv-expired-sample',
      userId: 'usr-expired-09',
      userName: 'M. Raghavendra',
      userPhone: '+91 98480 00112',
      licenseType: 'LMV_COMMERCIAL',
      licenseNumber: 'DL-TS-2018-112233',
      licenseExpiry: '2025-01-01T00:00:00Z', // Expired!
      experienceYears: 4,
      serviceRadiusKm: 20.0,
      verificationStatus: 'UNVERIFIED',
      rating: 3.5,
      completedTripsCount: 15,
      status: 'INACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  listDrivers(filter?: { status?: string; licenseType?: string; verifiedOnly?: boolean }): DriverProfileItem[] {
    return this.drivers.filter((d) => {
      if (filter?.status && d.status !== filter.status) return false;
      if (filter?.licenseType && d.licenseType !== filter.licenseType) return false;
      if (filter?.verifiedOnly && d.verificationStatus === 'UNVERIFIED') return false;
      return true;
    });
  }

  getDriver(id: string): DriverProfileItem {
    const driver = this.drivers.find((d) => d.id === id || d.userId === id);
    if (!driver) {
      throw new NotFoundException(`Driver profile ${id} not found`);
    }
    return driver;
  }

  registerDriver(data: {
    userId: string;
    userName: string;
    userPhone: string;
    licenseType: 'LMV_COMMERCIAL' | 'HMV_HEAVY' | 'TRACTOR_TRAILER' | 'HAZARDOUS_TANKER';
    licenseNumber: string;
    licenseExpiry: string;
    experienceYears?: number;
    serviceRadiusKm?: number;
  }): DriverProfileItem {
    const exists = this.drivers.some(
      (d) => d.licenseNumber.replace(/[\s-]/g, '').toLowerCase() === data.licenseNumber.replace(/[\s-]/g, '').toLowerCase()
    );
    if (exists) {
      throw new BadRequestException(`Driver with license ${data.licenseNumber} already exists`);
    }

    const newDriver: DriverProfileItem = {
      id: `drv-${Date.now().toString(36)}`,
      userId: data.userId,
      userName: data.userName,
      userPhone: data.userPhone,
      licenseType: data.licenseType,
      licenseNumber: data.licenseNumber.toUpperCase(),
      licenseExpiry: data.licenseExpiry,
      experienceYears: data.experienceYears || 1,
      serviceRadiusKm: data.serviceRadiusKm || 30.0,
      verificationStatus: 'VERIFIED',
      rating: 5.0,
      completedTripsCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.drivers.push(newDriver);
    return newDriver;
  }

  isDriverEligible(driverId: string): { eligible: boolean; reason?: string } {
    const driver = this.getDriver(driverId);
    if (driver.status !== 'ACTIVE') {
      return { eligible: false, reason: `Driver status is ${driver.status}` };
    }
    const expiry = new Date(driver.licenseExpiry);
    if (expiry <= new Date()) {
      return { eligible: false, reason: `Commercial driving license expired on ${driver.licenseExpiry.split('T')[0]}` };
    }
    return { eligible: true };
  }
}

