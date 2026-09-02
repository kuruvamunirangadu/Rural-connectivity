'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wrench, ChevronLeft } from 'lucide-react';

export default function FuturisticEquipmentOwnerPage() {
  const [equipmentList] = useState([
    { id: 'eq-1', name: 'Aspee HTP-35 Power Sprayer', type: 'Sprayer', capacity: '35 LPM Discharge (5.5 HP)', ratePerAcre: 350, ratePerDay: 1200, bundleOperator: true, status: 'RENTED • FIELD #4' },
    { id: 'eq-2', name: 'Kirloskar 7.5 HP High-Volume Pump', type: 'Water Pump', capacity: '1200 LPM Flow Rate', ratePerAcre: 450, ratePerDay: 1500, bundleOperator: false, status: 'AVAILABLE' },
    { id: 'eq-3', name: 'Neptune 16L Battery Knapsack Sprayer', type: 'Sprayer', capacity: '16 Litres (12V Battery)', ratePerAcre: 150, ratePerDay: 400, bundleOperator: false, status: 'AVAILABLE' },
  ]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 p-4 md:p-8 space-y-6 font-mono relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold mb-1">
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO ROLE COCKPIT</span>
        </Link>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-emerald-400 animate-pulse" />
          Sprayers & Heavy Pumps Equipment Hub
        </h1>
        <p className="text-xs text-slate-400">
          Manage specialized agricultural equipment rentals, operator bundling, and dual combo matching.
        </p>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Equipment Fleet</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">3 Units</p>
          <span className="text-[11px] text-slate-400">Sprayers & High-Flow Pumps</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Operator Bundling</span>
          <p className="text-xl font-black text-cyan-400 mt-1">ACTIVE</p>
          <span className="text-[11px] text-slate-400">Dual Combo Enabled</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Active Rentals</span>
          <p className="text-2xl font-black text-amber-400 mt-1">1 Deployed</p>
          <span className="text-[11px] text-emerald-400">Tangipalli Cotton Field</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Monthly Rental Yield</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₹28,400</p>
          <span className="text-[11px] text-slate-400">Direct Escrow Settlements</span>
        </div>
      </div>

      {/* Equipment Inventory */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Equipment Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipmentList.map((eq) => (
            <div key={eq.id} className="glass-panel-glow rounded-3xl p-5 border border-emerald-500/30 space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block">{eq.type}</span>
                  <h3 className="text-base font-bold text-white">{eq.name}</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  eq.status.includes('RENTED') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {eq.status}
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-slate-300">
                <span className="text-slate-500 text-[10px] block uppercase">Specifications & Tariffs</span>
                <p className="font-bold text-white">{eq.capacity}</p>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Rate: ₹{eq.ratePerAcre}/Acre</span>
                  <span>(₹{eq.ratePerDay}/Day)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Bundled Operator:</span>
                <span className={eq.bundleOperator ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {eq.bundleOperator ? '✓ PROVIDED WITH RENTAL' : 'STANDALONE EQUIPMENT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
