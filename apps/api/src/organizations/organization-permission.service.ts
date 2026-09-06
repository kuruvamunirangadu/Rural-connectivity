import { Injectable } from '@nestjs/common';

export type OrgRole = 'ADMIN' | 'MANAGER' | 'FIELD_OFFICER' | 'MEMBER' | 'OBSERVER';

export interface OrgPermissionCheck {
  canManageMembers: boolean;
  canCreateBulkWork: boolean;
  canProcureInputs: boolean;
  canPublishProduce: boolean;
  canApproveSubsidies: boolean;
  canViewFinancials: boolean;
}

@Injectable()
export class OrganizationPermissionService {
  getPermissionsForRole(role: OrgRole): OrgPermissionCheck {
    switch (role) {
      case 'ADMIN':
        return {
          canManageMembers: true,
          canCreateBulkWork: true,
          canProcureInputs: true,
          canPublishProduce: true,
          canApproveSubsidies: true,
          canViewFinancials: true,
        };
      case 'MANAGER':
        return {
          canManageMembers: true,
          canCreateBulkWork: true,
          canProcureInputs: true,
          canPublishProduce: true,
          canApproveSubsidies: false,
          canViewFinancials: true,
        };
      case 'FIELD_OFFICER':
        return {
          canManageMembers: false,
          canCreateBulkWork: true,
          canProcureInputs: false,
          canPublishProduce: true,
          canApproveSubsidies: false,
          canViewFinancials: false,
        };
      case 'MEMBER':
        return {
          canManageMembers: false,
          canCreateBulkWork: false,
          canProcureInputs: false,
          canPublishProduce: false,
          canApproveSubsidies: false,
          canViewFinancials: false,
        };
      case 'OBSERVER':
      default:
        return {
          canManageMembers: false,
          canCreateBulkWork: false,
          canProcureInputs: false,
          canPublishProduce: false,
          canApproveSubsidies: false,
          canViewFinancials: false,
        };
    }
  }

  canPerform(role: OrgRole, action: keyof OrgPermissionCheck): boolean {
    const perms = this.getPermissionsForRole(role);
    return perms[action] ?? false;
  }
}
