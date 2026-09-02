import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WorkRequestsService } from './work-requests.service';

@Controller('work-requests')
export class WorkRequestsController {
  constructor(private readonly workRequestsService: WorkRequestsService) {}

  @Post()
  async createWorkRequest(@Body() body: any) {
    return this.workRequestsService.create(body);
  }

  @Get('my')
  async getMyWorkRequests() {
    return this.workRequestsService.getMyRequests();
  }

  @Get(':id')
  async getWorkRequestById(@Param('id') id: string) {
    return this.workRequestsService.getById(id);
  }

  @Get(':id/matches')
  async getMatchesForRequest(@Param('id') id: string, @Query('radiusKm') radiusKm?: number) {
    return this.workRequestsService.getMatches(id, radiusKm ? Number(radiusKm) : 15);
  }

  @Post(':id/offer')
  async offerRequestToOwner(@Param('id') id: string, @Body() body: { tractorId: string; ownerId: string }) {
    return this.workRequestsService.offerToOwner(id, body.tractorId, body.ownerId);
  }

  @Post(':id/accept')
  async acceptRequest(@Param('id') id: string) {
    return this.workRequestsService.updateStatus(id, 'ACCEPTED');
  }

  @Post(':id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.workRequestsService.updateStatus(id, 'REJECTED');
  }
}
