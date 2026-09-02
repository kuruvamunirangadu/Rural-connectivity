import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export const VALID_EQUIPMENT_TYPES = ['SPRAYER', 'PUMP', 'WATER_PUMP', 'OTHER'];

@Injectable()
export class EquipmentService {
  private ownerProfile = {
    id: 'eo-ravi-001',
    userId: 'usr-ravi-001',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
  };

  private equipment = [
    {
      id: 'eq-001',
      ownerId: 'eo-ravi-001',
      type: 'SPRAYER',
      brand: 'Aspee',
      model: 'HTP-35 Power Sprayer',
      capacity: 500, // 500 Liters
      condition: 'Good',
      status: 'ACTIVE',
    },
    {
      id: 'eq-002',
      ownerId: 'eo-mahesh-002',
      type: 'SPRAYER',
      brand: 'Fieldking',
      model: 'Tractor Mounted 500L',
      capacity: 500,
      condition: 'Good',
      status: 'ACTIVE',
    },
    {
      id: 'eq-003',
      ownerId: 'eo-ravi-001',
      type: 'PUMP',
      brand: 'Kirloskar',
      model: 'Mega 50',
      capacity: 7.5, // 7.5 HP
      condition: 'Good',
      status: 'ACTIVE',
    },
  ];

  async getOwnerProfile() {
    return {
      ...this.ownerProfile,
      equipment: this.equipment.filter((e) => e.ownerId === this.ownerProfile.id),
    };
  }

  async updateOwnerProfile(dto: any) {
    this.ownerProfile = { ...this.ownerProfile, ...dto };
    return this.ownerProfile;
  }

  async getMyEquipment() {
    return this.equipment.filter((e) => e.ownerId === this.ownerProfile.id);
  }

  async getEquipmentById(id: string) {
    const item = this.equipment.find((e) => e.id === id);
    if (!item) {
      throw new NotFoundException(`Equipment ${id} not found`);
    }
    return item;
  }

  async createEquipment(dto: any) {
    const type = dto.type?.toUpperCase();
    if (!VALID_EQUIPMENT_TYPES.includes(type)) {
      throw new BadRequestException(`Invalid equipment type: ${dto.type}. Valid types: ${VALID_EQUIPMENT_TYPES.join(', ')}`);
    }

    const newEq = {
      id: `eq-${Date.now()}`,
      ownerId: this.ownerProfile.id,
      type,
      brand: dto.brand || 'Standard',
      model: dto.model || 'Model X',
      capacity: dto.capacity ? Number(dto.capacity) : 500,
      condition: dto.condition || 'Good',
      status: 'ACTIVE',
    };

    this.equipment.push(newEq);
    return newEq;
  }

  async updateEquipment(id: string, dto: any) {
    const idx = this.equipment.findIndex((e) => e.id === id);
    if (idx < 0) {
      throw new NotFoundException(`Equipment ${id} not found`);
    }
    this.equipment[idx] = { ...this.equipment[idx], ...dto };
    return this.equipment[idx];
  }

  async deleteEquipment(id: string) {
    this.equipment = this.equipment.filter((e) => e.id !== id);
    return { success: true, deletedId: id };
  }
}
