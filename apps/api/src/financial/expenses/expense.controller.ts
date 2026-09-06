import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('financial/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get(':userId')
  listExpenses(
    @Param('userId') userId: string,
    @Query('category') category?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.expenseService.listExpenses(userId, { category, fromDate, toDate });
  }

  @Post()
  recordExpense(
    @Body()
    body: {
      userId: string;
      category: 'TRACTOR_SERVICE' | 'WORKER_SERVICE' | 'INPUT_PURCHASE' | 'TRANSPORT' | 'EQUIPMENT' | 'OTHER';
      referenceType?: string;
      referenceId?: string;
      amount: number;
      currency?: string;
      description?: string;
    }
  ) {
    return this.expenseService.recordExpense(body);
  }
}
