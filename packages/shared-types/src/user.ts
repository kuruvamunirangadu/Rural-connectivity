import { Role } from './role';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  role: Role;
  isActive: boolean;
}

export interface UserPreference {
  id: string;
  userId: string;
  currentRole: Role;
}

export interface UserSession {
  user: User;
  roles: Role[];
  currentRole: Role;
}
