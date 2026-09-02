'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, ChevronLeft, Calendar, ShieldCheck } from 'lucide-react';

export default function FuturisticWorkerPage() {
  const [availableToday, setAvailableToday] = useState(true);
  const [dailyRate, setDailyRate] = useState(550);
  const [radius, setRadius] = useState(10);

  const [skills] = useState([
    { name: 'Sprayer Operator (Power & HTP)', exp: '6 Years', verified: true },
    { name: 'Tractor Operator (Rotavator & Tilling)', exp: '4 Years', verified: true },
    { name: 'Pump Technician (Electric & Diesel)', exp: '3 Years', verified: true },
  ]);

  const [jobOffers, setJobOffers] = useState([
    { id: 'wo-01', farmer: 'Ravi Kumar', village: 'Tangipalli', distance: '3.4 km', skill: 'Sprayer Operator', crop: 'Cotton', days: 2, wage: '₹550 / day', status: 'PENDING' },
    { id: 'wo-02', farmer: 'S. Narsimha', village: 'Malkapur', distance: '5.1 km', skill: 'Tractor Operator', crop: 'Paddy', days: 1, wage: '₹600 / day', status: 'PENDING' },
  ]);

  const handleAccept = (id: string) => {
    setJobOffers(jobOffers.map((j) => (j.id === id ? { ...j, status: 'ACCEPTED' } : j)));
  };

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
          <Users className="w-6 h-6 text-amber-400 animate-pulse" />
          Skilled Agricultural Worker Command
        </h1>
        <p className="text-xs text-slate-400">
          Manage certified agricultural skills, daily wage rates, and accept local farming job offers.
        </p>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Daily Wage Rate</span>
          <p className="text-2xl font-black text-amber-400 mt-1">₹{dailyRate} / day</p>
          <span className="text-[11px] text-slate-400">Direct Bank Settlement</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Operating Radius</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{radius} km</p>
          <span className="text-[11px] text-slate-400">Vikarabad Sector</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Reputation Rating</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">★ 4.8</p>
          <span className="text-[11px] text-emerald-400">34 Completed Jobs</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Today&apos;s Status</span>
          <p className="text-xl font-black text-white mt-1">{availableToday ? 'AVAILABLE' : 'OFF DUTY'}</p>
          <span className="text-[11px] text-cyan-400">Algorithmic Matching On</span>
        </div>
      </div>

      {/* Skills & Availability Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Agricultural Specializations</span>
          </h2>
          <div className="space-y-2.5">
            {skills.map((s) => (
              <div key={s.name} className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-white font-bold block">{s.name}</span>
                  <span className="text-[11px] text-slate-400">{s.exp} Field Experience</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  ✓ VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Daily Wage & Service Settings</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-300">Expected Daily Wage Rate: ₹{dailyRate}</span>
              <input
                type="range"
                min="400"
                max="1000"
                step="50"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-slate-300">Work Operating Radius: {radius} km</span>
              <input
                type="range"
                min="5"
                max="25"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
            </div>

            <button
              onClick={() => setAvailableToday(!availableToday)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                availableToday ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {availableToday ? '✓ CURRENTLY AVAILABLE TODAY' : 'SET AS OFF-DUTY'}
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Job Offers */}
      <div className="space-y-3 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Incoming Field Work Requests</h2>
        <div className="space-y-3">
          {jobOffers.map((j) => (
            <div key={j.id} className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                    {j.id}
                  </span>
                  <h3 className="text-base font-bold text-white">{j.farmer}</h3>
                  <span className="text-slate-400">({j.village} • {j.distance})</span>
                </div>
                <p className="text-slate-300">
                  Required Skill: <strong className="text-emerald-400">{j.skill}</strong> • Crop: {j.crop} • Duration: {j.days} Days
                </p>
                <span className="text-emerald-400 font-bold block">Total Wage Payout: {j.wage}</span>
              </div>

              {j.status === 'ACCEPTED' ? (
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold">
                  ✓ JOB ACCEPTED & SCHEDULED
                </span>
              ) : (
                <button
                  onClick={() => handleAccept(j.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  ACCEPT JOB OFFER
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
