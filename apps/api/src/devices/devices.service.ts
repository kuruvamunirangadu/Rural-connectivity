import { Injectable, BadRequestException } from '@nestjs/common';

export interface UserDevice {
  id: string;
  userId: string;
  deviceType: 'ANDROID' | 'IOS' | 'WEB';
  pushToken: string;
  isActive: boolean;
  lastSeenAt: string;
}

@Injectable()
export class DevicesService {
  private devices: UserDevice[] = [
    {
      id: 'dev-001',
      userId: 'usr-ravi-001',
      deviceType: 'ANDROID',
      pushToken: 'fcm_token_ravi_android_9981',
      isActive: true,
      lastSeenAt: new Date().toISOString(),
    },
  ];

  async registerDevice(dto: { userId: string; deviceType: 'ANDROID' | 'IOS' | 'WEB'; pushToken: string }): Promise<UserDevice> {
    if (!dto.pushToken) {
      throw new BadRequestException('pushToken is required to register a user device');
    }

    let dev = this.devices.find((d) => d.pushToken === dto.pushToken);
    if (dev) {
      dev.userId = dto.userId;
      dev.isActive = true;
      dev.lastSeenAt = new Date().toISOString();
    } else {
      dev = {
        id: `dev-${Date.now()}`,
        userId: dto.userId,
        deviceType: dto.deviceType || 'ANDROID',
        pushToken: dto.pushToken,
        isActive: true,
        lastSeenAt: new Date().toISOString(),
      };
      this.devices.push(dev);
    }

    return dev;
  }

  async deactivateDevice(pushToken: string): Promise<{ success: boolean }> {
    const dev = this.devices.find((d) => d.pushToken === pushToken);
    if (dev) {
      dev.isActive = false;
    }
    return { success: true };
  }

  async getActiveDevicesForUser(userId: string): Promise<UserDevice[]> {
    return this.devices.filter((d) => d.userId === userId && d.isActive);
  }
}
