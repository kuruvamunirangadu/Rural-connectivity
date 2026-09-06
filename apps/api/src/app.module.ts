import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmersModule } from './farmers/farmers.module';
import { TractorsModule } from './tractors/tractors.module';
import { WorkersModule } from './workers/workers.module';
import { EquipmentModule } from './equipment/equipment.module';
import { AvailabilityModule } from './availability/availability.module';
import { WorkRequestsModule } from './work-requests/work-requests.module';
import { WorkOffersModule } from './work-offers/work-offers.module';
import { MatchingModule } from './matching/matching.module';
import { BookingsModule } from './bookings/bookings.module';
import { RatingsModule } from './ratings/ratings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContractorsModule } from './contractors/contractors.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { LocationsModule } from './locations/locations.module';
import { AdminModule } from './admin/admin.module';
import { FarmPlansModule } from './farm-plans/farm-plans.module';
import { GeoModule } from './geo/geo.module';
import { VerificationModule } from './verification/verification.module';
import { TrustModule } from './trust/trust.module';
import { ReportsModule } from './reports/reports.module';
import { PricingModule } from './pricing/pricing.module';
import { QuotesModule } from './quotes/quotes.module';
import { PaymentsModule } from './payments/payments.module';
import { FinanceModule } from './finance/finance.module';
import { InvoicesModule } from './invoices/invoices.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { RemindersModule } from './reminders/reminders.module';
import { DevicesModule } from './devices/devices.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OperationsModule } from './operations/operations.module';
import { AIModule } from './ai/ai.module';
import { OrganizationModule } from './organizations/organization.module';
import { ProgramModule } from './programs/program.module';
import { ProcurementModule } from './procurement/procurement.module';
import { BuyerModule } from './buyers/buyer.module';
import { LogisticsModule } from './logistics/logistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    EventsModule,
    GeoModule,
    VerificationModule,
    TrustModule,
    ReportsModule,
    PricingModule,
    QuotesModule,
    PaymentsModule,
    FinanceModule,
    InvoicesModule,
    NotificationsModule,
    ChatModule,
    RemindersModule,
    DevicesModule,
    AnalyticsModule,
    OperationsModule,
    AIModule,
    OrganizationModule,
    ProgramModule,
    ProcurementModule,
    BuyerModule,
    LogisticsModule,
    AuthModule,
    UsersModule,
    FarmersModule,
    TractorsModule,
    WorkersModule,
    EquipmentModule,
    AvailabilityModule,
    WorkRequestsModule,
    WorkOffersModule,
    MatchingModule,
    BookingsModule,
    RatingsModule,
    ContractorsModule,
    SuppliersModule,
    LocationsModule,
    AdminModule,
    FarmPlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
