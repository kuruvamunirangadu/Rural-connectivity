import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface SkillItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
}

export const SEED_SKILLS: SkillItem[] = [
  { id: 'sk-1', code: 'TRACTOR_OPERATOR', name: 'Tractor Operator', category: 'Machinery', description: 'Experienced in operating 35-75 HP tractors with various agricultural attachments.' },
  { id: 'sk-2', code: 'SPRAYER_OPERATOR', name: 'Sprayer Operator', category: 'Crop Protection', description: 'Certified in calibrated agrochemical application, power sprayers, and safety protocols.' },
  { id: 'sk-3', code: 'PUMP_OPERATOR', name: 'Pump Operator', category: 'Irrigation', description: 'Skilled in operating electric and diesel agricultural water pumps.' },
  { id: 'sk-4', code: 'PUMP_TECHNICIAN', name: 'Pump Technician', category: 'Technical / Repair', description: 'Diagnostic repair and maintenance of submersible, centrifugal, and mono-block pumps.' },
  { id: 'sk-5', code: 'IRRIGATION_WORKER', name: 'Irrigation Worker', category: 'Irrigation', description: 'Drip, sprinkler, furrow irrigation management and pipe layout.' },
  { id: 'sk-6', code: 'AGRICULTURAL_MACHINERY_OPERATOR', name: 'Agricultural Machinery Operator', category: 'Machinery', description: 'Harvester, thresher, seed drill, and power tiller operation.' },
  { id: 'sk-7', code: 'MACHINERY_MECHANIC', name: 'Machinery Mechanic', category: 'Technical / Repair', description: 'Engine overhaul, hydraulic repairs, implement alignment, and field maintenance.' },
  { id: 'sk-8', code: 'GENERAL_AGRICULTURAL_WORKER', name: 'General Agricultural Worker', category: 'Field Labour', description: 'Sowing, weeding, harvesting, and manual agricultural field labor.' },
];

@Injectable()
export class WorkersService {
  private workerProfile = {
    id: 'wp-ravi-001',
    userId: 'usr-ravi-001',
    experienceYears: 5,
    serviceRadiusKm: 15,
    expectedDailyRate: 500,
    verificationStatus: 'VERIFIED',
    rating: 4.8,
  };

  private workerSkills = [
    { id: 'ws-1', workerId: 'wp-ravi-001', skillId: 'sk-2', skillCode: 'SPRAYER_OPERATOR', name: 'Sprayer Operator', experienceYears: 4 },
    { id: 'ws-2', workerId: 'wp-ravi-001', skillId: 'sk-3', skillCode: 'PUMP_OPERATOR', name: 'Pump Operator', experienceYears: 3 },
  ];

  async getProfile() {
    return {
      ...this.workerProfile,
      skills: this.workerSkills,
    };
  }

  async updateProfile(dto: any) {
    this.workerProfile = { ...this.workerProfile, ...dto };
    return this.workerProfile;
  }

  async getAllSkills() {
    return SEED_SKILLS;
  }

  async getSkillById(id: string) {
    const skill = SEED_SKILLS.find((s) => s.id === id || s.code === id.toUpperCase());
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }
    return skill;
  }

  async getSkills() {
    return this.workerSkills;
  }

  async addSkill(dto: { skillCode: string; experienceYears?: number }) {
    const code = dto.skillCode?.toUpperCase();
    const skill = SEED_SKILLS.find((s) => s.code === code);
    if (!skill) {
      throw new BadRequestException(`Invalid skill code: ${dto.skillCode}. Valid skills: ${SEED_SKILLS.map((s) => s.code).join(', ')}`);
    }

    const exists = this.workerSkills.find((ws) => ws.skillCode === code);
    if (exists) {
      return exists;
    }

    const newWorkerSkill = {
      id: `ws-${Date.now()}`,
      workerId: this.workerProfile.id,
      skillId: skill.id,
      skillCode: skill.code,
      name: skill.name,
      experienceYears: dto.experienceYears || 1,
    };

    this.workerSkills.push(newWorkerSkill);
    return newWorkerSkill;
  }

  async removeSkill(id: string) {
    this.workerSkills = this.workerSkills.filter((ws) => ws.id !== id && ws.skillId !== id);
    return { success: true, removedId: id };
  }
}
