import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { EquipmentService } from './equipment.service';

@Controller()
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('equipment-owners/me')
  async getOwnerProfile() {
    return this.equipmentService.getOwnerProfile();
  }

  @Patch('equipment-owners/me')
  async updateOwnerProfile(@Body() body: any) {
    return this.equipmentService.updateOwnerProfile(body);
  }

  @Post('equipment')
  async registerEquipment(@Body() body: any) {
    return this.equipmentService.createEquipment(body);
  }

  @Get('equipment/my')
  async getMyEquipment() {
    return this.equipmentService.getMyEquipment();
  }

  @Get('equipment/:id')
  async getEquipmentById(@Param('id') id: string) {
    return this.equipmentService.getEquipmentById(id);
  }

  @Patch('equipment/:id')
  async updateEquipment(@Param('id') id: string, @Body() body: any) {
    return this.equipmentService.updateEquipment(id, body);
  }

  @Delete('equipment/:id')
  async deleteEquipment(@Param('id') id: string) {
    return this.equipmentService.deleteEquipment(id);
  }
}
