'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Satellite,
  Radar,
  Plus,
  ArrowRight,
  Zap,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export default function FuturisticFarmerPage() {
  const [farms, setFarms] = useState([
    { id: 'farm-1', name: 'Alpha Sector (North Field)', area: 5, areaUnit: 'Acres', crop: 'Cotton Hybrid-6', soilMoisture: '28% Optimal', status: 'READY FOR ROTAVATION', village: 'Tangipalli' },
    { id: 'farm-2', name: 'Canal Basin Plot #2', area: 3.5, areaUnit: 'Acres', crop: 'Paddy BPT-5204', soilMoisture: '34% High', status: 'IRRIGATED', village: 'Tangipalli' },
  ]);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newArea, setNewArea] = useState('5');
  const [newCrop, setNewCrop] = useState('Cotton Hybrid-6');

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName) return;
    setFarms([
      ...farms,
      {
        id: `farm-${Date.now()}`,
        name: newFarmName,
        area: Number(newArea),
        areaUnit: 'Acres',
        crop: newCrop,
        soilMoisture: '26% Optimal',
        status: 'SURVEYED',
        village: 'Tangipalli',
      },
    ]);
    setNewFarmName('');
    setShowAddFarm(false);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 p-4 md:p-8 space-y-6 relative overflow-hidden font-mono">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mb-1">
            <ChevronLeft className="w-4 h-4" />
            <span>RETURN TO QUANTUM OS COCKPIT</span>
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Satellite className="w-6 h-6 text-emerald-400 animate-pulse" />
            Farmer Telemetry & Plot Command
          </h1>
          <p className="text-xs text-slate-400">
            Precision GIS-mapped crop acreage, smart borewell telemetry & machinery dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowAddFarm(!showAddFarm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddFarm ? 'CANCEL CONFIG' : 'MAP NEW SECTOR'}</span>
        </button>
      </div>

      {/* Add Farm Modal Form */}
      {showAddFarm && (
        <form onSubmit={handleAddFarm} className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/30 space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black uppercase text-white tracking-wider">GIS Vector Plot Mapping</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Sector / Plot Label</label>
              <input
                type="text"
                placeholder="e.g. Solar Field #3"
                value={newFarmName}
                onChange={(e) => setNewFarmName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Geo Area (Acres)</label>
              <input
                type="number"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Active Bio-Crop</label>
              <select
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Cotton Hybrid-6">Cotton Hybrid-6</option>
                <option value="Paddy BPT-5204">Paddy BPT-5204</option>
                <option value="Chilli Super-10">Chilli Super-10</option>
                <option value="Red Gram Asha">Red Gram Asha</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_#10B981]">
            REGISTER SECTOR IN MESH
          </button>
        </form>
      )}

      {/* Farms List */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Radar className="w-4 h-4 text-cyan-400" />
          <span>Active GIS Plots ({farms.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((f) => (
            <div key={f.id} className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🌾</span> {f.name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold">{f.area} Acres • {f.crop}</span>
                </div>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-full">
                  {f.village}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">SOIL MOISTURE</span>
                  <span className="text-emerald-400 font-bold">{f.soilMoisture}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">OPERATION STATUS</span>
                  <span className="text-cyan-400 font-bold">{f.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Request Trigger Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/40 relative z-10 overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            AI AUTONOMOUS DISPATCH
          </span>
          <h2 className="text-xl font-black text-white">🚜 Request Heavy Machinery & Rotavators</h2>
          <p className="text-xs text-slate-300">
            Instant algorithmic matching with nearby 50+ HP tractors equipped with laser levelers, rotavators, and deep ploughs.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <span>LAUNCH HYPERLOCAL AI RADAR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
