import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { VerificationService } from '../verification/verification.service';

export interface AuditLogItem {
  id: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly verificationService: VerificationService) {}

  private auditLogs: AuditLogItem[] = [
    {
      id: 'audit-001',
      actorUserId: 'admin-001',
      action: 'ADMIN_APPROVED_VERIFICATION',
      targetType: 'ROLE_VERIFICATION',
      targetId: 'ver-001',
      reason: 'Valid RC book and fitness certificate provided for Mahindra tractor',
      createdAt: '2026-08-21T14:30:00Z',
    },
  ];

  private userStatusMap: Record<string, 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'> = {
    'usr-ravi-001': 'ACTIVE',
    'usr-suresh-002': 'ACTIVE',
  };

  async getDashboardMetrics() {
    return {
      totalUsers: 1420,
      activeTractors: 85,
      activeWorkers: 190,
      completedBookings: 640,
      pendingVerifications: (await this.verificationService.getAllPendingVerifications()).length,
      disputeRatePct: 0.8,
    };
  }

  async getPendingVerifications() {
    return this.verificationService.getAllPendingVerifications();
  }

  async approveVerification(id: string) {
    const res = await this.verificationService.approveVerification(id, 'admin-001');

    this.logAudit({
      actorUserId: 'admin-001',
      action: 'ADMIN_APPROVED_VERIFICATION',
      targetType: 'ROLE_VERIFICATION',
      targetId: id,
      reason: `Verified ${res.verification.role} documentation.`,
    });

    return res;
  }

  async rejectVerification(id: string, reason: string) {
    const res = await this.verificationService.rejectVerification(id, reason, 'admin-001');

    this.logAudit({
      actorUserId: 'admin-001',
      action: 'ADMIN_REJECTED_VERIFICATION',
      targetType: 'ROLE_VERIFICATION',
      targetId: id,
      reason,
    });

    return res;
  }

  async suspendUser(userId: string, reason: string) {
    if (!reason) {
      throw new BadRequestException('Reason is required to suspend a user.');
    }
    this.userStatusMap[userId] = 'SUSPENDED';

    this.logAudit({
      actorUserId: 'admin-001',
      action: 'ADMIN_SUSPENDED_USER',
      targetType: 'USER',
      targetId: userId,
      reason,
    });

    return {
      success: true,
      userId,
      status: 'SUSPENDED',
      message: `User ${userId} suspended. New offers blocked.`,
    };
  }

  async activateUser(userId: string) {
    this.userStatusMap[userId] = 'ACTIVE';

    this.logAudit({
      actorUserId: 'admin-001',
      action: 'ADMIN_ACTIVATED_USER',
      targetType: 'USER',
      targetId: userId,
      reason: 'Account reinstated after moderation review',
    });

    return { success: true, userId, status: 'ACTIVE' };
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return this.auditLogs;
  }

  private logAudit(entry: { actorUserId: string; action: string; targetType: string; targetId: string; reason?: string; metadata?: any }) {
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorUserId: entry.actorUserId,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      reason: entry.reason || null,
      metadata: entry.metadata,
      createdAt: new Date().toISOString(),
    });
  }
}
