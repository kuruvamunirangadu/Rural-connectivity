'use client';

import React from 'react';
import { RoleMenu } from '../role-switcher/RoleMenu';
import { Role, UserSession } from '../role-switcher/RoleSwitcher';
import { Radar, Bell } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  session: UserSession;
  onSwitchRole: (newRole: Role) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ session, onSwitchRole }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1020]/90 backdrop-blur-2xl text-white shadow-lg px-4 py-3 border-b border-slate-800 font-mono">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <span className="font-black text-base tracking-tight block leading-tight text-white">
              RuralConnect <span className="text-emerald-400 text-xs">OS 4.0</span>
            </span>
            <span className="text-[10px] text-slate-400 block">Autonomous Agricultural Resource Grid</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <RoleMenu session={session} onSwitchRole={onSwitchRole} />
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-xs font-black text-slate-950 shadow-sm">
              {session.user.name[0]}
            </div>
            <span className="text-xs font-bold hidden sm:inline text-slate-200">{session.user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
