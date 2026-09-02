import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { WorkersService } from './workers.service';

@Controller()
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get('workers/me')
  async getMyProfile() {
    return this.workersService.getProfile();
  }

  @Patch('workers/me')
  async updateMyProfile(@Body() body: any) {
    return this.workersService.updateProfile(body);
  }

  @Post('workers/me/skills')
  async addSkill(@Body() body: { skillCode: string; experienceYears?: number }) {
    return this.workersService.addSkill(body);
  }

  @Get('workers/me/skills')
  async getMySkills() {
    return this.workersService.getSkills();
  }

  @Delete('workers/me/skills/:id')
  async removeSkill(@Param('id') id: string) {
    return this.workersService.removeSkill(id);
  }

  @Get('skills')
  async getAllSkills() {
    return this.workersService.getAllSkills();
  }

  @Get('skills/:id')
  async getSkillById(@Param('id') id: string) {
    return this.workersService.getSkillById(id);
  }
}
