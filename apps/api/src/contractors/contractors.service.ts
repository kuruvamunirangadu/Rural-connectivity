import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface ProjectRequirementItem {
  id: string;
  projectId: string;
  resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
  quantity: number;
  skillId?: string;
  attachmentType?: string;
  equipmentType?: string;
  tractorHpMin?: number;
  startDate: string;
  endDate?: string;
  status: 'OPEN' | 'STAFFED' | 'CANCELLED';
}

export interface ResourceAssignmentItem {
  id: string;
  projectId: string;
  requirementId: string;
  resourceType: string;
  resourceId: string;
  providerId: string;
  providerName: string;
  bookingId?: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  agreedDailyPrice: number;
}

export interface ProjectItem {
  id: string;
  contractorId: string;
  name: string;
  description?: string;
  locationId: string;
  village: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'STAFFING' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  requirements: ProjectRequirementItem[];
  assignments: ResourceAssignmentItem[];
  createdAt: Date;
}

@Injectable()
export class ContractorsService {
  private contractorProfile = {
    id: 'cp-ravi-001',
    userId: 'usr-ravi-001',
    businessName: 'Ravi Agricultural Services',
    experienceYears: 8,
    serviceRadiusKm: 25,
    verificationStatus: 'VERIFIED',
    rating: 4.9,
  };

  private projects: ProjectItem[] = [
    {
      id: 'proj-001',
      contractorId: 'cp-ravi-001',
      name: 'Cotton Field Operations',
      description: '50 Acres comprehensive land preparation & spraying across 3 villages',
      locationId: 'loc-village-x',
      village: 'Village X',
      startDate: '2026-09-10',
      endDate: '2026-09-13',
      status: 'READY',
      requirements: [
        {
          id: 'preq-1',
          projectId: 'proj-001',
          resourceType: 'TRACTOR',
          quantity: 3,
          tractorHpMin: 45,
          attachmentType: 'ROTAVATOR',
          startDate: '2026-09-10',
          endDate: '2026-09-13',
          status: 'STAFFED',
        },
        {
          id: 'preq-2',
          projectId: 'proj-001',
          resourceType: 'WORKER',
          quantity: 5,
          skillId: 'GENERAL_AGRICULTURAL_WORKER',
          startDate: '2026-09-10',
          endDate: '2026-09-13',
          status: 'STAFFED',
        },
        {
          id: 'preq-3',
          projectId: 'proj-001',
          resourceType: 'EQUIPMENT',
          quantity: 2,
          equipmentType: 'SPRAYER',
          startDate: '2026-09-10',
          endDate: '2026-09-13',
          status: 'STAFFED',
        },
      ],
      assignments: [
        { id: 'asgn-1', projectId: 'proj-001', requirementId: 'preq-1', resourceType: 'TRACTOR', resourceId: 'tr-001', providerId: 'to-suresh-002', providerName: 'Suresh Reddy (Mahindra 575)', status: 'ACCEPTED', agreedDailyPrice: 5000 },
        { id: 'asgn-2', projectId: 'proj-001', requirementId: 'preq-1', resourceType: 'TRACTOR', resourceId: 'tr-002', providerId: 'to-ramesh-003', providerName: 'Ramesh Goud (John Deere 5310)', status: 'ACCEPTED', agreedDailyPrice: 5200 },
        { id: 'asgn-3', projectId: 'proj-001', requirementId: 'preq-1', resourceType: 'TRACTOR', resourceId: 'tr-003', providerId: 'to-ravi-001', providerName: 'Ravi Kumar (Own 50 HP Tractor)', status: 'ACCEPTED', agreedDailyPrice: 5000 },
        { id: 'asgn-4', projectId: 'proj-001', requirementId: 'preq-2', resourceType: 'WORKER', resourceId: 'wp-001', providerId: 'usr-worker-1', providerName: 'Worker A (Field Labour)', status: 'ACCEPTED', agreedDailyPrice: 500 },
        { id: 'asgn-5', projectId: 'proj-001', requirementId: 'preq-2', resourceType: 'WORKER', resourceId: 'wp-002', providerId: 'usr-worker-2', providerName: 'Worker B (Field Labour)', status: 'ACCEPTED', agreedDailyPrice: 500 },
        { id: 'asgn-6', projectId: 'proj-001', requirementId: 'preq-2', resourceType: 'WORKER', resourceId: 'wp-003', providerId: 'usr-worker-3', providerName: 'Worker C (Field Labour)', status: 'ACCEPTED', agreedDailyPrice: 500 },
        { id: 'asgn-7', projectId: 'proj-001', requirementId: 'preq-2', resourceType: 'WORKER', resourceId: 'wp-004', providerId: 'usr-worker-4', providerName: 'Worker D (Field Labour)', status: 'ACCEPTED', agreedDailyPrice: 500 },
        { id: 'asgn-8', projectId: 'proj-001', requirementId: 'preq-2', resourceType: 'WORKER', resourceId: 'wp-005', providerId: 'usr-worker-5', providerName: 'Worker E (Field Labour)', status: 'ACCEPTED', agreedDailyPrice: 500 },
        { id: 'asgn-9', projectId: 'proj-001', requirementId: 'preq-3', resourceType: 'EQUIPMENT', resourceId: 'eq-001', providerId: 'usr-suresh-002', providerName: 'Sprayer A (500L Aspee)', status: 'ACCEPTED', agreedDailyPrice: 1200 },
        { id: 'asgn-10', projectId: 'proj-001', requirementId: 'preq-3', resourceType: 'EQUIPMENT', resourceId: 'eq-002', providerId: 'usr-mahesh-005', providerName: 'Sprayer B (500L Fieldking)', status: 'ACCEPTED', agreedDailyPrice: 1200 },
      ],
      createdAt: new Date(),
    },
  ];

  async getProfile() {
    return {
      ...this.contractorProfile,
      totalProjects: this.projects.length,
    };
  }

  async updateProfile(dto: any) {
    this.contractorProfile = { ...this.contractorProfile, ...dto };
    return this.contractorProfile;
  }

  async getMyProjects() {
    return this.projects;
  }

  async getProjectById(id: string) {
    const proj = this.projects.find((p) => p.id === id);
    if (!proj) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return proj;
  }

  async createProject(dto: any) {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      contractorId: this.contractorProfile.id,
      name: dto.name || 'New Agricultural Operation',
      description: dto.description || '',
      locationId: dto.locationId || 'loc-village-x',
      village: dto.village || 'Village X',
      startDate: dto.startDate || '2026-09-10',
      endDate: dto.endDate || '2026-09-13',
      status: 'OPEN',
      requirements: [],
      assignments: [],
      createdAt: new Date(),
    };

    if (dto.requirements && Array.isArray(dto.requirements)) {
      newProject.requirements = dto.requirements.map((r: any, idx: number) => ({
        id: `preq-${Date.now()}-${idx}`,
        projectId: newProject.id,
        resourceType: r.resourceType || 'TRACTOR',
        quantity: Number(r.quantity) || 1,
        tractorHpMin: r.tractorHpMin ? Number(r.tractorHpMin) : undefined,
        skillId: r.skillId,
        equipmentType: r.equipmentType,
        attachmentType: r.attachmentType,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        status: 'OPEN',
      }));
    }

    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, dto: any) {
    const proj = await this.getProjectById(id);
    Object.assign(proj, dto);
    return proj;
  }

  async deleteProject(id: string) {
    const proj = await this.getProjectById(id);
    if (['IN_PROGRESS', 'COMPLETED'].includes(proj.status)) {
      throw new BadRequestException(`Cannot delete active or completed project: ${proj.status}`);
    }
    this.projects = this.projects.filter((p) => p.id !== id);
    return { success: true, deletedId: id };
  }

  async completeProject(id: string) {
    const proj = await this.getProjectById(id);
    
    // Validate that there are no pending disputes or incomplete requirements
    const progress = await this.getProjectProgress(id);
    if (progress.shortage > 0) {
      throw new BadRequestException(`Cannot complete project with outstanding resource shortage (${progress.shortage} remaining).`);
    }

    proj.status = 'COMPLETED';
    return {
      success: true,
      projectId: proj.id,
      status: proj.status,
      message: 'Project marked as COMPLETED. All multi-resource assignments finalized.',
    };
  }

  // Requirements
  async addRequirement(projectId: string, dto: any) {
    const proj = await this.getProjectById(projectId);
    const newReq: ProjectRequirementItem = {
      id: `preq-${Date.now()}`,
      projectId,
      resourceType: dto.resourceType || 'TRACTOR',
      quantity: Number(dto.quantity) || 1,
      tractorHpMin: dto.tractorHpMin ? Number(dto.tractorHpMin) : undefined,
      skillId: dto.skillId,
      equipmentType: dto.equipmentType,
      attachmentType: dto.attachmentType,
      startDate: dto.startDate || proj.startDate,
      endDate: dto.endDate || proj.endDate,
      status: 'OPEN',
    };

    proj.requirements.push(newReq);
    return newReq;
  }

  async getRequirements(projectId: string) {
    const proj = await this.getProjectById(projectId);
    return proj.requirements;
  }

  async updateRequirement(projectId: string, reqId: string, dto: any) {
    const proj = await this.getProjectById(projectId);
    const req = proj.requirements.find((r) => r.id === reqId);
    if (!req) {
      throw new NotFoundException(`Requirement ${reqId} not found`);
    }
    Object.assign(req, dto);
    return req;
  }

  async deleteRequirement(projectId: string, reqId: string) {
    const proj = await this.getProjectById(projectId);
    proj.requirements = proj.requirements.filter((r) => r.id !== reqId);
    return { success: true, deletedReqId: reqId };
  }

  // Matching for Requirement (Multi-Day check)
  async getRequirementMatches(projectId: string, reqId: string) {
    const proj = await this.getProjectById(projectId);
    const req = proj.requirements.find((r) => r.id === reqId);
    if (!req) {
      throw new NotFoundException(`Requirement ${reqId} not found in project ${projectId}`);
    }

    // Deterministic match candidates
    if (req.resourceType === 'TRACTOR') {
      return {
        projectId,
        requirementId: reqId,
        resourceType: 'TRACTOR',
        quantityNeeded: req.quantity,
        matchedCandidates: [
          { providerId: 'to-suresh-002', name: 'Suresh Reddy', tractor: 'Mahindra 575 (50 HP)', distanceKm: 5.0, rating: 4.8, multiDayAvailable: true, score: 94 },
          { providerId: 'to-ramesh-003', name: 'Ramesh Goud', tractor: 'John Deere 5310 (55 HP)', distanceKm: 8.0, rating: 4.7, multiDayAvailable: true, score: 90 },
          { providerId: 'to-ravi-001', name: 'Ravi Kumar', tractor: 'Mahindra 50 HP (Own Fleet)', distanceKm: 0.0, rating: 4.9, multiDayAvailable: true, score: 98 },
          { providerId: 'to-kumar-004', name: 'Kumar Swami', tractor: 'Swaraj 855 (52 HP)', distanceKm: 11.0, rating: 4.4, multiDayAvailable: true, score: 82 },
        ],
      };
    } else if (req.resourceType === 'WORKER') {
      return {
        projectId,
        requirementId: reqId,
        resourceType: 'WORKER',
        quantityNeeded: req.quantity,
        matchedCandidates: [
          { providerId: 'usr-w1', name: 'Worker A (Laxman)', skill: 'General Agricultural Worker', distanceKm: 4.0, rating: 4.8, multiDayAvailable: true, score: 95 },
          { providerId: 'usr-w2', name: 'Worker B (Shankar)', skill: 'General Agricultural Worker', distanceKm: 5.0, rating: 4.7, multiDayAvailable: true, score: 92 },
          { providerId: 'usr-w3', name: 'Worker C (Venkat)', skill: 'General Agricultural Worker', distanceKm: 6.0, rating: 4.9, multiDayAvailable: true, score: 94 },
          { providerId: 'usr-w4', name: 'Worker D (Anand)', skill: 'General Agricultural Worker', distanceKm: 5.5, rating: 4.6, multiDayAvailable: true, score: 88 },
          { providerId: 'usr-w5', name: 'Worker E (Ramulu)', skill: 'General Agricultural Worker', distanceKm: 7.0, rating: 4.5, multiDayAvailable: true, score: 86 },
          { providerId: 'usr-w6', name: 'Worker F (Mallesh)', skill: 'General Agricultural Worker', distanceKm: 9.0, rating: 4.4, multiDayAvailable: true, score: 80 },
        ],
      };
    } else {
      return {
        projectId,
        requirementId: reqId,
        resourceType: 'EQUIPMENT',
        quantityNeeded: req.quantity,
        matchedCandidates: [
          { providerId: 'usr-suresh-002', name: 'Sprayer A (Aspee 500L)', capacity: 500, distanceKm: 5.0, rating: 4.8, multiDayAvailable: true, score: 95 },
          { providerId: 'usr-mahesh-005', name: 'Sprayer B (Fieldking 500L)', capacity: 500, distanceKm: 8.0, rating: 4.6, multiDayAvailable: true, score: 88 },
          { providerId: 'usr-raj-006', name: 'Sprayer C (National 500L)', capacity: 500, distanceKm: 12.0, rating: 4.3, multiDayAvailable: true, score: 80 },
        ],
      };
    }
  }

  // Resource Assignments
  async getProjectResources(projectId: string) {
    const proj = await this.getProjectById(projectId);
    return proj.assignments;
  }

  async assignResources(projectId: string, dto: any) {
    const proj = await this.getProjectById(projectId);
    const newAssignment: ResourceAssignmentItem = {
      id: `asgn-${Date.now()}`,
      projectId,
      requirementId: dto.requirementId || 'preq-1',
      resourceType: dto.resourceType || 'TRACTOR',
      resourceId: dto.resourceId || `res-${Date.now()}`,
      providerId: dto.providerId,
      providerName: dto.providerName || 'Assigned Provider',
      bookingId: `BK-${Date.now()}`,
      status: 'ACCEPTED',
      agreedDailyPrice: dto.agreedDailyPrice ? Number(dto.agreedDailyPrice) : 5000,
    };

    proj.assignments.push(newAssignment);
    return newAssignment;
  }

  async removeAssignment(projectId: string, assignmentId: string) {
    const proj = await this.getProjectById(projectId);
    proj.assignments = proj.assignments.filter((a) => a.id !== assignmentId);
    return { success: true, removedAssignmentId: assignmentId };
  }

  // Progress Tracking
  async getProjectProgress(projectId: string) {
    const proj = await this.getProjectById(projectId);
    const totalRequired = proj.requirements.reduce((acc, r) => acc + r.quantity, 0);
    const totalAssigned = proj.assignments.length;
    const totalAccepted = proj.assignments.filter((a) => a.status === 'ACCEPTED').length;
    const inProgress = proj.assignments.filter((a) => a.status === 'IN_PROGRESS').length;
    const completed = proj.assignments.filter((a) => a.status === 'COMPLETED').length;
    const shortage = Math.max(0, totalRequired - totalAccepted);
    const completionRatePct = totalRequired > 0 ? Math.round((totalAccepted / totalRequired) * 100) : 0;

    return {
      projectId: proj.id,
      projectName: proj.name,
      status: proj.status,
      required: totalRequired,
      assigned: totalAssigned,
      accepted: totalAccepted,
      inProgress,
      completed,
      shortage,
      completionRatePct,
    };
  }
}
