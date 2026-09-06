import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrgRole } from './organization-permission.service';

export interface OrgMemberItem {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userPhone: string;
  role: OrgRole;
  status: 'active' | 'inactive' | 'pending_approval';
  joinedAt: string;
  farmCount: number;
  totalAcreage: number;
}

@Injectable()
export class OrganizationMemberService {
  private members: OrgMemberItem[] = [
    {
      id: 'mem-001',
      organizationId: 'org-kalyan-fpo',
      userId: 'usr-ramesh-001',
      userName: 'Ramesh Reddy',
      userPhone: '+91 98765 43210',
      role: 'ADMIN',
      status: 'active',
      joinedAt: '2026-01-15T09:00:00Z',
      farmCount: 2,
      totalAcreage: 8.5,
    },
    {
      id: 'mem-002',
      organizationId: 'org-kalyan-fpo',
      userId: 'usr-suresh-002',
      userName: 'Suresh Gowd',
      userPhone: '+91 98765 43211',
      role: 'MANAGER',
      status: 'active',
      joinedAt: '2026-01-20T10:30:00Z',
      farmCount: 1,
      totalAcreage: 5.0,
    },
    {
      id: 'mem-003',
      organizationId: 'org-kalyan-fpo',
      userId: 'usr-naresh-003',
      userName: 'Naresh Kumar',
      userPhone: '+91 98765 43212',
      role: 'FIELD_OFFICER',
      status: 'active',
      joinedAt: '2026-02-01T11:00:00Z',
      farmCount: 1,
      totalAcreage: 4.2,
    },
    {
      id: 'mem-004',
      organizationId: 'org-kalyan-fpo',
      userId: 'usr-venkat-004',
      userName: 'Venkat Rao',
      userPhone: '+91 98765 43213',
      role: 'MEMBER',
      status: 'active',
      joinedAt: '2026-02-10T14:15:00Z',
      farmCount: 3,
      totalAcreage: 12.0,
    },
    {
      id: 'mem-005',
      organizationId: 'org-kalyan-fpo',
      userId: 'usr-laxmi-005',
      userName: 'Laxmi Devi',
      userPhone: '+91 98765 43214',
      role: 'MEMBER',
      status: 'active',
      joinedAt: '2026-02-15T16:00:00Z',
      farmCount: 1,
      totalAcreage: 3.5,
    },
    // Govt Org Officers
    {
      id: 'mem-006',
      organizationId: 'org-dept-agri-ts',
      userId: 'usr-gov-officer-01',
      userName: 'Dr. K. Sastry (Joint Director Agri)',
      userPhone: '+91 98765 43220',
      role: 'ADMIN',
      status: 'active',
      joinedAt: '2026-01-01T09:00:00Z',
      farmCount: 0,
      totalAcreage: 0,
    },
    {
      id: 'mem-007',
      organizationId: 'org-dept-agri-ts',
      userId: 'usr-gov-officer-02',
      userName: 'M. Prabhakar (Mandal Agri Officer)',
      userPhone: '+91 98765 43221',
      role: 'FIELD_OFFICER',
      status: 'active',
      joinedAt: '2026-01-05T09:00:00Z',
      farmCount: 0,
      totalAcreage: 0,
    },
  ];

  listMembers(organizationId: string): OrgMemberItem[] {
    return this.members.filter((m) => m.organizationId === organizationId);
  }

  getMember(organizationId: string, memberId: string): OrgMemberItem {
    const member = this.members.find(
      (m) => m.organizationId === organizationId && m.id === memberId
    );
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found in organization ${organizationId}`);
    }
    return member;
  }

  addMember(organizationId: string, data: {
    userId: string;
    userName: string;
    userPhone: string;
    role?: OrgRole;
    farmCount?: number;
    totalAcreage?: number;
  }): OrgMemberItem {
    const exists = this.members.some(
      (m) => m.organizationId === organizationId && m.userId === data.userId
    );
    if (exists) {
      throw new BadRequestException(`User ${data.userId} is already a member of this organization`);
    }

    const newMember: OrgMemberItem = {
      id: `mem-${Date.now().toString(36)}`,
      organizationId,
      userId: data.userId,
      userName: data.userName,
      userPhone: data.userPhone,
      role: data.role || 'MEMBER',
      status: 'active',
      joinedAt: new Date().toISOString(),
      farmCount: data.farmCount || 0,
      totalAcreage: data.totalAcreage || 0,
    };

    this.members.push(newMember);
    return newMember;
  }

  updateMemberRole(organizationId: string, memberId: string, role: OrgRole): OrgMemberItem {
    const member = this.getMember(organizationId, memberId);
    member.role = role;
    return member;
  }

  removeMember(organizationId: string, memberId: string): boolean {
    const index = this.members.findIndex(
      (m) => m.organizationId === organizationId && m.id === memberId
    );
    if (index === -1) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }
    this.members.splice(index, 1);
    return true;
  }
}
