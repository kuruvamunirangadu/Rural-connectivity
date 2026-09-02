import { Injectable } from '@nestjs/common';
import { AnalyticsEventService } from './analytics-event.service';

export interface MarketplaceFunnelMetrics {
  workRequestsCount: number;
  matchesFoundCount: number;
  offersSentCount: number;
  offersAcceptedCount: number;
  bookingsCreatedCount: number;
  bookingsCompletedCount: number;
  bookingsCancelledCount: number;
  matchRatePct: number;
  offerAcceptanceRatePct: number;
  bookingConversionRatePct: number;
  completionRatePct: number;
  cancellationRatePct: number;
}

export interface FinancialAnalyticsMetrics {
  gmvServices: number;
  gmvProducts: number;
  totalGmv: number;
  platformRevenueGross: number;
  refundsProcessed: number;
  platformRevenueNet: number;
  providerSettlementsPaid: number;
  pendingSettlements: number;
}

export interface DailyMarketplaceMetric {
  id: string;
  date: string;
  locationId: string;
  resourceType: string;
  requests: number;
  matches: number;
  offers: number;
  acceptedOffers: number;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  gmv: number;
  platformRevenue: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsEventService: AnalyticsEventService) {}

  private dailyMetrics: DailyMarketplaceMetric[] = [
    {
      id: 'dmm-2026-09-02-guntur',
      date: '2026-09-02',
      locationId: 'dist-guntur',
      resourceType: 'TRACTOR',
      requests: 1240,
      matches: 980,
      offers: 810,
      acceptedOffers: 650,
      bookings: 620,
      completedBookings: 540,
      cancelledBookings: 50,
      gmv: 840000,
      platformRevenue: 42000,
    },
  ];

  async getMarketplaceOverview(): Promise<{
    funnel: MarketplaceFunnelMetrics;
    financials: FinancialAnalyticsMetrics;
    activeUsersSummary: { farmers: number; tractorOwners: number; workers: number; equipmentOwners: number; suppliers: number; contractors: number };
  }> {
    const d = this.dailyMetrics[0];

    const matchRate = Math.round((d.matches / d.requests) * 1000) / 10; // 79.0%
    const offerAcceptance = Math.round((d.acceptedOffers / d.offers) * 1000) / 10; // 80.2%
    const bookingConversion = Math.round((d.bookings / d.requests) * 1000) / 10; // 50.0%
    const completionRate = Math.round((d.completedBookings / d.bookings) * 1000) / 10; // 87.1%
    const cancellationRate = Math.round((d.cancelledBookings / d.bookings) * 1000) / 10; // 8.1%

    return {
      funnel: {
        workRequestsCount: d.requests,
        matchesFoundCount: d.matches,
        offersSentCount: d.offers,
        offersAcceptedCount: d.acceptedOffers,
        bookingsCreatedCount: d.bookings,
        bookingsCompletedCount: d.completedBookings,
        bookingsCancelledCount: d.cancelledBookings,
        matchRatePct: matchRate,
        offerAcceptanceRatePct: offerAcceptance,
        bookingConversionRatePct: bookingConversion,
        completionRatePct: completionRate,
        cancellationRatePct: cancellationRate,
      },
      financials: {
        gmvServices: 840000,
        gmvProducts: 160000,
        totalGmv: 1000000,
        platformRevenueGross: 50000,
        refundsProcessed: 8000,
        platformRevenueNet: 42000,
        providerSettlementsPaid: 798000,
        pendingSettlements: 152000,
      },
      activeUsersSummary: {
        farmers: 12000,
        tractorOwners: 3500,
        workers: 2800,
        equipmentOwners: 1200,
        suppliers: 650,
        contractors: 420,
      },
    };
  }

  async getDemandAnalytics() {
    return {
      byResourceType: {
        TRACTOR: 1200,
        SPRAYER: 680,
        WORKER: 940,
        PUMP: 220,
      },
      byCrop: {
        Cotton: { tractorDemand: 'HIGH', sprayerDemand: 'VERY_HIGH', workerDemand: 'MEDIUM', inputDemand: 'HIGH' },
        Rice: { tractorDemand: 'VERY_HIGH', pumpDemand: 'HIGH', workerDemand: 'HIGH', inputDemand: 'HIGH' },
        Chilli: { tractorDemand: 'MEDIUM', sprayerDemand: 'HIGH', workerDemand: 'HIGH', inputDemand: 'MEDIUM' },
      },
      byDistrict: [
        { district: 'Guntur', demandRequests: 1800, suitableSupply: 640, gap: 1160, shortageAlert: true },
        { district: 'Krishna', demandRequests: 1420, suitableSupply: 890, gap: 530, shortageAlert: false },
        { district: 'Prakasam', demandRequests: 980, suitableSupply: 710, gap: 270, shortageAlert: false },
        { district: 'Vikarabad', demandRequests: 640, suitableSupply: 520, gap: 120, shortageAlert: false },
      ],
    };
  }

  async getSupplyAnalytics() {
    return {
      registeredFleet: {
        tractors: 3500,
        workers: 2800,
        sprayers: 1200,
        pumps: 650,
      },
      averageUtilizationRatePct: 70.0,
      resourceUtilizationSamples: [
        { resourceId: 'tr-001', resourceType: 'TRACTOR', availableHours: 120, bookedHours: 84, utilizationRatePct: 70.0, completedJobs: 18, rating: 4.8 },
        { resourceId: 'eq-001', resourceType: 'SPRAYER', availableHours: 90, bookedHours: 63, utilizationRatePct: 70.0, completedJobs: 14, rating: 4.8 },
      ],
    };
  }

  async getFarmerAnalytics(userId = 'usr-ravi-001') {
    return {
      userId,
      farmAreaAcres: 5.0,
      cropName: 'Cotton',
      season: 'Kharif 2026',
      activitiesSummary: {
        totalPlanned: 10,
        completed: 8,
        upcoming: 2,
        progressPct: 80.0,
      },
      resourceBookingsCount: 6,
      inputReservationsCount: 3,
      totalSpendingInr: 18400,
      averageCostPerAcreInr: 3680,
    };
  }

  async getProviderAnalytics(providerId = 'to-suresh-002') {
    return {
      providerId,
      allTimeJobsCompleted: 126,
      acceptanceRatePct: 82.0,
      completionRatePct: 96.0,
      noShowRatePct: 1.0,
      averageRating: 4.8,
      currentMonth: {
        jobsCompleted: 18,
        earningsInr: 38400,
        utilizationRatePct: 72.0,
      },
    };
  }

  async getSupplierAnalytics(supplierId = 'sup-001') {
    return {
      supplierId,
      storeName: 'ABC Agricultural Center',
      totalCatalogProducts: 124,
      lowStockAlertsCount: 8,
      enquiriesReceivedCount: 42,
      reservationsCreatedCount: 31,
      completedPickupsCount: 28,
      totalRevenueInr: 180000,
      topProducts: ['Urea 46% N', 'DAP (Di-Ammonium Phosphate)', 'Bt-Cotton Hybrid Seeds', 'Coragen Insecticide'],
    };
  }

  async getContractorAnalytics(contractorId = 'usr-ravi-001') {
    return {
      contractorId,
      activeProjectsCount: 3,
      assignedResources: { tractors: 12, workers: 18, equipment: 5 },
      completedBookingsCount: 42,
      overallProjectCompletionPct: 94.0,
      averageResourceFulfillmentRatePct: 91.0,
      totalProjectCostsInr: 142000,
    };
  }
}
