import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'SUSPENDED';

export interface RoleVerificationItem {
  role: string;
  status: VerificationStatus;
  verifiedAt?: string | null;
  badgeLabel: string;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  role: string;
  verificationType: 'PHONE' | 'PROFILE' | 'IDENTITY' | 'ROLE_SPECIFIC' | 'BUSINESS';
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  rejectionReason?: string | null;
  documents: Array<{
    id: string;
    documentType: string;
    fileReference: string; // Secure storage reference, not public URL
    uploadedAt: string;
  }>;
}

@Injectable()
export class VerificationService {
  private verifications: VerificationRecord[] = [
    {
      id: 'ver-001',
      userId: 'usr-ravi-001',
      role: 'TRACTOR_OWNER',
      verificationType: 'ROLE_SPECIFIC',
      status: 'VERIFIED',
      submittedAt: '2026-08-20T10:00:00Z',
      reviewedAt: '2026-08-21T14:30:00Z',
      reviewedById: 'admin-001',
      documents: [
        { id: 'vdoc-1', documentType: 'VEHICLE_DOCUMENT', fileReference: 'enc://docs/ravi-tractor-rc.pdf', uploadedAt: '2026-08-20T10:00:00Z' },
      ],
    },
    {
      id: 'ver-002',
      userId: 'usr-ravi-001',
      role: 'EQUIPMENT_OWNER',
      verificationType: 'ROLE_SPECIFIC',
      status: 'VERIFIED',
      submittedAt: '2026-08-22T09:00:00Z',
      reviewedAt: '2026-08-22T16:00:00Z',
      reviewedById: 'admin-001',
      documents: [
        { id: 'vdoc-2', documentType: 'EQUIPMENT_DOCUMENT', fileReference: 'enc://docs/ravi-sprayer-invoice.pdf', uploadedAt: '2026-08-22T09:00:00Z' },
      ],
    },
    {
      id: 'ver-003',
      userId: 'usr-ravi-001',
      role: 'SKILLED_WORKER',
      verificationType: 'ROLE_SPECIFIC',
      status: 'PENDING',
      submittedAt: '2026-09-01T11:00:00Z',
      documents: [
        { id: 'vdoc-3', documentType: 'SKILL_CERTIFICATE', fileReference: 'enc://docs/ravi-operator-cert.pdf', uploadedAt: '2026-09-01T11:00:00Z' },
      ],
    },
  ];

  async getMyVerifications(userId = 'usr-ravi-001') {
    return this.verifications.filter((v) => v.userId === userId);
  }

  async getVerificationById(id: string) {
    const record = this.verifications.find((v) => v.id === id);
    if (!record) {
      throw new NotFoundException(`Verification record ${id} not found`);
    }
    return record;
  }

  async submitVerification(dto: any) {
    if (!dto.role) {
      throw new BadRequestException('Role is required to submit role verification');
    }

    const newVer: VerificationRecord = {
      id: `ver-${Date.now()}`,
      userId: dto.userId || 'usr-ravi-001',
      role: dto.role.toUpperCase(),
      verificationType: 'ROLE_SPECIFIC',
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      documents: dto.documents || [],
    };

    this.verifications.push(newVer);
    return newVer;
  }

  async uploadDocument(verificationId: string, dto: any) {
    const record = await this.getVerificationById(verificationId);
    const doc = {
      id: `vdoc-${Date.now()}`,
      documentType: dto.documentType || 'OTHER',
      fileReference: dto.fileReference || `enc://docs/${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString(),
    };
    record.documents.push(doc);
    return { success: true, verificationId, document: doc };
  }

  async getRoleVerificationSummary(userId: string): Promise<RoleVerificationItem[]> {
    const userVers = this.verifications.filter((v) => v.userId === userId);

    const roles = ['FARMER', 'TRACTOR_OWNER', 'SKILLED_WORKER', 'EQUIPMENT_OWNER', 'CONTRACTOR', 'SUPPLIER'];
    return roles.map((role) => {
      const match = userVers.find((v) => v.role === role);
      const status: VerificationStatus = match ? match.status : 'PENDING';
      const badge = status === 'VERIFIED' ? `✓ Verified ${role.replace('_', ' ')}` : `${role.replace('_', ' ')} (Pending)`;
      return {
        role,
        status,
        verifiedAt: match ? match.reviewedAt : null,
        badgeLabel: badge,
      };
    });
  }

  // Admin Actions
  async getAllPendingVerifications() {
    return this.verifications.filter((v) => v.status === 'PENDING');
  }

  async approveVerification(id: string, adminId = 'admin-001') {
    const record = await this.getVerificationById(id);
    record.status = 'VERIFIED';
    record.reviewedAt = new Date().toISOString();
    record.reviewedById = adminId;
    record.rejectionReason = null;
    return { success: true, verification: record, message: `Verification approved for ${record.role}` };
  }

  async rejectVerification(id: string, reason: string, adminId = 'admin-001') {
    const record = await this.getVerificationById(id);
    record.status = 'REJECTED';
    record.reviewedAt = new Date().toISOString();
    record.reviewedById = adminId;
    record.rejectionReason = reason || 'Incomplete or unverified documentation';
    return { success: true, verification: record, message: 'Verification rejected' };
  }
}
