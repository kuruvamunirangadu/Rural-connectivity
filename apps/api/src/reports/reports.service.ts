import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export type ReportReason =
  | 'FRAUD'
  | 'FAKE_PROFILE'
  | 'HARASSMENT'
  | 'ABUSIVE_BEHAVIOR'
  | 'FAKE_REVIEW'
  | 'WRONG_INFORMATION'
  | 'NO_SHOW'
  | 'OTHER';

export interface UserReportItem {
  id: string;
  reportedById: string;
  reportedUserId: string;
  bookingId?: string;
  reason: ReportReason;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  resolution?: string | null;
  createdAt: string;
}

@Injectable()
export class ReportsService {
  private reports: UserReportItem[] = [
    {
      id: 'rep-001',
      reportedById: 'usr-farmer-009',
      reportedUserId: 'usr-unknown-004',
      bookingId: 'BK-PREV-09',
      reason: 'NO_SHOW',
      description: 'Provider accepted booking but did not arrive at field location.',
      status: 'OPEN',
      priority: 'MEDIUM',
      resolution: null,
      createdAt: new Date().toISOString(),
    },
  ];

  async createReport(dto: any): Promise<UserReportItem> {
    if (!dto.reportedUserId || !dto.reason) {
      throw new BadRequestException('reportedUserId and reason are required to file a report');
    }

    const newReport: UserReportItem = {
      id: `rep-${Date.now()}`,
      reportedById: dto.reportedById || 'usr-ravi-001',
      reportedUserId: dto.reportedUserId,
      bookingId: dto.bookingId,
      reason: dto.reason,
      description: dto.description || 'User reported an issue',
      status: 'OPEN',
      priority: dto.priority || 'MEDIUM',
      resolution: null,
      createdAt: new Date().toISOString(),
    };

    this.reports.push(newReport);
    return newReport;
  }

  async getMyReports(userId = 'usr-ravi-001'): Promise<UserReportItem[]> {
    return this.reports.filter((r) => r.reportedById === userId);
  }

  async getAllReports(): Promise<UserReportItem[]> {
    return this.reports;
  }

  async resolveReport(id: string, resolution: string, actionTaken?: string): Promise<UserReportItem> {
    const report = this.reports.find((r) => r.id === id);
    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }

    report.status = 'RESOLVED';
    report.resolution = `${resolution} (Action: ${actionTaken || 'Warning issued'})`;
    return report;
  }
}
