import { Injectable } from '@nestjs/common';

export interface CoverageAreaItem {
  id: string;
  programId: string;
  state: string;
  district: string;
  mandal?: string;
  village?: string;
  coverageType: 'STATE' | 'DISTRICT' | 'MANDAL' | 'VILLAGE';
  eligibleFarmerCount: number;
}

@Injectable()
export class ProgramLocationService {
  private locations: CoverageAreaItem[] = [
    {
      id: 'ploc-001',
      programId: 'prg-tel-mech-2026',
      state: 'Telangana',
      district: 'Mahbubnagar',
      mandal: 'All Mandals (14)',
      coverageType: 'DISTRICT',
      eligibleFarmerCount: 8400,
    },
    {
      id: 'ploc-002',
      programId: 'prg-tel-mech-2026',
      state: 'Telangana',
      district: 'Ranga Reddy',
      mandal: 'All Mandals (18)',
      coverageType: 'DISTRICT',
      eligibleFarmerCount: 6200,
    },
    {
      id: 'ploc-003',
      programId: 'prg-tel-mech-2026',
      state: 'Telangana',
      district: 'Sangareddy',
      mandal: 'All Mandals (16)',
      coverageType: 'DISTRICT',
      eligibleFarmerCount: 3820,
    },
    {
      id: 'ploc-004',
      programId: 'prg-kd-cotton-2026',
      state: 'Telangana',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Garladinne',
      coverageType: 'VILLAGE',
      eligibleFarmerCount: 180,
    },
  ];

  getLocationsByProgram(programId: string): CoverageAreaItem[] {
    return this.locations.filter((l) => l.programId === programId);
  }

  addLocation(programId: string, data: Omit<CoverageAreaItem, 'id' | 'programId'>): CoverageAreaItem {
    const newLoc: CoverageAreaItem = {
      id: `ploc-${Date.now().toString(36)}`,
      programId,
      ...data,
    };
    this.locations.push(newLoc);
    return newLoc;
  }
}

