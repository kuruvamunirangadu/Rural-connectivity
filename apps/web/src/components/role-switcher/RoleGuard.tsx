'use client';

import React from 'react';
import { Role, UserSession } from './RoleSwitcher';

interface RoleGuardProps {
  session: UserSession;
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  session,
  allowedRoles,
  children,
  fallback = null,
}) => {
  const isAuthorized = allowedRoles.includes(session.currentRole);

  if (!isAuthorized) {
    return (
      fallback || (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <p className="font-bold">Access Restricted</p>
          <p>Your current active persona ({session.currentRole}) is not authorized to view this section. Please switch roles in the header.</p>
        </div>
      )
    );
  }

  return <>{children}</>;
};
