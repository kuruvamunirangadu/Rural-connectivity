import { Controller, Get, Param } from '@nestjs/common';
import { FinancialSummaryService } from './financial-summary.service';

@Controller('financial/summary')
export class FinancialSummaryController {
  constructor(private readonly summaryService: FinancialSummaryService) {}

  @Get(':userId')
  getSummary(@Param('userId') userId: string) {
    return this.summaryService.getSummary(userId);
  }
}
