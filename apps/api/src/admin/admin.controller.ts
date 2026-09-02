import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  // Verifications
  @Get('verifications')
  async getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Post('verifications/:id/approve')
  async approveVerification(@Param('id') id: string) {
    return this.adminService.approveVerification(id);
  }

  @Post('verifications/:id/reject')
  async rejectVerification(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.rejectVerification(id, body?.reason);
  }

  // User Moderation & Suspensions
  @Post('users/:id/suspend')
  async suspendUser(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.suspendUser(id, body.reason);
  }

  @Post('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  // Audit Logs
  @Get('audit-logs')
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
