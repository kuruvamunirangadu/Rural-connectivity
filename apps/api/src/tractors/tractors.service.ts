import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export const VALID_ATTACHMENT_TYPES = [
  'PLOUGH',
  'ROTAVATOR',
  'CULTIVATOR',
  'HARROW',
  'SEED_DRILL',
  'TRAILER',
  'LAND_LEVELER',
  'OTHER',
];

@Injectable()
export class TractorsService {
  private ownerProfile = {
    id: 'to-ravi-001',
    userId: 'usr-ravi-001',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
  };

  private tractors = [
    {
      id: 'tr-001',
      ownerId: 'to-ravi-001',
      registrationNumber: 'APXX1234',
      brand: 'John Deere',
      model: '5310',
      hp: 55,
      manufacturingYear: 2023,
      condition: 'Good',
      status: 'ACTIVE',
      attachments: [
        { id: 'att-1', tractorId: 'tr-001', attachmentType: 'ROTAVATOR', brand: 'Shaktiman', condition: 'Good', status: 'ACTIVE' },
        { id: 'att-2', tractorId: 'tr-001', attachmentType: 'PLOUGH', brand: 'Mahindra', condition: 'Good', status: 'ACTIVE' },
        { id: 'att-3', tractorId: 'tr-001', attachmentType: 'TRAILER', brand: 'Local', condition: 'Good', status: 'ACTIVE' },
      ],
    },
    {
      id: 'tr-002',
      ownerId: 'to-suresh-002',
      registrationNumber: 'TS34CD5678',
      brand: 'Mahindra',
      model: '575 DI',
      hp: 50,
      manufacturingYear: 2022,
      condition: 'Good',
      status: 'ACTIVE',
      attachments: [
        { id: 'att-4', tractorId: 'tr-002', attachmentType: 'ROTAVATOR', brand: 'Fieldking', condition: 'Good', status: 'ACTIVE' },
        { id: 'att-5', tractorId: 'tr-002', attachmentType: 'PLOUGH', brand: 'National', condition: 'Good', status: 'ACTIVE' },
      ],
    },
  ];

  async getOwnerProfile() {
    return {
      ...this.ownerProfile,
      tractors: this.tractors.filter((t) => t.ownerId === this.ownerProfile.id),
    };
  }

  async updateOwnerProfile(dto: any) {
    this.ownerProfile = { ...this.ownerProfile, ...dto };
    return this.ownerProfile;
  }

  async getMyTractors() {
    return this.tractors.filter((t) => t.ownerId === this.ownerProfile.id);
  }

  async getTractorById(id: string) {
    const tractor = this.tractors.find((t) => t.id === id);
    if (!tractor) {
      throw new NotFoundException(`Tractor ${id} not found`);
    }
    return tractor;
  }

  async createTractor(dto: any) {
    if (!dto.hp || Number(dto.hp) <= 0) {
      throw new BadRequestException('Valid horsepower (HP) is required');
    }

    const newTractor = {
      id: `tr-${Date.now()}`,
      ownerId: this.ownerProfile.id,
      brand: dto.brand || 'Mahindra',
      model: dto.model || 'Standard',
      hp: Number(dto.hp),
      registrationNumber: dto.registrationNumber || `AP${Math.floor(1000 + Math.random() * 9000)}`,
      manufacturingYear: dto.manufacturingYear || 2023,
      condition: dto.condition || 'Good',
      status: 'ACTIVE',
      attachments: (dto.attachments || []).map((att: any, idx: number) => ({
        id: `att-${Date.now()}-${idx}`,
        attachmentType: typeof att === 'string' ? att.toUpperCase() : att.attachmentType?.toUpperCase(),
        status: 'ACTIVE',
        condition: 'Good',
      })),
    };

    this.tractors.push(newTractor);
    return newTractor;
  }

  async updateTractor(id: string, dto: any) {
    const idx = this.tractors.findIndex((t) => t.id === id);
    if (idx < 0) {
      throw new NotFoundException(`Tractor ${id} not found`);
    }
    this.tractors[idx] = { ...this.tractors[idx], ...dto };
    return this.tractors[idx];
  }

  async deleteTractor(id: string) {
    this.tractors = this.tractors.filter((t) => t.id !== id);
    return { success: true, deletedId: id };
  }

  async addAttachment(tractorId: string, dto: any) {
    const tractor = await this.getTractorById(tractorId);
    const attachmentType = dto.attachmentType?.toUpperCase();
    if (!VALID_ATTACHMENT_TYPES.includes(attachmentType)) {
      throw new BadRequestException(`Invalid attachment type: ${dto.attachmentType}. Allowed: ${VALID_ATTACHMENT_TYPES.join(', ')}`);
    }

    const newAttachment = {
      id: `att-${Date.now()}`,
      tractorId,
      attachmentType,
      brand: dto.brand || 'Standard',
      condition: dto.condition || 'Good',
      status: 'ACTIVE',
    };

    tractor.attachments.push(newAttachment);
    return newAttachment;
  }

  async getAttachments(tractorId: string) {
    const tractor = await this.getTractorById(tractorId);
    return tractor.attachments;
  }

  async deleteAttachment(tractorId: string, attachmentId: string) {
    const tractor = await this.getTractorById(tractorId);
    tractor.attachments = tractor.attachments.filter((a) => a.id !== attachmentId);
    return { success: true, deletedAttachmentId: attachmentId };
  }
}
