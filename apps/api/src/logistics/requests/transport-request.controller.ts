import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransportRequestService } from './transport-request.service';

@Controller('logistics/requests')
export class TransportRequestController {
  constructor(private readonly requestService: TransportRequestService) {}

  @Get()
  listRequests(
    @Query('createdById') createdById?: string,
    @Query('organizationId') organizationId?: string,
    @Query('status') status?: string,
    @Query('requestType') requestType?: string
  ) {
    return this.requestService.listRequests({
      createdById,
      organizationId,
      status,
      requestType,
    });
  }

  @Get(':id')
  getRequest(@Param('id') id: string) {
    return this.requestService.getRequest(id);
  }

  @Post()
  createRequest(@Body() body: any) {
    return this.requestService.createRequest(body);
  }
}
