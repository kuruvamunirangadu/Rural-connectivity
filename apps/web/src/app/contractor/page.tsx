'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, ChevronLeft, Plus, Cpu, Users, Wrench } from 'lucide-react';

export default function FuturisticContractorPage() {
  const [projects] = useState([
    {
      ref: '#CTR-000089',
      title: 'Tandur Mega-Cluster Agricultural Sowing',
      acreage: '50 Acres (4 Villages)',
      duration: '5 Days',
      tractors: '3 / 3 Mobilized',
      workers: '5 / 5 Deployed',
      sprayers: '2 / 2 Ready',
      progress: 92,
      escrowBudget: '₹1,45,000',
    },
    {
      ref: '#CTR-000094',
      title: 'Vikarabad Basin Cotton Harvesting & Laser Leveling',
      acreage: '120 Acres (8 Plots)',
      duration: '12 Days',
      tractors: '6 / 8 Mobilized',
      workers: '14 / 16 Deployed',
      sprayers: '4 / 4 Ready',
      progress: 74,
      escrowBudget: '₹3,80,000',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 p-4 md:p-8 space-y-6 font-mono relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mb-1">
            <ChevronLeft className="w-4 h-4" />
            <span>RETURN TO QUANTUM OS COCKPIT</span>
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-purple-400 animate-pulse" />
            Mega-Cluster Project Orchestration
          </h1>
          <p className="text-xs text-slate-400">
            Multi-village pooled land operations, bulk resource procurement, and automated smart milestone escrow.
          </p>
        </div>

        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>INITIALIZE MEGA-PROJECT</span>
        </button>
      </div>

      {/* Project Cards */}
      <div className="space-y-4 relative z-10">
        {projects.map((p) => (
          <div key={p.ref} className="glass-panel-glow rounded-3xl p-6 border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-bold block">{p.ref} • {p.acreage}</span>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">TOTAL ESCROW BUDGET</span>
                <span className="text-lg font-black text-emerald-400">{p.escrowBudget}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">HEAVY MACHINERY</span>
                  <span className="text-white font-bold">{p.tractors}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">SKILLED OPERATORS</span>
                  <span className="text-white font-bold">{p.workers}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">DRONE SPRAYERS</span>
                  <span className="text-white font-bold">{p.sprayers}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Cluster Deployment Execution</span>
                <span className="text-purple-400 font-bold">{p.progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full shadow-[0_0_10px_#A855F7]"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
