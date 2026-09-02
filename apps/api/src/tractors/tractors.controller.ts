import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TractorsService } from './tractors.service';

@Controller()
export class TractorsController {
  constructor(private readonly tractorsService: TractorsService) {}

  @Get('tractor-owners/me')
  async getOwnerProfile() {
    return this.tractorsService.getOwnerProfile();
  }

  @Patch('tractor-owners/me')
  async updateOwnerProfile(@Body() body: any) {
    return this.tractorsService.updateOwnerProfile(body);
  }

  @Post('tractors')
  async registerTractor(@Body() body: any) {
    return this.tractorsService.createTractor(body);
  }

  @Get('tractors/my')
  async getMyTractors() {
    return this.tractorsService.getMyTractors();
  }

  @Get('tractors/:id')
  async getTractorById(@Param('id') id: string) {
    return this.tractorsService.getTractorById(id);
  }

  @Patch('tractors/:id')
  async updateTractor(@Param('id') id: string, @Body() body: any) {
    return this.tractorsService.updateTractor(id, body);
  }

  @Delete('tractors/:id')
  async deleteTractor(@Param('id') id: string) {
    return this.tractorsService.deleteTractor(id);
  }

  @Post('tractors/:id/attachments')
  async addAttachment(@Param('id') id: string, @Body() body: any) {
    return this.tractorsService.addAttachment(id, body);
  }

  @Get('tractors/:id/attachments')
  async getAttachments(@Param('id') id: string) {
    return this.tractorsService.getAttachments(id);
  }

  @Delete('tractors/:id/attachments/:attachmentId')
  async deleteAttachment(@Param('id') id: string, @Param('attachmentId') attachmentId: string) {
    return this.tractorsService.deleteAttachment(id, attachmentId);
  }
}
