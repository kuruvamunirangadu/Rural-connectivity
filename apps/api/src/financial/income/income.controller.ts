import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IncomeService } from './income.service';

@Controller('financial/income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get(':userId')
  listIncome(
    @Param('userId') userId: string,
    @Query('sourceType') sourceType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.incomeService.listIncome(userId, { sourceType, fromDate, toDate });
  }

  @Post()
  recordIncome(
    @Body()
    body: {
      userId: string;
      sourceType: 'PRODUCE_SALE' | 'SERVICE_EARNING' | 'CONTRACTOR_REVENUE' | 'SUPPLIER_SALE' | 'OTHER';
      referenceType?: string;
      referenceId?: string;
      amount: number;
      currency?: string;
      description?: string;
    }
  ) {
    return this.incomeService.recordIncome(body);
  }
}
