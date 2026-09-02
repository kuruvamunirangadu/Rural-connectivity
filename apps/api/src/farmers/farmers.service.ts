import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmersService {
  private farmerProfile = {
    id: 'fp-ravi-001',
    userId: 'usr-ravi-001',
    preferredLanguage: 'Telugu',
    experienceYears: 12,
  };

  private farms = [
    {
      id: 'farm-001',
      farmerId: 'fp-ravi-001',
      name: 'Farm A',
      area: 5.0,
      areaUnit: 'acres',
      crop: 'Cotton',
      irrigationType: 'borewell',
      locationId: 'loc-tangipalli',
    },
    {
      id: 'farm-002',
      farmerId: 'fp-ravi-001',
      name: 'Farm B',
      area: 3.0,
      areaUnit: 'acres',
      crop: 'Paddy',
      irrigationType: 'canal',
      locationId: 'loc-tangipalli',
    },
    {
      id: 'farm-003',
      farmerId: 'fp-ravi-001',
      name: 'Farm C',
      area: 2.0,
      areaUnit: 'acres',
      crop: 'Chilli',
      irrigationType: 'drip',
      locationId: 'loc-malkapur',
    },
  ];

  async getProfile() {
    return { ...this.farmerProfile, farms: this.farms };
  }

  async updateProfile(updateDto: any) {
    this.farmerProfile = { ...this.farmerProfile, ...updateDto };
    return this.farmerProfile;
  }

  async getFarms() {
    return this.farms;
  }

  async getFarmById(id: string) {
    return this.farms.find((f) => f.id === id) || null;
  }

  async createFarm(farmDto: any) {
    const newFarm = {
      id: `farm-${Date.now()}`,
      farmerId: this.farmerProfile.id,
      ...farmDto,
    };
    this.farms.push(newFarm);
    return newFarm;
  }

  async updateFarm(id: string, updateDto: any) {
    const idx = this.farms.findIndex((f) => f.id === id);
    if (idx >= 0) {
      this.farms[idx] = { ...this.farms[idx], ...updateDto };
      return this.farms[idx];
    }
    return null;
  }

  async deleteFarm(id: string) {
    this.farms = this.farms.filter((f) => f.id !== id);
    return { success: true, deletedId: id };
  }
}
