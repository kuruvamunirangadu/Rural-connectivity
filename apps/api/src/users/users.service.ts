import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';

const VALID_ROLES = [
  'FARMER',
  'CONTRACTOR',
  'TRACTOR_OWNER',
  'SKILLED_WORKER',
  'EQUIPMENT_OWNER',
  'SUPPLIER',
  'ADMIN',
];

@Injectable()
export class UsersService {
  private activeUser = {
    id: 'usr-ravi-001',
    phone: '+919876543210',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    status: 'ACTIVE',
    village: 'Tangipalli',
    mandal: 'Tandur',
    district: 'Vikarabad',
    preferredLanguage: 'Telugu',
    roles: ['FARMER', 'CONTRACTOR', 'TRACTOR_OWNER'],
    currentRole: 'FARMER',
  };

  async getMe() {
    return this.activeUser;
  }

  async updateMe(updateDto: any) {
    this.activeUser = { ...this.activeUser, ...updateDto };
    return this.activeUser;
  }

  async getRoles() {
    return {
      userId: this.activeUser.id,
      roles: this.activeUser.roles,
      currentRole: this.activeUser.currentRole,
    };
  }

  async addRole(role: string) {
    const formattedRole = role?.toUpperCase();
    if (!VALID_ROLES.includes(formattedRole)) {
      throw new BadRequestException(`Invalid role: ${role}. Allowed roles are: ${VALID_ROLES.join(', ')}`);
    }

    if (this.activeUser.roles.includes(formattedRole)) {
      return {
        success: true,
        message: `Role ${formattedRole} already active`,
        roles: this.activeUser.roles,
        currentRole: this.activeUser.currentRole,
      };
    }

    this.activeUser.roles.push(formattedRole);
    return {
      success: true,
      roles: this.activeUser.roles,
      addedRole: formattedRole,
      currentRole: this.activeUser.currentRole,
    };
  }

  async removeRole(role: string) {
    const formattedRole = role?.toUpperCase();
    if (!this.activeUser.roles.includes(formattedRole)) {
      throw new BadRequestException(`User does not possess role: ${formattedRole}`);
    }

    // Business Rule: Cannot remove active role
    if (this.activeUser.currentRole === formattedRole) {
      throw new BadRequestException(`Cannot remove currently active role: ${formattedRole}. Please switch to another role first.`);
    }

    if (this.activeUser.roles.length <= 1) {
      throw new BadRequestException('User must maintain at least one active role.');
    }

    this.activeUser.roles = this.activeUser.roles.filter((r) => r !== formattedRole);
    return {
      success: true,
      roles: this.activeUser.roles,
      removedRole: formattedRole,
      currentRole: this.activeUser.currentRole,
    };
  }

  async switchRole(newRole: string) {
    const formattedRole = newRole?.toUpperCase();
    if (!VALID_ROLES.includes(formattedRole)) {
      throw new BadRequestException(`Invalid role: ${newRole}. Valid roles: ${VALID_ROLES.join(', ')}`);
    }

    // Business Rule: User can switch ONLY to an assigned role
    if (!this.activeUser.roles.includes(formattedRole)) {
      throw new ForbiddenException({
        error: 'ROLE_NOT_ASSIGNED',
        message: `User does not possess role ${formattedRole}. Please add this role to your profile first.`,
      });
    }

    this.activeUser.currentRole = formattedRole;
    return {
      success: true,
      currentRole: this.activeUser.currentRole,
      message: `Active persona switched to ${formattedRole}`,
    };
  }
}
