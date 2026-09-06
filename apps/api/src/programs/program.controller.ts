import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramParticipantService } from './participant.service';
import { ProgramLocationService } from './location.service';

@Controller('programs')
export class ProgramController {
  constructor(
    private readonly programService: ProgramService,
    private readonly participantService: ProgramParticipantService,
    private readonly locationService: ProgramLocationService
  ) {}

  @Get()
  listPrograms(
    @Query('organizationId') organizationId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string
  ) {
    return this.programService.listPrograms({ organizationId, status, type });
  }

  @Get(':id')
  getProgram(@Param('id') id: string) {
    return this.programService.getProgram(id);
  }

  @Post()
  createProgram(@Body() body: any) {
    return this.programService.createProgram(body);
  }

  @Get(':id/participants')
  listParticipants(@Param('id') id: string) {
    return this.participantService.listParticipants(id);
  }

  @Post(':id/participants')
  enrollParticipant(@Param('id') id: string, @Body() body: any) {
    return this.participantService.enrollParticipant(id, body);
  }

  @Patch(':id/participants/:participantId/status')
  updateParticipantStatus(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
    @Body('status') status: 'enrolled' | 'approved' | 'rejected' | 'disbursed',
    @Body('subsidyClaimed') subsidyClaimed?: number
  ) {
    return this.participantService.updateStatus(id, participantId, status, subsidyClaimed);
  }

  @Get(':id/locations')
  listLocations(@Param('id') id: string) {
    return this.locationService.getLocationsByProgram(id);
  }

  @Post(':id/locations')
  addLocation(@Param('id') id: string, @Body() body: any) {
    return this.locationService.addLocation(id, body);
  }

  @Get(':id/metrics')
  getProgramMetrics(@Param('id') id: string) {
    return this.programService.getProgramMetrics(id);
  }
}

