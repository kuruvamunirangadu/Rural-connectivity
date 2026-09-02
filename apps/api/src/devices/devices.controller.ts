import { Controller, Post, Body } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  async registerDevice(@Body() body: { userId: string; deviceType: 'ANDROID' | 'IOS' | 'WEB'; pushToken: string }) {
    return this.devicesService.registerDevice(body);
  }

  @Post('deactivate')
  async deactivateDevice(@Body() body: { pushToken: string }) {
    return this.devicesService.deactivateDevice(body.pushToken);
  }
}
