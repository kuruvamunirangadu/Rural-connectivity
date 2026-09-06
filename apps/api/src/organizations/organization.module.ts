import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationPermissionService } from './organization-permission.service';
import { OrganizationController } from './organization.controller';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationMemberService, OrganizationPermissionService],
  exports: [OrganizationService, OrganizationMemberService, OrganizationPermissionService],
})
export class OrganizationModule {}

