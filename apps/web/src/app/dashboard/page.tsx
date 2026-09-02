'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { Role, UserSession } from '../../components/role-switcher/RoleSwitcher';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [session, setSession] = useState<UserSession>({
    user: {
      id: 'usr-ravi-001',
      name: 'Ravi Kumar',
      phone: '+91 98765 43210',
    },
    roles: ['FARMER', 'CONTRACTOR', 'TRACTOR_OWNER'],
    currentRole: 'FARMER',
  });

  const handleSwitchRole = (newRole: Role) => {
    setSession((prev) => ({
      ...prev,
      currentRole: newRole,
    }));
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-mono relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <Navbar session={session} onSwitchRole={handleSwitchRole} />

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative z-10">
        {/* Welcome HUD Banner */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 rounded-full">
                Active Quantum Persona: {session.currentRole.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Welcome back, {session.user.name}</h1>
            <p className="text-xs text-slate-400">
              Live telemetry stream and autonomous dispatch network connected to Tandur Sector TG-VKR-04.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Tier 4 Verified</span>
            </div>
            <div className="text-slate-700">•</div>
            <div className="text-cyan-400 font-bold">{session.roles.length} Dynamic Personas</div>
          </div>
        </div>

        {/* Dynamic Role Dashboard View */}
        {session.currentRole === 'FARMER' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-black text-white">🌾 Farmer Mission Overview</h2>
                  <p className="text-xs text-slate-400">Manage land plots, create tractor tilling requests, and hire workers.</p>
                </div>
                <Link href="/farmer" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                  <span>EXPAND PLOT MAP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Registered Plots</span>
                  <p className="text-xl font-black text-white mt-1">3 Plots (10.0 Ac)</p>
                  <span className="text-[11px] text-emerald-400">Cotton, Paddy, Chilli</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Open Requests</span>
                  <p className="text-xl font-black text-white mt-1">1 Dispatched</p>
                  <span className="text-[11px] text-cyan-400">#TRW-000124 (Rotavator)</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Escrow</span>
                  <p className="text-xl font-black text-white mt-1">₹4,750 Locked</p>
                  <span className="text-[11px] text-emerald-400">Sept 5 • Suresh Reddy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {session.currentRole === 'CONTRACTOR' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-black text-white">🏗️ Mega-Cluster Project Dashboard</h2>
                  <p className="text-xs text-slate-400">Aggregate multi-village operations and monitor resource allocation.</p>
                </div>
                <Link href="/contractor" className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                  <span>PROJECT RADAR</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Mega-Project</span>
                  <p className="text-xl font-black text-white mt-1">50 Acres Cluster</p>
                  <span className="text-[11px] text-purple-400">Village X Operations</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Fleet Mobilization</span>
                  <p className="text-xl font-black text-white mt-1">10 / 11 Resources</p>
                  <span className="text-[11px] text-amber-400 font-bold">1 Worker Needed ⚠</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Field Team</span>
                  <p className="text-xl font-black text-white mt-1">16 Operators</p>
                  <span className="text-[11px] text-slate-400">Sri Sai Agri Logistics</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {session.currentRole === 'TRACTOR_OWNER' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-black text-white">🚜 Tractor Fleet Command</h2>
                  <p className="text-xs text-slate-400">Manage tractors, attachments, and operating schedule.</p>
                </div>
                <Link href="/tractor-owner" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                  <span>DISPATCH CONSOLE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Fleet Unit</span>
                  <p className="text-xl font-black text-white mt-1">50 HP Pro</p>
                  <span className="text-[11px] text-emerald-400">Mahindra Arjun 550 DI</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Attached Implements</span>
                  <p className="text-xl font-black text-white mt-1">4 Implements</p>
                  <span className="text-[11px] text-slate-400">Rotavator, Laser Leveler...</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Today&apos;s Escrow Yield</span>
                  <p className="text-xl font-black text-white mt-1">₹4,750</p>
                  <span className="text-[11px] text-emerald-400">Sept 5 • 5.0 Acres</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
