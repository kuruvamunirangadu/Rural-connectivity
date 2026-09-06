import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { SupplierQuoteService } from './quote.service';

@Controller('procurements')
export class ProcurementController {
  constructor(
    private readonly procurementService: ProcurementService,
    private readonly quoteService: SupplierQuoteService
  ) {}

  @Get()
  listProcurements(
    @Query('organizationId') organizationId?: string,
    @Query('status') status?: string
  ) {
    return this.procurementService.listProcurements({ organizationId, status });
  }

  @Get(':id')
  getProcurement(@Param('id') id: string) {
    return this.procurementService.getProcurement(id);
  }

  @Post()
  createProcurement(@Body() body: any) {
    return this.procurementService.createProcurement(body);
  }

  @Get(':id/quotes')
  listQuotes(@Param('id') id: string) {
    return this.quoteService.listQuotes(id);
  }

  @Post(':id/quotes')
  submitQuote(@Param('id') id: string, @Body() body: any) {
    return this.quoteService.submitQuote({ ...body, procurementId: id });
  }

  @Post(':id/quotes/:quoteId/accept')
  acceptQuote(@Param('id') id: string, @Param('quoteId') quoteId: string) {
    return this.procurementService.awardProcurement(id, quoteId);
  }
}

