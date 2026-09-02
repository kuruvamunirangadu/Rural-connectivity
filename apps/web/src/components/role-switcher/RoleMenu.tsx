'use client';

import React, { useState } from 'react';
import { Role, UserSession } from './RoleSwitcher';
import { ChevronDown, Check, Sparkles } from 'lucide-react';

interface RoleMenuProps {
  session: UserSession;
  onSwitchRole: (newRole: Role) => void;
}

export const RoleMenu: React.FC<RoleMenuProps> = ({ session, onSwitchRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>ROLE: <strong className="text-emerald-400 uppercase">{session.currentRole.replace('_', ' ')}</strong></span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1322] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-slate-800 py-1.5 z-50">
          <div className="px-3 py-1.5 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Zero-Logout Persona Matrix</span>
          </div>
          <div className="p-1 space-y-0.5">
            {session.roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onSwitchRole(role);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition ${
                  session.currentRole === role
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span>{role.replace('_', ' ')}</span>
                {session.currentRole === role && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
