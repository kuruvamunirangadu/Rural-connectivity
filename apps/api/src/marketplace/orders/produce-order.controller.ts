import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProduceOrderService } from './produce-order.service';

@Controller('produce-orders')
export class ProduceOrderController {
  constructor(private readonly orderService: ProduceOrderService) {}

  @Get()
  listOrders(
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('listingId') listingId?: string
  ) {
    return this.orderService.listOrders({ buyerId, sellerId, status, listingId });
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Post('from-offer')
  createFromOffer(@Body() body: { offerId: string }) {
    return this.orderService.createOrderFromOffer(body.offerId);
  }

  @Post('direct')
  createDirectOrder(@Body() body: any) {
    return this.orderService.createDirectOrder(body);
  }

  @Post(':id/confirm')
  confirmOrder(@Param('id') id: string) {
    return this.orderService.confirmOrder(id);
  }

  @Post(':id/dispatch')
  dispatchOrder(@Param('id') id: string, @Body() body: { transportRequestId?: string }) {
    return this.orderService.dispatchOrder(id, body?.transportRequestId);
  }

  @Post(':id/deliver')
  deliverOrder(@Param('id') id: string) {
    return this.orderService.deliverOrder(id);
  }

  @Post(':id/settle')
  settleOrder(@Param('id') id: string) {
    return this.orderService.settleOrder(id);
  }

  @Post(':id/cancel')
  cancelOrder(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.orderService.cancelOrder(id, body?.reason);
  }

  @Post(':id/dispute')
  disputeOrder(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.orderService.disputeOrder(id, body.reason);
  }
}
