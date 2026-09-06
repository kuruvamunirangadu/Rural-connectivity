import { Injectable, NotFoundException } from '@nestjs/common';

export interface FinancingRequestDto {
  id: string;
  userId: string;
  purpose: 'INPUT_PURCHASE' | 'EQUIPMENT' | 'TRACTOR' | 'WORKING_CAPITAL' | 'CROP_ACTIVITY' | 'TRANSPORT' | 'OTHER';
  requestedAmount: number;
  currency: string;
  requestedTenureMonths: number;
  partnerId?: string;
  partnerName?: string;
  cropName?: string;
  farmAcreage?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ADDITIONAL_INFO_REQUIRED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FinancingRequestService {
  private requests: FinancingRequestDto[] = [
    {
      id: 'fin-req-8801',
      userId: 'usr-ravi-001',
      purpose: 'WORKING_CAPITAL',
      requestedAmount: 80000,
      currency: 'INR',
      requestedTenureMonths: 12,
      partnerId: 'prt-sbi-agri',
      partnerName: 'State Bank of India',
      cropName: 'Bt-Cotton (BG-II)',
      farmAcreage: 5.0,
      status: 'APPROVED',
      createdAt: '2026-01-12T10:00:00Z',
      updatedAt: '2026-01-15T16:00:00Z',
    },
    {
      id: 'fin-req-8802',
      userId: 'usr-suresh-002',
      purpose: 'EQUIPMENT',
      requestedAmount: 150000,
      currency: 'INR',
      requestedTenureMonths: 24,
      partnerId: 'prt-sbi-agri',
      partnerName: 'State Bank of India',
      status: 'UNDER_REVIEW',
      createdAt: '2026-02-01T11:30:00Z',
      updatedAt: '2026-02-05T09:00:00Z',
    },
  ];

  listRequests(userId: string): FinancingRequestDto[] {
    return this.requests.filter((r) => r.userId === userId);
  }

  getRequest(id: string): FinancingRequestDto {
    const request = this.requests.find((r) => r.id === id);
    if (!request) {
      throw new NotFoundException(`Financing request ${id} not found`);
    }
    return request;
  }

  createRequest(data: {
    userId: string;
    purpose: FinancingRequestDto['purpose'];
    requestedAmount: number;
    requestedTenureMonths?: number;
    partnerId?: string;
    partnerName?: string;
    cropName?: string;
    farmAcreage?: number;
  }): FinancingRequestDto {
    const id = `fin-req-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const request: FinancingRequestDto = {
      id,
      userId: data.userId,
      purpose: data.purpose,
      requestedAmount: data.requestedAmount,
      currency: 'INR',
      requestedTenureMonths: data.requestedTenureMonths || 12,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      cropName: data.cropName,
      farmAcreage: data.farmAcreage,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    this.requests.push(request);
    return request;
  }

  updateStatus(id: string, status: FinancingRequestDto['status']): FinancingRequestDto {
    const req = this.getRequest(id);
    req.status = status;
    req.updatedAt = new Date().toISOString();
    return req;
  }
}
