import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile() {
    return this.usersService.getMe();
  }

  @Patch('me')
  async updateProfile(@Body() body: any) {
    return this.usersService.updateMe(body);
  }

  @Get('me/roles')
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Post('me/roles')
  async addRole(@Body() body: { role: string }) {
    return this.usersService.addRole(body.role);
  }

  @Delete('me/roles/:role')
  async removeRole(@Param('role') role: string) {
    return this.usersService.removeRole(role);
  }

  @Post('me/switch-role')
  async switchRole(@Body() body: { role: string }) {
    return this.usersService.switchRole(body.role);
  }
}
