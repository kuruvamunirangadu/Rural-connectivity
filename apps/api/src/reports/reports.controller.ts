import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('reports')
  async submitReport(@Body() body: any) {
    return this.reportsService.createReport(body);
  }

  @Get('reports/me')
  async getMyReports() {
    return this.reportsService.getMyReports();
  }

  @Get('admin/reports')
  async getAdminReports() {
    return this.reportsService.getAllReports();
  }

  @Post('admin/reports/:id/resolve')
  async resolveReport(
    @Param('id') id: string,
    @Body() body: { resolution: string; actionTaken?: string }
  ) {
    return this.reportsService.resolveReport(id, body.resolution, body.actionTaken);
  }
}
