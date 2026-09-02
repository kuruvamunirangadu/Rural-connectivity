import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate')
  async generateInvoice(@Body() body: any) {
    return this.invoicesService.generateInvoice(body);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.getInvoiceById(id);
  }

  @Get('booking/:bookingId')
  async getInvoiceByBooking(@Param('bookingId') bookingId: string) {
    return this.invoicesService.getInvoiceByBooking(bookingId);
  }
}
