import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('operations')
export class OperationsController {
  constructor(private readonly alertService: AlertService) {}

  @Get('alerts')
  async getAlerts(@Query('status') status?: 'OPEN' | 'RESOLVED') {
    return this.alertService.getAlerts(status);
  }

  @Post('alerts/:id/resolve')
  async resolveAlert(@Param('id') id: string) {
    return this.alertService.resolveAlert(id);
  }
}
