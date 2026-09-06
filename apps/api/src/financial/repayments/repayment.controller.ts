import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RepaymentService } from './repayment.service';

@Controller('financial/repayments')
export class RepaymentController {
  constructor(private readonly repaymentService: RepaymentService) {}

  @Get(':applicationId')
  listRepayments(@Param('applicationId') applicationId: string) {
    return this.repaymentService.listRepayments(applicationId);
  }

  @Post(':id/pay')
  recordPayment(
    @Param('id') id: string,
    @Body() body: { externalReference?: string }
  ) {
    return this.repaymentService.recordPayment(id, body?.externalReference);
  }
}
