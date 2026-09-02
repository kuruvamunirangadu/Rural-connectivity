import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async createQuote(@Body() body: any) {
    return this.quotesService.createQuote(body);
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string) {
    return this.quotesService.getQuoteById(id);
  }

  @Post(':id/accept')
  async acceptQuote(@Param('id') id: string) {
    return this.quotesService.acceptQuote(id);
  }

  @Post(':id/reject')
  async rejectQuote(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.quotesService.rejectQuote(id, body?.reason);
  }
}
