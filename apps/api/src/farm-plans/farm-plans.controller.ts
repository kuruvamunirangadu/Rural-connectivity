import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { FarmPlansService } from './farm-plans.service';

@Controller()
export class FarmPlansController {
  constructor(private readonly farmPlansService: FarmPlansService) {}

  // 1. Crop Seasons
  @Post('crop-seasons')
  async createSeason(@Body() body: any) {
    return this.farmPlansService.createSeason(body);
  }

  @Get('crop-seasons')
  async getSeasons() {
    return this.farmPlansService.getSeasons();
  }

  @Get('crop-seasons/:id')
  async getSeasonById(@Param('id') id: string) {
    return this.farmPlansService.getSeasonById(id);
  }

  @Patch('crop-seasons/:id')
  async updateSeason(@Param('id') id: string, @Body() body: any) {
    return this.farmPlansService.updateSeason(id, body);
  }

  @Delete('crop-seasons/:id')
  async deleteSeason(@Param('id') id: string) {
    return this.farmPlansService.deleteSeason(id);
  }

  // 2. Farm Crops
  @Post('farms/:farmId/crops')
  async addFarmCrop(@Param('farmId') farmId: string, @Body() body: any) {
    return this.farmPlansService.addFarmCrop(farmId, body);
  }

  @Get('farms/:farmId/crops')
  async getFarmCrops(@Param('farmId') farmId: string) {
    return this.farmPlansService.getFarmCrops(farmId);
  }

  @Get('farm-crops/:id')
  async getFarmCropById(@Param('id') id: string) {
    return this.farmPlansService.getFarmCropById(id);
  }

  @Patch('farm-crops/:id')
  async updateFarmCrop(@Param('id') id: string, @Body() body: any) {
    return this.farmPlansService.updateFarmCrop(id, body);
  }

  @Delete('farm-crops/:id')
  async deleteFarmCrop(@Param('id') id: string) {
    return this.farmPlansService.deleteFarmCrop(id);
  }

  // 3. Farm Plans
  @Post('farm-plans')
  async createPlan(@Body() body: any) {
    return this.farmPlansService.createPlan(body);
  }

  @Get('farm-plans')
  async getPlans(@Query('farmId') farmId?: string) {
    return this.farmPlansService.getPlans(farmId);
  }

  @Get('farm-plans/:id')
  async getPlanById(@Param('id') id: string) {
    return this.farmPlansService.getPlanById(id);
  }

  @Patch('farm-plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: any) {
    return this.farmPlansService.updatePlan(id, body);
  }

  @Delete('farm-plans/:id')
  async deletePlan(@Param('id') id: string) {
    return this.farmPlansService.deletePlan(id);
  }

  @Post('farm-plans/:id/generate-activities')
  async generateActivities(
    @Param('id') planId: string,
    @Body() body: { farmCropId: string }
  ) {
    return this.farmPlansService.generateActivitiesFromTemplates(planId, body.farmCropId);
  }

  @Get('farm-plans/:id/timeline')
  async getPlanTimeline(@Param('id') planId: string) {
    return this.farmPlansService.getPlanTimeline(planId);
  }

  // 4. Activity Templates
  @Get('activity-templates')
  async getTemplates(@Query('cropName') cropName?: string) {
    return this.farmPlansService.getTemplates(cropName);
  }

  @Get('activity-templates/:id')
  async getTemplateById(@Param('id') id: string) {
    return this.farmPlansService.getTemplateById(id);
  }

  @Post('admin/activity-templates')
  async createTemplate(@Body() body: any) {
    return this.farmPlansService.createTemplate(body);
  }

  // 5. Farm Activities & Requirements
  @Post('farm-plans/:planId/activities')
  async createActivity(@Param('planId') planId: string, @Body() body: any) {
    return this.farmPlansService.createActivity(planId, body);
  }

  @Get('farm-plans/:planId/activities')
  async getActivities(@Param('planId') planId: string) {
    return this.farmPlansService.getActivities(planId);
  }

  @Get('farm-activities/:id')
  async getActivityById(@Param('id') id: string) {
    return this.farmPlansService.getActivityById(id);
  }

  @Patch('farm-activities/:id')
  async updateActivity(@Param('id') id: string, @Body() body: any) {
    return this.farmPlansService.updateActivity(id, body);
  }

  @Delete('farm-activities/:id')
  async deleteActivity(@Param('id') id: string) {
    return this.farmPlansService.deleteActivity(id);
  }

  @Post('farm-activities/:id/create-work-requests')
  async createWorkRequestsForActivity(@Param('id') activityId: string) {
    return this.farmPlansService.createWorkRequestsForActivity(activityId);
  }
}
