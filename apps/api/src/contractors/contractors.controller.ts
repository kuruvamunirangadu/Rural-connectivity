import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ContractorsService } from './contractors.service';

@Controller()
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get('contractors/me')
  async getProfile() {
    return this.contractorsService.getProfile();
  }

  @Patch('contractors/me')
  async updateProfile(@Body() body: any) {
    return this.contractorsService.updateProfile(body);
  }

  @Post('projects')
  async createProject(@Body() body: any) {
    return this.contractorsService.createProject(body);
  }

  @Get('projects/my')
  async getMyProjects() {
    return this.contractorsService.getMyProjects();
  }

  @Get('projects/:id')
  async getProjectById(@Param('id') id: string) {
    return this.contractorsService.getProjectById(id);
  }

  @Patch('projects/:id')
  async updateProject(@Param('id') id: string, @Body() body: any) {
    return this.contractorsService.updateProject(id, body);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return this.contractorsService.deleteProject(id);
  }

  @Post('projects/:id/complete')
  async completeProject(@Param('id') id: string) {
    return this.contractorsService.completeProject(id);
  }

  // Requirements
  @Post('projects/:id/requirements')
  async addRequirement(@Param('id') id: string, @Body() body: any) {
    return this.contractorsService.addRequirement(id, body);
  }

  @Get('projects/:id/requirements')
  async getRequirements(@Param('id') id: string) {
    return this.contractorsService.getRequirements(id);
  }

  @Patch('projects/:id/requirements/:reqId')
  async updateRequirement(
    @Param('id') id: string,
    @Param('reqId') reqId: string,
    @Body() body: any
  ) {
    return this.contractorsService.updateRequirement(id, reqId, body);
  }

  @Delete('projects/:id/requirements/:reqId')
  async deleteRequirement(
    @Param('id') id: string,
    @Param('reqId') reqId: string
  ) {
    return this.contractorsService.deleteRequirement(id, reqId);
  }

  // Matching
  @Get('projects/:id/requirements/:reqId/matches')
  async getRequirementMatches(
    @Param('id') id: string,
    @Param('reqId') reqId: string
  ) {
    return this.contractorsService.getRequirementMatches(id, reqId);
  }

  // Resource Assignments
  @Get('projects/:id/resources')
  async getProjectResources(@Param('id') id: string) {
    return this.contractorsService.getProjectResources(id);
  }

  @Post('projects/:id/resources')
  async assignResources(@Param('id') id: string, @Body() body: any) {
    return this.contractorsService.assignResources(id, body);
  }

  @Delete('projects/:id/resources/:assignmentId')
  async removeAssignment(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string
  ) {
    return this.contractorsService.removeAssignment(id, assignmentId);
  }

  // Progress
  @Get('projects/:id/progress')
  async getProjectProgress(@Param('id') id: string) {
    return this.contractorsService.getProjectProgress(id);
  }
}
