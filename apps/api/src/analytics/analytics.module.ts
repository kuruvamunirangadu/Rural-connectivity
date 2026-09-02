import { Module, Global } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEventService } from './analytics-event.service';

@Global()
@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsEventService],
  exports: [AnalyticsService, AnalyticsEventService],
})
export class AnalyticsModule {}
