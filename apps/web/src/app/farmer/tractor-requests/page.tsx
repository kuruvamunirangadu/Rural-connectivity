'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Radar, ChevronLeft, Sparkles, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export default function FuturisticTractorRequestsPage() {
  const [selectedFarm, setSelectedFarm] = useState('Alpha Sector (5 Acres • Cotton)');
  const [workType, setWorkType] = useState('Rotavator');
  const [area, setArea] = useState('5');
  const [date, setDate] = useState('2026-09-05');
  const [time, setTime] = useState('07:00 AM');
  const [minHp, setMinHp] = useState('45');
  const [hasSearched, setHasSearched] = useState(true);
  const [requestedId, setRequestedId] = useState<string | null>(null);

  const matchedTractors = [
    {
      id: 'tr-001',
      brand: 'Mahindra',
      model: 'Arjun 550 DI Telemetry Pro',
      hp: 50,
      attachment: 'Rotavator 42 Blades',
      distanceKm: 3.4,
      rating: 4.9,
      owner: 'Suresh Reddy',
      matchScore: 98,
      rate: '₹950/ac',
    },
    {
      id: 'tr-002',
      brand: 'John Deere',
      model: '5310 PowerTech',
      hp: 55,
      attachment: 'Rotavator + Seed Drill',
      distanceKm: 7.8,
      rating: 4.8,
      owner: 'Ramesh Goud',
      matchScore: 94,
      rate: '₹1050/ac',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 p-4 md:p-8 space-y-6 font-mono relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 relative z-10">
        <Link href="/farmer" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mb-1">
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO FARM COMMAND</span>
        </Link>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Radar className="w-6 h-6 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          Hyperlocal Autonomous Machinery Radar
        </h1>
        <p className="text-xs text-slate-400">
          Search calibrated tractors by implement attachments, engine horsepower, and instant escrow availability.
        </p>
      </div>

      {/* Query Parameters Form */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/30 space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-black uppercase text-white tracking-wider">Mission Requirements Config</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Target Farm Sector</label>
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="Alpha Sector (5 Acres • Cotton)">Alpha Sector (5 Acres • Cotton)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Implement Spec</label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="Rotavator">Rotavator (High RPM Tilling)</option>
              <option value="Plough">Deep Plough (Hardpan Breaking)</option>
              <option value="Cultivator">Secondary Cultivator</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Field Area (Acres)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Scheduled Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Target Start Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Minimum Engine HP</label>
            <select
              value={minHp}
              onChange={(e) => setMinHp(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="45">≥ 45 HP (Standard)</option>
              <option value="50">≥ 50 HP (Heavy Duty)</option>
              <option value="55">≥ 55 HP (Extreme Power)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setHasSearched(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition shadow-[0_0_15px_#10B981] flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>RE-SCAN MESH SENSORS</span>
        </button>
      </div>

      {/* Match Results */}
      {hasSearched && (
        <div className="space-y-3 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detected Compatible Nodes ({matchedTractors.length} Units Calibrated)
          </h2>
          <div className="space-y-3">
            {matchedTractors.map((t) => (
              <div
                key={t.id}
                className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">🚜 {t.brand} {t.model}</span>
                    <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-bold">
                      {t.hp} HP
                    </span>
                    <span className="text-xs text-amber-400 font-bold">★ {t.rating}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Implement: <strong className="text-emerald-400">{t.attachment} ✓</strong> • Operator: {t.owner} • {t.distanceKm} km away • Rate: {t.rate}
                  </p>
                </div>

                <div>
                  {requestedId === t.id ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DISPATCH TRANSMITTED</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setRequestedId(t.id)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_#10B981] flex items-center gap-1.5"
                    >
                      <span>INSTANT DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
