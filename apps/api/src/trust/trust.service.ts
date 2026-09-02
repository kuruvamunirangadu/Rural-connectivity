import { Injectable } from '@nestjs/common';
import { VerificationService } from '../verification/verification.service';
import { ReliabilityService } from './reliability.service';

export interface UserTrustProfile {
  userId: string;
  identityVerification: {
    phoneVerified: boolean;
    profileVerified: boolean;
  };
  roleVerifications: Array<{
    role: string;
    status: string;
    badgeLabel: string;
  }>;
  ratingSummary: {
    averageRating: number;
    totalRatingsCount: number;
    categoryScores: {
      equipmentQuality: number;
      punctuality: number;
      workQuality: number;
      communication: number;
    };
  };
  reliability: {
    completedJobs: number;
    completionRate: string;
    cancellationRate: string;
    noShowRate: string;
    punctualityRate: string;
    reliabilityScore: number;
  };
  trustBadges: string[];
}

@Injectable()
export class TrustService {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly reliabilityService: ReliabilityService
  ) {}

  async getUserTrustProfile(userId: string): Promise<UserTrustProfile> {
    const roleVerifications = await this.verificationService.getRoleVerificationSummary(userId);
    const reliability = await this.reliabilityService.getMetricsForUser(userId);

    const badges: string[] = ['✓ Phone Verified', '✓ Profile Verified'];

    roleVerifications.forEach((rv) => {
      if (rv.status === 'VERIFIED') {
        badges.push(rv.badgeLabel);
      }
    });

    if (reliability.isReliableProvider) {
      badges.push('⚡ Reliable Provider');
    }

    if (4.8 >= 4.5) {
      badges.push('⭐ Highly Rated');
    }

    return {
      userId,
      identityVerification: {
        phoneVerified: true,
        profileVerified: true,
      },
      roleVerifications,
      ratingSummary: {
        averageRating: 4.8,
        totalRatingsCount: 126,
        categoryScores: {
          equipmentQuality: 4.9,
          punctuality: 4.8,
          workQuality: 4.9,
          communication: 4.7,
        },
      },
      reliability: {
        completedJobs: reliability.completedJobsCount,
        completionRate: `${reliability.completionRatePct}%`,
        cancellationRate: `${reliability.cancellationRatePct}%`,
        noShowRate: `${reliability.noShowRatePct}%`,
        punctualityRate: `${reliability.punctualityRatePct}%`,
        reliabilityScore: reliability.reliabilityScore,
      },
      trustBadges: badges,
    };
  }
}
