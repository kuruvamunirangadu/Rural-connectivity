import { Injectable, NotFoundException } from '@nestjs/common';

export interface LocationEntity {
  id: string;
  country: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  locality?: string;
  latitude: number;
  longitude: number;
  locationSource: 'GPS' | 'USER_SELECTED' | 'ADDRESS' | 'ADMIN_VERIFIED';
  locationAccuracyMeters?: number;
  postalCode?: string;
  createdAt: Date;
}

@Injectable()
export class LocationsService {
  private locations: LocationEntity[] = [
    {
      id: 'loc-001',
      country: 'India',
      state: 'Telangana',
      district: 'Vikarabad',
      mandal: 'Tandur',
      village: 'Village A (Tangipalli)',
      locality: 'Near Gram Panchayat',
      latitude: 17.25,
      longitude: 77.58,
      locationSource: 'GPS',
      locationAccuracyMeters: 8,
      postalCode: '501141',
      createdAt: new Date(),
    },
    {
      id: 'loc-002',
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      mandal: 'Tenali',
      village: 'Village B (Angalakuduru)',
      locality: 'Main Road',
      latitude: 16.24,
      longitude: 80.64,
      locationSource: 'GPS',
      locationAccuracyMeters: 5,
      postalCode: '522202',
      createdAt: new Date(),
    },
  ];

  async createLocation(dto: any): Promise<LocationEntity> {
    const newLoc: LocationEntity = {
      id: `loc-${Date.now()}`,
      country: dto.country || 'India',
      state: dto.state || 'Telangana',
      district: dto.district || 'Vikarabad',
      mandal: dto.mandal || 'Tandur',
      village: dto.village || 'Village A',
      locality: dto.locality,
      latitude: dto.latitude ? Number(dto.latitude) : 17.25,
      longitude: dto.longitude ? Number(dto.longitude) : 77.58,
      locationSource: dto.locationSource || 'USER_SELECTED',
      locationAccuracyMeters: dto.locationAccuracyMeters ? Number(dto.locationAccuracyMeters) : 10,
      postalCode: dto.postalCode || '500001',
      createdAt: new Date(),
    };

    this.locations.push(newLoc);
    return newLoc;
  }

  async getLocations(query: { state?: string; district?: string; mandal?: string; village?: string }): Promise<LocationEntity[]> {
    return this.locations.filter((l) => {
      if (query.state && l.state.toLowerCase() !== query.state.toLowerCase()) return false;
      if (query.district && l.district.toLowerCase() !== query.district.toLowerCase()) return false;
      if (query.mandal && l.mandal.toLowerCase() !== query.mandal.toLowerCase()) return false;
      if (query.village && !l.village.toLowerCase().includes(query.village.toLowerCase())) return false;
      return true;
    });
  }

  async getLocationById(id: string): Promise<LocationEntity> {
    const loc = this.locations.find((l) => l.id === id);
    if (!loc) {
      throw new NotFoundException(`Location ${id} not found`);
    }
    return loc;
  }

  async updateLocation(id: string, dto: any): Promise<LocationEntity> {
    const loc = await this.getLocationById(id);
    Object.assign(loc, dto);
    return loc;
  }

  async deleteLocation(id: string): Promise<{ success: boolean; deletedId: string }> {
    this.locations = this.locations.filter((l) => l.id !== id);
    return { success: true, deletedId: id };
  }
}
