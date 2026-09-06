import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';

@Controller('produce-fulfillments')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Get()
  listFulfillments(@Query('orderId') orderId?: string, @Query('status') status?: string) {
    return this.fulfillmentService.listFulfillments({ orderId, status });
  }

  @Get(':id')
  getFulfillment(@Param('id') id: string) {
    return this.fulfillmentService.getFulfillment(id);
  }

  @Post()
  createFulfillment(@Body() body: any) {
    return this.fulfillmentService.createFulfillment(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: any; notes?: string }) {
    return this.fulfillmentService.updateFulfillmentStatus(id, body.status, body.notes);
  }

  @Post(':id/confirm-delivery')
  confirmDelivery(@Param('id') id: string, @Body() body: { signoff: string }) {
    return this.fulfillmentService.confirmDelivery(id, body.signoff);
  }
}
