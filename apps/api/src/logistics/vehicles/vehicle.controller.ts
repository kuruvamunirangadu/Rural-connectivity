import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller('logistics/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  listVehicles(
    @Query('ownerId') ownerId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('status') status?: string,
    @Query('minCapacity') minCapacity?: string
  ) {
    return this.vehicleService.listVehicles({
      ownerId,
      organizationId,
      vehicleType,
      status,
      minCapacity: minCapacity ? Number(minCapacity) : undefined,
    });
  }

  @Get(':id')
  getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicle(id);
  }

  @Post()
  registerVehicle(@Body() body: any) {
    return this.vehicleService.registerVehicle(body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED'
  ) {
    return this.vehicleService.updateVehicleStatus(id, status);
  }

  @Post(':id/assign-driver')
  assignDriver(
    @Param('id') id: string,
    @Body() body: { driverId: string; driverName: string }
  ) {
    return this.vehicleService.assignDriver(id, body.driverId, body.driverName);
  }
}
