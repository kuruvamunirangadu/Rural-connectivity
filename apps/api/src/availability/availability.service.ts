import { Injectable } from '@nestjs/common';

@Injectable()
export class AvailabilityService {
  private availabilitySlots = [
    {
      id: 'av-001',
      resourceType: 'TRACTOR',
      resourceId: 'tr-001',
      date: '2026-09-05',
      startTime: '07:00',
      endTime: '15:00',
      status: 'AVAILABLE',
    },
    {
      id: 'av-002',
      resourceType: 'WORKER',
      resourceId: 'wp-001',
      date: '2026-09-05',
      startTime: '06:00',
      endTime: '18:00',
      status: 'AVAILABLE',
    },
  ];

  async getMyAvailability() {
    return this.availabilitySlots;
  }

  async create(dto: any) {
    const newSlot = {
      id: `av-${Date.now()}`,
      status: 'AVAILABLE',
      ...dto,
    };
    this.availabilitySlots.push(newSlot);
    return newSlot;
  }

  async update(id: string, dto: any) {
    const idx = this.availabilitySlots.findIndex((a) => a.id === id);
    if (idx >= 0) {
      this.availabilitySlots[idx] = { ...this.availabilitySlots[idx], ...dto };
      return this.availabilitySlots[idx];
    }
    return null;
  }

  async delete(id: string) {
    this.availabilitySlots = this.availabilitySlots.filter((a) => a.id !== id);
    return { success: true, deletedId: id };
  }
}
