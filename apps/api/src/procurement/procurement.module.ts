import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { SupplierQuoteService } from './quote.service';
import { ProcurementController } from './procurement.controller';

@Module({
  controllers: [ProcurementController],
  providers: [ProcurementService, SupplierQuoteService],
  exports: [ProcurementService, SupplierQuoteService],
})
export class ProcurementModule {}
