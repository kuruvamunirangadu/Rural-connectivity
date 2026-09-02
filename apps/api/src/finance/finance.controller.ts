import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { SettlementService } from './settlement.service';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly settlementService: SettlementService
  ) {}

  @Get('ledger/transactions')
  async getTransactions() {
    return this.ledgerService.getTransactions();
  }

  @Get('ledger/entries')
  async getLedgerEntries() {
    return this.ledgerService.getLedgerEntries();
  }

  @Get('earnings/me')
  async getMyEarnings(@Query('providerId') providerId?: string) {
    return this.ledgerService.getProviderEarnings(providerId || 'to-suresh-002');
  }

  @Get('settlements')
  async getSettlements(@Query('providerId') providerId?: string) {
    return this.settlementService.getSettlements(providerId);
  }

  @Post('settlements/:bookingId/eligible')
  async markSettlementEligible(@Param('bookingId') bookingId: string) {
    return this.settlementService.markEligibleForSettlement(bookingId);
  }

  @Post('admin/settlements/:id/process')
  async processSettlement(
    @Param('id') id: string,
    @Body() body: { bankReference?: string }
  ) {
    return this.settlementService.processSettlement(id, body?.bankReference);
  }

  @Post('admin/settlements/:bookingId/hold')
  async holdSettlement(
    @Param('bookingId') bookingId: string,
    @Body() body: { reason: string }
  ) {
    return this.settlementService.putOnHold(bookingId, body.reason);
  }
}
