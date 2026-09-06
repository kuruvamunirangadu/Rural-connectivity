import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller('logistics/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  listDrivers(
    @Query('status') status?: string,
    @Query('licenseType') licenseType?: string,
    @Query('verifiedOnly') verifiedOnly?: string
  ) {
    return this.driverService.listDrivers({
      status,
      licenseType,
      verifiedOnly: verifiedOnly === 'true',
    });
  }

  @Get(':id')
  getDriver(@Param('id') id: string) {
    return this.driverService.getDriver(id);
  }

  @Post()
  registerDriver(@Body() body: any) {
    return this.driverService.registerDriver(body);
  }

  @Get(':id/eligibility')
  checkEligibility(@Param('id') id: string) {
    return this.driverService.isDriverEligible(id);
  }
}

