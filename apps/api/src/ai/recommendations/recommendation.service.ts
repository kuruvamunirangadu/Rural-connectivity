import { Injectable, NotFoundException } from '@nestjs/common';
import { MockAIProvider } from '../providers/mock-ai.provider';

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'RESOURCE' | 'FARM_ACTIVITY' | 'PRICE' | 'SUPPLIER';
  referenceType: string;
  referenceId: string;
  title: string;
  description: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'GENERATED' | 'ACCEPTED' | 'REJECTED';
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AIFeedback {
  id: string;
  userId: string;
  recommendationId: string;
  rating: 'UPVOTE' | 'DOWNVOTE';
  feedback?: string;
  createdAt: string;
}

@Injectable()
export class RecommendationService {
  constructor(private readonly aiProvider: MockAIProvider) {}

  private recommendations: AIRecommendation[] = [
    {
      id: 'rec-001',
      userId: 'usr-ravi-001',
      type: 'RESOURCE',
      referenceType: 'TRACTOR',
      referenceId: 'tr-001',
      title: 'Top Recommended Tractor: Mahindra 575 DI (50 HP)',
      description: 'Optimal match for 5-acre cotton field preparation. Located 3.8 km away, equipped with Rotavator, ★ 4.8 rating with 96% completion rate.',
      confidence: 'HIGH',
      status: 'GENERATED',
      metadata: { distanceKm: 3.8, matchScore: 94, providerName: 'Suresh Reddy' },
      createdAt: new Date().toISOString(),
    },
  ];

  private feedbackList: AIFeedback[] = [];

  async getRecommendations(userId = 'usr-ravi-001'): Promise<AIRecommendation[]> {
    return this.recommendations.filter((r) => r.userId === userId);
  }

  async acceptRecommendation(id: string): Promise<AIRecommendation> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) throw new NotFoundException(`Recommendation ${id} not found`);
    rec.status = 'ACCEPTED';
    return rec;
  }

  async rejectRecommendation(id: string): Promise<AIRecommendation> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) throw new NotFoundException(`Recommendation ${id} not found`);
    rec.status = 'REJECTED';
    return rec;
  }

  async recordFeedback(userId: string, recommendationId: string, rating: 'UPVOTE' | 'DOWNVOTE', comment?: string): Promise<AIFeedback> {
    const fb: AIFeedback = {
      id: `fb-${Date.now()}`,
      userId,
      recommendationId,
      rating,
      feedback: comment,
      createdAt: new Date().toISOString(),
    };
    this.feedbackList.push(fb);
    return fb;
  }
}
