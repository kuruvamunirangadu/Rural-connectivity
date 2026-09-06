import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { OrganizationService, BulkWorkRequestDto } from './organization.service';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationPermissionService, OrgRole } from './organization-permission.service';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly orgService: OrganizationService,
    private readonly memberService: OrganizationMemberService,
    private readonly permissionService: OrganizationPermissionService
  ) {}

  @Get()
  listOrganizations(@Query('type') type?: string, @Query('district') district?: string) {
    return this.orgService.listOrganizations({ type, district });
  }

  @Get(':id')
  getOrganization(@Param('id') id: string) {
    return this.orgService.getOrganization(id);
  }

  @Post()
  createOrganization(@Body() body: any) {
    return this.orgService.createOrganization(body);
  }

  @Get(':id/members')
  listMembers(@Param('id') id: string) {
    return this.memberService.listMembers(id);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() body: any) {
    return this.memberService.addMember(id, body);
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: OrgRole
  ) {
    return this.memberService.updateMemberRole(id, memberId, role);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.memberService.removeMember(id, memberId);
  }

  @Get(':id/farms')
  listFarms(@Param('id') id: string) {
    return this.orgService.listFarms(id);
  }

  @Post(':id/farms')
  attachFarm(@Param('id') id: string, @Body() body: any) {
    return this.orgService.attachFarm(id, body);
  }

  @Post(':id/bulk-work')
  createBulkWorkProject(@Param('id') id: string, @Body() body: BulkWorkRequestDto) {
    return this.orgService.createBulkWorkProject({ ...body, organizationId: id });
  }

  @Get(':id/analytics')
  getAnalytics(@Param('id') id: string) {
    return this.orgService.getAnalytics(id);
  }

  @Get('permissions/roles')
  getAllRolePermissions() {
    const roles: OrgRole[] = ['ADMIN', 'MANAGER', 'FIELD_OFFICER', 'MEMBER', 'OBSERVER'];
    return roles.map((role) => ({
      role,
      permissions: this.permissionService.getPermissionsForRole(role),
    }));
  }
}

