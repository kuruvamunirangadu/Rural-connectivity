import { Injectable, NotFoundException } from '@nestjs/common';

export interface FinancialProfileDto {
  id: string;
  userId: string;
  currency: string;
  profileStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalIncome: number;
  totalExpense: number;
  netPlatformActivity: number;
  lastCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FinancialProfileService {
  private profiles: FinancialProfileDto[] = [
    {
      id: 'fin-prof-farmer-01',
      userId: 'usr-ravi-001',
      currency: 'INR',
      profileStatus: 'ACTIVE',
      totalIncome: 348000,
      totalExpense: 112500,
      netPlatformActivity: 235500,
      lastCalculatedAt: new Date().toISOString(),
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'fin-prof-tractor-02',
      userId: 'usr-suresh-002',
      currency: 'INR',
      profileStatus: 'ACTIVE',
      totalIncome: 186400,
      totalExpense: 42300,
      netPlatformActivity: 144100,
      lastCalculatedAt: new Date().toISOString(),
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];

  getProfile(userId: string): FinancialProfileDto {
    let profile = this.profiles.find((p) => p.userId === userId);
    if (!profile) {
      const now = new Date().toISOString();
      profile = {
        id: `fin-prof-${Date.now().toString(36)}`,
        userId,
        currency: 'INR',
        profileStatus: 'ACTIVE',
        totalIncome: 0,
        totalExpense: 0,
        netPlatformActivity: 0,
        lastCalculatedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      this.profiles.push(profile);
    }
    return profile;
  }

  updateProfileTotals(userId: string, incomeDelta: number, expenseDelta: number): FinancialProfileDto {
    const profile = this.getProfile(userId);
    profile.totalIncome += incomeDelta;
    profile.totalExpense += expenseDelta;
    profile.netPlatformActivity = profile.totalIncome - profile.totalExpense;
    profile.lastCalculatedAt = new Date().toISOString();
    profile.updatedAt = new Date().toISOString();
    return profile;
  }
}
