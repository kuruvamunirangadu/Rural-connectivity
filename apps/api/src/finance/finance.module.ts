import { Module, Global } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { LedgerService } from './ledger.service';
import { SettlementService } from './settlement.service';

@Global()
@Module({
  controllers: [FinanceController],
  providers: [LedgerService, SettlementService],
  exports: [LedgerService, SettlementService],
})
export class FinanceModule {}
