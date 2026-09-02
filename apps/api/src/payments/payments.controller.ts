import { Controller, Get, Post, Body, Param, Headers, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  async createPaymentIntent(
    @Body() body: any,
    @Headers('idempotency-key') idempotencyKeyHeader?: string
  ) {
    const key = body.idempotencyKey || idempotencyKeyHeader || `idemp-${Date.now()}`;
    return this.paymentsService.createPaymentIntent({
      ...body,
      idempotencyKey: key,
    });
  }

  @Post(':id/verify')
  async verifyPayment(@Param('id') id: string) {
    return this.paymentsService.verifyPayment(id);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(body);
  }

  @Post(':id/refund')
  async processRefund(@Param('id') id: string, @Body() body: { amount?: number; reason?: string }) {
    return this.paymentsService.processRefund(id, body?.amount, body?.reason);
  }

  @Get()
  async getPayments(@Query('bookingId') bookingId?: string) {
    return this.paymentsService.getPayments(bookingId);
  }
}
