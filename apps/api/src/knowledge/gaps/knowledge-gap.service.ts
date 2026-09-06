import { Injectable, NotFoundException } from '@nestjs/common';

export interface KnowledgeGapDto {
  id: string;
  query: string;
  cropName?: string;
  activityType?: string;
  searchCount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_REVIEW' | 'CONTENT_CREATED' | 'RESOLVED';
  assignedAgronomist?: string;
  resultingArticleId?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class KnowledgeGapService {
  private gaps: KnowledgeGapDto[] = [
    {
      id: 'gap-cot-irr-flower',
      query: 'Cotton furrow irrigation interval during square and boll bursting',
      cropName: 'Cotton',
      activityType: 'IRRIGATION',
      searchCount: 142,
      priority: 'HIGH',
      status: 'OPEN',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: '2026-02-18T00:00:00Z',
    },
    {
      id: 'gap-gnt-pod-borer',
      query: 'Groundnut leaf miner organic botanical neem oil formulation ratio',
      cropName: 'Groundnut',
      activityType: 'SPRAYING',
      searchCount: 89,
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      assignedAgronomist: 'Dr. V. Prasad',
      createdAt: '2026-02-12T00:00:00Z',
      updatedAt: '2026-02-19T00:00:00Z',
    },
  ];

  listGaps(filter?: { status?: string; priority?: string }): KnowledgeGapDto[] {
    return this.gaps.filter((g) => {
      if (filter?.status && g.status !== filter.status) return false;
      if (filter?.priority && g.priority !== filter.priority) return false;
      return true;
    });
  }

  recordQueryMiss(query: string, cropName?: string, activityType?: string): KnowledgeGapDto {
    const cleanQuery = query.trim().toLowerCase();
    const existing = this.gaps.find((g) => g.query.toLowerCase() === cleanQuery);

    if (existing) {
      existing.searchCount += 1;
      if (existing.searchCount > 100) existing.priority = 'HIGH';
      if (existing.searchCount > 250) existing.priority = 'CRITICAL';
      existing.updatedAt = new Date().toISOString();
      return existing;
    }

    const id = `gap-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newGap: KnowledgeGapDto = {
      id,
      query: query.trim(),
      cropName,
      activityType,
      searchCount: 1,
      priority: 'LOW',
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    };

    this.gaps.push(newGap);
    return newGap;
  }

  updateGapStatus(
    id: string,
    status: 'OPEN' | 'IN_REVIEW' | 'CONTENT_CREATED' | 'RESOLVED',
    resultingArticleId?: string
  ): KnowledgeGapDto {
    const gap = this.gaps.find((g) => g.id === id);
    if (!gap) {
      throw new NotFoundException(`Knowledge gap ${id} not found`);
    }
    gap.status = status;
    if (resultingArticleId) gap.resultingArticleId = resultingArticleId;
    gap.updatedAt = new Date().toISOString();
    return gap;
  }
}
