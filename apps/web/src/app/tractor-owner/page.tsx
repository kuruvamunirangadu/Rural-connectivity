'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, ChevronLeft, Zap, Radio, CheckCircle2, X } from 'lucide-react';

export default function FuturisticTractorOwnerPage() {
  const [tractors] = useState([
    {
      id: 'tr-001',
      brand: 'John Deere',
      model: '5310 PowerTech Pro',
      hp: 55,
      reg: 'TS34AB1234',
      status: 'ONLINE • DISPATCH READY',
      attachments: ['Rotavator (42 Blades)', 'Deep Plough', 'Laser Leveler'],
      telemetry: { rpm: 1850, fuel: '92%', hours: 420, health: '98%' },
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'wr-10001',
      farmer: 'Ravi Kumar',
      work: 'Rotavator Operation',
      area: '5.0 Acres',
      date: 'Sept 5',
      time: '7:00 AM',
      location: 'Tangipalli (3.4 km)',
      offerPrice: '₹4,750',
      status: 'AWAITING_CONFIRMATION',
    },
  ]);

  const handleAccept = (id: string) => {
    setPendingRequests(
      pendingRequests.map((r) => (r.id === id ? { ...r, status: 'DISPATCHED_TO_FIELD' } : r))
    );
  };

  const handleReject = (id: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 p-4 md:p-8 space-y-6 font-mono relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mb-1">
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO QUANTUM OS COCKPIT</span>
        </Link>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          Tractor Fleet Command & Mission Dispatch
        </h1>
        <p className="text-xs text-slate-400">
          Live machine IoT sensors, remote job handshake, and real-time escrow settlements.
        </p>
      </div>

      {/* Fleet Telemetry Cards */}
      <div className="space-y-3 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Active Connected Machinery ({tractors.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tractors.map((tr) => (
            <div key={tr.id} className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/30 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">ID: {tr.id} • REG: {tr.reg}</span>
                  <h3 className="text-lg font-black text-white">{tr.brand} {tr.model}</h3>
                </div>
                <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                  {tr.hp} HP
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">RPM</span>
                  <span className="text-cyan-400 font-bold">{tr.telemetry.rpm}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">FUEL</span>
                  <span className="text-emerald-400 font-bold">{tr.telemetry.fuel}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">HOURS</span>
                  <span className="text-purple-400 font-bold">{tr.telemetry.hours}h</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">HEALTH</span>
                  <span className="text-emerald-400 font-bold">{tr.telemetry.health}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                <span className="text-slate-500 block mb-1">Equipped Attachments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {tr.attachments.map((att) => (
                    <span key={att} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 rounded-lg text-[10px]">
                      ⚡ {att}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming Work Requests */}
      <div className="space-y-3 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Incoming Dispatch Requests ({pendingRequests.length})</span>
        </h2>
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div key={req.id} className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-md font-bold">
                    {req.id}
                  </span>
                  <h4 className="text-base font-bold text-white">{req.farmer}</h4>
                  <span className="text-xs text-slate-400">({req.location})</span>
                </div>
                <p className="text-xs text-slate-300">
                  Operation: <span className="text-emerald-400 font-bold">{req.work}</span> • Area: <span className="text-white font-bold">{req.area}</span> • Scheduled: {req.date} at {req.time}
                </p>
                <span className="text-xs text-emerald-400 font-bold block">
                  Guaranteed Escrow Payout: {req.offerPrice}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {req.status === 'DISPATCHED_TO_FIELD' ? (
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-xl">
                    ✓ EN ROUTE TO FIELD
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>DECLINE</span>
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 text-xs font-black rounded-xl shadow-[0_0_15px_#10B981] flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ACCEPT & DISPATCH</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
