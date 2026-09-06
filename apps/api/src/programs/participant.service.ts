import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface ProgramParticipantItem {
  id: string;
  programId: string;
  userId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  mandal: string;
  landAcreage: number;
  subsidyAllocated: number; // INR
  subsidyClaimed: number;   // INR
  status: 'enrolled' | 'approved' | 'rejected' | 'disbursed';
  enrolledAt: string;
  approvedAt?: string;
  appliedMachineryType?: string;
}

@Injectable()
export class ProgramParticipantService {
  private participants: ProgramParticipantItem[] = [
    {
      id: 'part-001',
      programId: 'prg-tel-mech-2026',
      userId: 'usr-ramesh-001',
      farmerName: 'Ramesh Reddy',
      farmerPhone: '+91 98765 43210',
      village: 'Garladinne',
      mandal: 'Kalyan Zone',
      landAcreage: 8.5,
      subsidyAllocated: 12000,
      subsidyClaimed: 12000,
      status: 'disbursed',
      enrolledAt: '2026-01-20T10:00:00Z',
      approvedAt: '2026-01-25T14:00:00Z',
      appliedMachineryType: 'Tractor Rotavator + Drip Spraying',
    },
    {
      id: 'part-002',
      programId: 'prg-tel-mech-2026',
      userId: 'usr-suresh-002',
      farmerName: 'Suresh Gowd',
      farmerPhone: '+91 98765 43211',
      village: 'Peddapalli',
      mandal: 'Kalyan Zone',
      landAcreage: 5.0,
      subsidyAllocated: 8000,
      subsidyClaimed: 8000,
      status: 'disbursed',
      enrolledAt: '2026-01-22T11:30:00Z',
      approvedAt: '2026-01-26T09:00:00Z',
      appliedMachineryType: 'Custom Hiring Center Spraying',
    },
    {
      id: 'part-003',
      programId: 'prg-tel-mech-2026',
      userId: 'usr-venkat-004',
      farmerName: 'Venkat Rao',
      farmerPhone: '+91 98765 43213',
      village: 'Garladinne',
      mandal: 'Kalyan Zone',
      landAcreage: 6.0,
      subsidyAllocated: 9500,
      subsidyClaimed: 0,
      status: 'approved',
      enrolledAt: '2026-02-01T15:00:00Z',
      approvedAt: '2026-02-05T12:00:00Z',
      appliedMachineryType: 'Paddy Multi-crop Harvester Subsidy',
    },
    {
      id: 'part-004',
      programId: 'prg-tel-mech-2026',
      userId: 'usr-laxmi-005',
      farmerName: 'Laxmi Devi',
      farmerPhone: '+91 98765 43214',
      village: 'Peddapalli',
      mandal: 'Kalyan Zone',
      landAcreage: 3.5,
      subsidyAllocated: 5000,
      subsidyClaimed: 0,
      status: 'enrolled',
      enrolledAt: '2026-02-12T16:30:00Z',
      appliedMachineryType: 'Battery Powered Sprayer Grant',
    },
  ];

  listParticipants(programId: string): ProgramParticipantItem[] {
    return this.participants.filter((p) => p.programId === programId);
  }

  enrollParticipant(programId: string, data: {
    userId: string;
    farmerName: string;
    farmerPhone: string;
    village: string;
    mandal: string;
    landAcreage: number;
    subsidyRatePct: number;
    appliedMachineryType?: string;
  }): ProgramParticipantItem {
    const exists = this.participants.some(
      (p) => p.programId === programId && p.userId === data.userId
    );
    if (exists) {
      throw new BadRequestException(`Farmer ${data.userId} is already enrolled in this program`);
    }

    // Estimate subsidy based on acreage & scheme subsidy rate
    const estimatedCost = data.landAcreage * 3000;
    const subsidyAllocated = Math.round((estimatedCost * (data.subsidyRatePct || 50)) / 100);

    const newPart: ProgramParticipantItem = {
      id: `part-${Date.now().toString(36)}`,
      programId,
      userId: data.userId,
      farmerName: data.farmerName,
      farmerPhone: data.farmerPhone,
      village: data.village,
      mandal: data.mandal,
      landAcreage: data.landAcreage,
      subsidyAllocated,
      subsidyClaimed: 0,
      status: 'enrolled',
      enrolledAt: new Date().toISOString(),
      appliedMachineryType: data.appliedMachineryType || 'Standard Mechanization Drive',
    };

    this.participants.push(newPart);
    return newPart;
  }

  updateStatus(
    programId: string,
    participantId: string,
    status: 'enrolled' | 'approved' | 'rejected' | 'disbursed',
    subsidyClaimed?: number
  ): ProgramParticipantItem {
    const part = this.participants.find((p) => p.programId === programId && p.id === participantId);
    if (!part) {
      throw new NotFoundException(`Participant ${participantId} not found`);
    }

    part.status = status;
    if (status === 'approved' && !part.approvedAt) {
      part.approvedAt = new Date().toISOString();
    }
    if (subsidyClaimed !== undefined) {
      part.subsidyClaimed = subsidyClaimed;
    } else if (status === 'disbursed') {
      part.subsidyClaimed = part.subsidyAllocated;
    }

    return part;
  }
}

