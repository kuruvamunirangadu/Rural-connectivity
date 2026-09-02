'use client';

import React from 'react';

export type Role = 'FARMER' | 'CONTRACTOR' | 'TRACTOR_OWNER' | 'SKILLED_WORKER' | 'EQUIPMENT_OWNER' | 'SUPPLIER' | 'ADMIN';

export interface UserSession {
  user: {
    id: string;
    name: string;
    phone: string;
  };
  roles: Role[];
  currentRole: Role;
}

interface RoleSwitcherProps {
  session: UserSession;
  onSwitchRole: (newRole: Role) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ session, onSwitchRole }) => {
  return (
    <div className="relative inline-block text-left">
      <select
        value={session.currentRole}
        onChange={(e) => onSwitchRole(e.target.value as Role)}
        className="bg-emerald-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
      >
        {session.roles.map((r) => (
          <option key={r} value={r}>
            {r.replace('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  );
};
