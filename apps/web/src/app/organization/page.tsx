'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Tractor,
  TrendingUp,
  Award,
  Package,
  Layers,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Check
} from 'lucide-react';

interface OrgProfile {
  id: string;
  name: string;
  code: string;
  type: 'FPO' | 'GOVERNMENT' | 'COOPERATIVE' | 'NGO';
  district: string;
  mandal: string;
  totalMembers: number;
  totalFarms: number;
  totalAcreage: number;
  activeProgramsCount: number;
  budgetSpentINR: number;
  budgetTotalINR: number;
}

const ORGANIZATIONS: OrgProfile[] = [
  {
    id: 'org-kalyan-fpo',
    name: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
    code: 'FPO-KD-001',
    type: 'FPO',
    district: 'Mahbubnagar',
    mandal: 'Kalyan Border Zone',
    totalMembers: 468,
    totalFarms: 512,
    totalAcreage: 1840.0,
    activeProgramsCount: 2,
    budgetSpentINR: 540000,
    budgetTotalINR: 1200000,
  },
  {
    id: 'org-dept-agri-ts',
    name: 'Telangana State Dept. of Agriculture & Mechanization',
    code: 'GOV-TS-AGRI-01',
    type: 'GOVERNMENT',
    district: 'All Districts',
    mandal: 'Statewide',
    totalMembers: 18420,
    totalFarms: 24500,
    totalAcreage: 86400.0,
    activeProgramsCount: 4,
    budgetSpentINR: 18450000,
    budgetTotalINR: 50000000,
  },
  {
    id: 'org-deccan-coop',
    name: 'Deccan Watershed & Organic Farmers Cooperative',
    code: 'COP-DEC-002',
    type: 'COOPERATIVE',
    district: 'Ranga Reddy',
    mandal: 'Chevella',
    totalMembers: 210,
    totalFarms: 240,
    totalAcreage: 920.0,
    activeProgramsCount: 1,
    budgetSpentINR: 320000,
    budgetTotalINR: 850000,
  },
];

export default function OrganizationPage() {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-kalyan-fpo');
  const [activeTab, setActiveTab] = useState<'BULK_WORK' | 'GOV_PROGRAMS' | 'PROCUREMENT' | 'MEMBERS' | 'PRODUCE_MARKET'>('BULK_WORK');
  const [userRole, setUserRole] = useState<'ADMIN' | 'MANAGER' | 'FIELD_OFFICER' | 'MEMBER'>('ADMIN');

  // Bulk Work State
  const [bulkCrop, setBulkCrop] = useState('Cotton (Bt-2)');
  const [bulkActivity, setBulkActivity] = useState('Cluster Pesticide/Fertilizer Spraying');
  const [bulkAcreage, setBulkAcreage] = useState(620);
  const bulkFarmsCount = Math.max(10, Math.round(bulkAcreage / 3.1));
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Beneficiary Management State
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 'part-01', name: 'Ramesh Reddy', village: 'Garladinne', crop: 'Cotton', acres: 8.5, scheme: 'Farm Mechanization 50% Subsidy', subsidyINR: 12000, status: 'DISBURSED' },
    { id: 'part-02', name: 'Suresh Gowd', village: 'Peddapalli', crop: 'Cotton', acres: 5.0, scheme: 'Cluster Spraying Subsidy', subsidyINR: 8000, status: 'APPROVED' },
    { id: 'part-03', name: 'Venkat Rao', village: 'Garladinne', crop: 'Cotton', acres: 6.0, scheme: 'Paddy Harvester Scheme', subsidyINR: 9500, status: 'PENDING' },
    { id: 'part-04', name: 'Laxmi Devi', village: 'Peddapalli', crop: 'Groundnut', acres: 3.5, scheme: 'Sprayer Battery Grant', subsidyINR: 5000, status: 'PENDING' },
  ]);

  // Procurement Quotes State
  const [awardedQuoteId, setAwardedQuoteId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState([
    {
      id: 'q-01',
      supplier: 'Sri Venkateshwara Agri Inputs',
      shop: 'Venkateshwara Fertilizers Hub',
      rating: 4.8,
      quoteAmount: 312000,
      unitPrice: 260,
      deliveryDays: 2,
      discountPct: 8.5,
      score: 86,
      isLowest: false,
    },
    {
      id: 'q-02',
      supplier: 'Balaji Kisan Seva Kendra',
      shop: 'Balaji Seeds & Agro',
      rating: 4.6,
      quoteAmount: 324000,
      unitPrice: 270,
      deliveryDays: 1,
      discountPct: 5.0,
      score: 82,
      isLowest: false,
    },
    {
      id: 'q-03',
      supplier: 'Deccan Agro Supply Logistics',
      shop: 'Deccan Wholesale Logistics',
      rating: 4.9,
      quoteAmount: 300000,
      unitPrice: 250,
      deliveryDays: 4,
      discountPct: 12.0,
      score: 94,
      isLowest: true,
    },
  ]);

  // Produce Orders State
  const [orderedProduceId, setOrderedProduceId] = useState<string | null>(null);

  const currentOrg = ORGANIZATIONS.find((o) => o.id === selectedOrgId) || ORGANIZATIONS[0];

  const handleApproveSubsidy = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === 'PENDING' ? 'APPROVED' : 'DISBURSED' } : b))
    );
  };

  const handleLaunchBulkWork = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkSuccessMsg(`🚀 Successfully dispatched 12 Power Sprayers & 12 Certified Operators across ${bulkFarmsCount} cotton farms (${bulkAcreage} acres)! Work ID: #BW-${Date.now().toString().slice(-4)}`);
    setTimeout(() => setBulkSuccessMsg(''), 6000);
  };

  const handleAwardQuote = (quoteId: string) => {
    setAwardedQuoteId(quoteId);
    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, score: 99 } : q)));
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[400px] bg-gradient-to-tl from-indigo-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP NOTIFICATION / HEADER */}
      <header className="relative z-40 bg-[#0B1020]/90 backdrop-blur-2xl border-b border-slate-800/80 sticky top-0 font-mono">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-white bg-clip-text text-transparent">
                    Institutional Network
                  </h1>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                    MILESTONE 14
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Government • FPO • Cooperative • Institutional Buyer Grid
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Links */}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              ← Farmer Grid
            </Link>
            <Link
              href="/ai"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Suite</span>
            </Link>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-slate-500 font-mono text-[10px]">ROLE:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ADMIN">ADMIN (Full Access)</option>
                <option value="MANAGER">MANAGER (Ops & Spend)</option>
                <option value="FIELD_OFFICER">FIELD OFFICER (Surveys)</option>
                <option value="MEMBER">MEMBER (Farmer View)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* INSTITUTION SELECTOR & OVERVIEW HERO */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-bold flex items-center gap-1.5 mb-1">
                <Building2 className="w-4 h-4" />
                Active Institutional Entity
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white">{currentOrg.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Code: {currentOrg.code}</span>
                <span>•</span>
                <span>Type: <strong className="text-emerald-400">{currentOrg.type}</strong></span>
                <span>•</span>
                <span>Jurisdiction: {currentOrg.district} ({currentOrg.mandal})</span>
              </div>
            </div>

            {/* Organization Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">SWITCH ENTITY:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {ORGANIZATIONS.map((org) => (
                  <option key={org.id} value={org.id}>
                    [{org.type}] {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Member Farmers</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentOrg.totalMembers.toLocaleString()}</p>
              <span className="text-[11px] text-emerald-400 font-mono">100% Mobile KYC Verified</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Total Land Area</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentOrg.totalAcreage.toLocaleString()} <span className="text-sm font-normal text-slate-400">Acres</span></p>
              <span className="text-[11px] text-cyan-400 font-mono">Across {currentOrg.totalFarms.toLocaleString()} Plots</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Machinery Deployed</span>
                <Tractor className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">{currentOrg.type === 'GOVERNMENT' ? '420' : '24'} <span className="text-sm font-normal text-slate-400">Units</span></p>
              <span className="text-[11px] text-purple-300 font-mono">Tractors & Power Sprayers</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Bulk Savings Achieved</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400">22.4% <span className="text-sm font-normal text-slate-400">Rebate</span></p>
              <span className="text-[11px] text-amber-300 font-mono">₹8.4L Collective Reduction</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 font-mono text-xs">
          {[
            { id: 'BULK_WORK', label: '🚜 FPO Bulk Work Hub', desc: 'Cluster Spraying & Multi-Farm Coordination' },
            { id: 'GOV_PROGRAMS', label: '🏛️ Government Schemes', desc: 'Mechanization Subsidies & Direct Benefits' },
            { id: 'PROCUREMENT', label: '📦 Bulk Input Bidding', desc: 'RFP Matrix & Supplier Quotes' },
            { id: 'MEMBERS', label: '👥 Members & Land Roster', desc: 'RBAC Directory & Farm Cadastre' },
            { id: 'PRODUCE_MARKET', label: '🌾 B2B Produce Exchange', desc: 'Institutional Buyers & Mills' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: BULK WORK COORDINATION */}
        {activeTab === 'BULK_WORK' && (
          <div className="space-y-6 font-mono">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Tractor className="w-5 h-5 text-emerald-400" />
                    FPO Bulk Work Coordinator & Machinery Brigade
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automatically aggregate multi-farmer plots into unified mechanical operations with shared equipment brigades.
                  </p>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold self-start md:self-auto">
                  ⚡ 200 Farms • 620 Acres Cluster
                </span>
              </div>

              {bulkSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}

              {/* Aggregation Configurator Form */}
              <form onSubmit={handleLaunchBulkWork} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Crop:</label>
                  <select
                    value={bulkCrop}
                    onChange={(e) => setBulkCrop(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Cotton (Bt-2)">Cotton (Bt-2) — 200 Member Farms</option>
                    <option value="Groundnut (K-6)">Groundnut (K-6) — 85 Member Farms</option>
                    <option value="Sona Masoori Paddy">Sona Masoori Paddy — 140 Member Farms</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Agricultural Operation:</label>
                  <select
                    value={bulkActivity}
                    onChange={(e) => setBulkActivity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Cluster Pesticide/Fertilizer Spraying">Cluster Pesticide/Fertilizer Spraying</option>
                    <option value="Deep Rotavation & Land Prep">Deep Rotavation & Land Prep</option>
                    <option value="Combined Harvester Drive">Combined Harvester Drive</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Aggregated Acreage:</label>
                  <input
                    type="number"
                    value={bulkAcreage}
                    onChange={(e) => setBulkAcreage(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110 transition flex items-center justify-center gap-1.5"
                  >
                    <Tractor className="w-4 h-4" />
                    <span>Dispatch Brigade</span>
                  </button>
                </div>
              </form>

              {/* Brigade Requirements Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Aggregated Resource Allocation Model ({bulkAcreage} Acres • 5-Day Window)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Power Sprayers:</span>
                      <span className="text-emerald-400 font-bold">12 Units</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Daily Coverage:</span>
                      <span className="text-white">125 Acres / day</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Unit Est. Rate:</span>
                      <span className="text-slate-300">₹450 / day</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Certified Operators:</span>
                      <span className="text-cyan-400 font-bold">12 Workers</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Shift Coverage:</span>
                      <span className="text-white">06:30 AM – 11:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Wage Escrow:</span>
                      <span className="text-emerald-400 font-bold">₹600 / day</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Water Supply Tractors:</span>
                      <span className="text-purple-400 font-bold">3 Tractors</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Tanker Capacity:</span>
                      <span className="text-white">5000L Mobile Tank</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">FPO Collective Price:</span>
                      <span className="text-amber-300 font-bold">₹110 / Acre (vs ₹160 retail)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Village Route Progression */}
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase">Synchronized Multi-Village Route Progression:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>1. Garladinne Sector</span>
                      <span>COMPLETED</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">82 Farms • 240 Acres sprayed</p>
                  </div>

                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-1">
                    <div className="flex justify-between text-cyan-400 font-bold">
                      <span>2. Peddapalli Sector</span>
                      <span>IN PROGRESS (68%)</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">68 Farms • 210 Acres</p>
                  </div>

                  <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>3. Kalyan Central</span>
                      <span>SCHEDULED (Tomorrow)</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">50 Farms • 170 Acres</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOVERNMENT SCHEMES & SUBSIDY */}
        {activeTab === 'GOV_PROGRAMS' && (
          <div className="space-y-6 font-mono">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    Government Schemes & Direct Mechanization Subsidies
                  </h3>
                  <p className="text-xs text-slate-400">
                    State Direct Benefit Transfer (DBT) and equipment vouchers linked to verified farmer Aadhaar & land records.
                  </p>
                </div>
                <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                  Budget: ₹5.00 Crore (50% Direct Subsidy)
                </span>
              </div>

              {/* Financial Progress Bar */}
              <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Budget Disbursement (18,420 / 25,000 Beneficiaries):</span>
                  <span className="text-emerald-400 font-bold">₹1.845 Cr Spent / ₹5.00 Cr (36.9%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full" style={{ width: '36.9%' }} />
                </div>
              </div>

              {/* Beneficiaries Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Recent Beneficiary Applications & Approvals</h4>
                  <span className="text-[11px] text-cyan-400">Showing 4 active claims in Kalyan Zone</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                        <th className="py-2.5 px-3">Farmer</th>
                        <th className="py-2.5 px-3">Village</th>
                        <th className="py-2.5 px-3">Land Plot</th>
                        <th className="py-2.5 px-3">Scheme & Rate</th>
                        <th className="py-2.5 px-3">Subsidy Amount</th>
                        <th className="py-2.5 px-3">DBT Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {beneficiaries.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {b.name}
                          </td>
                          <td className="py-3 px-3">{b.village}</td>
                          <td className="py-3 px-3">{b.acres} ac ({b.crop})</td>
                          <td className="py-3 px-3 text-cyan-300">{b.scheme}</td>
                          <td className="py-3 px-3 font-bold text-emerald-400">₹{b.subsidyINR.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'DISBURSED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : b.status === 'APPROVED'
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {b.status === 'PENDING' && (
                              <button
                                onClick={() => handleApproveSubsidy(b.id)}
                                className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] rounded-lg hover:bg-emerald-500/30 transition"
                              >
                                Approve Claim
                              </button>
                            )}
                            {b.status === 'APPROVED' && (
                              <button
                                onClick={() => handleApproveSubsidy(b.id)}
                                className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] rounded-lg hover:bg-cyan-500/30 transition"
                              >
                                Release DBT ₹
                              </button>
                            )}
                            {b.status === 'DISBURSED' && (
                              <span className="text-[11px] text-slate-500">Paid to UPI/Aadhaar</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROCUREMENT & BIDDING */}
        {activeTab === 'PROCUREMENT' && (
          <div className="space-y-6 font-mono">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    Bulk Input Procurement & Supplier Bidding Matrix
                  </h3>
                  <p className="text-xs text-slate-400">
                    FPO-level bulk purchase orders with automated weighted scoring across pricing, delivery speed, and supplier reputation.
                  </p>
                </div>
                <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                  RFP: 1200 Bags Urea + DAP (Kharif Supply)
                </span>
              </div>

              {/* Side by side Quote Comparison */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Supplier Quotation Matrix & Scoring</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className={`p-5 rounded-3xl border transition-all space-y-3 ${
                        awardedQuoteId === q.id
                          ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : q.isLowest
                          ? 'bg-slate-900/80 border-cyan-500/40'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">ID: {q.id}</span>
                          <h5 className="text-sm font-bold text-white">{q.supplier}</h5>
                          <span className="text-xs text-slate-400">{q.shop}</span>
                        </div>
                        {q.isLowest && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] rounded-full font-bold">
                            LOWEST BID
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Quote:</span>
                          <span className="text-emerald-400 font-bold">₹{q.quoteAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Unit Bag Price:</span>
                          <span className="text-white">₹{q.unitPrice} / 45kg bag</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Delivery Lead Time:</span>
                          <span className="text-cyan-300">{q.deliveryDays} Days to Godown</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bulk Discount:</span>
                          <span className="text-amber-300 font-bold">{q.discountPct}% Applied</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1.5">
                          <span className="text-slate-500">Weighted Score:</span>
                          <span className="text-emerald-400 font-black">{q.score} / 100</span>
                        </div>
                      </div>

                      <div>
                        {awardedQuoteId === q.id ? (
                          <div className="w-full py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4" />
                            <span>Contract Awarded</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAwardQuote(q.id)}
                            className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-slate-700 hover:border-emerald-500 transition"
                          >
                            Award Procurement RFP
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBER & FARM ROSTER */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-6 font-mono">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Member Farmers & Farm Cadastre Directory
                  </h3>
                  <p className="text-xs text-slate-400">
                    Granular role-based access control (RBAC) and spatial farm plot registry attached to FPO.
                  </p>
                </div>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full font-bold">
                  468 Registered Member Farmers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Ramesh Reddy', phone: '+91 98765 43210', role: 'ADMIN', village: 'Garladinne', farms: 2, totalAcres: 8.5, crops: 'Cotton, Groundnut' },
                  { name: 'Suresh Gowd', phone: '+91 98765 43211', role: 'MANAGER', village: 'Peddapalli', farms: 1, totalAcres: 5.0, crops: 'Cotton' },
                  { name: 'Naresh Kumar', phone: '+91 98765 43212', role: 'FIELD_OFFICER', village: 'Garladinne', farms: 1, totalAcres: 4.2, crops: 'Cotton' },
                  { name: 'Venkat Rao', phone: '+91 98765 43213', role: 'MEMBER', village: 'Garladinne', farms: 3, totalAcres: 12.0, crops: 'Cotton, Paddy' },
                  { name: 'Laxmi Devi', phone: '+91 98765 43214', role: 'MEMBER', village: 'Peddapalli', farms: 1, totalAcres: 3.5, crops: 'Groundnut' },
                ].map((m, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h5 className="text-sm font-bold text-white">{m.name}</h5>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <span className="text-slate-300">{m.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Village Sector:</span>
                        <span className="text-slate-300">{m.village}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registered Plots:</span>
                        <span className="text-emerald-400 font-bold">{m.farms} Plots ({m.totalAcres} Acres)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary Crops:</span>
                        <span className="text-slate-300">{m.crops}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: B2B PRODUCE EXCHANGE */}
        {activeTab === 'PRODUCE_MARKET' && (
          <div className="space-y-6 font-mono">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    B2B Commodity Produce Exchange
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connect aggregated FPO harvests directly to institutional ginning mills, food processors, and export aggregators.
                  </p>
                </div>
                <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                  Direct Institutional Linkage
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'prd-01',
                    crop: 'Cotton (Long-Staple 32mm)',
                    producer: 'Kalyandurg FPO Aggregation Yard',
                    quantity: '450 Quintals',
                    grade: 'Grade A (7.2% Moisture)',
                    targetPrice: '₹7,400 / Quintal',
                    buyer: 'Deccan Cotton Ginning & Spinning Mills',
                    status: 'AVAILABLE',
                  },
                  {
                    id: 'prd-02',
                    crop: 'Sona Masoori Organic Paddy',
                    producer: 'Chevella Organic Cluster',
                    quantity: '280 Quintals',
                    grade: 'Export Quality (BPT 5204)',
                    targetPrice: '₹2,850 / Quintal',
                    buyer: 'ITC Agri-Business Choupal',
                    status: 'AVAILABLE',
                  },
                  {
                    id: 'prd-03',
                    crop: 'Groundnut (K-6 Bold Pods)',
                    producer: 'Peddapalli FPO Hub',
                    quantity: '120 Quintals',
                    grade: 'Grade A (High Oil Content)',
                    targetPrice: '₹6,900 / Quintal',
                    buyer: 'Telangana Oilseed Extractors',
                    status: 'AVAILABLE',
                  },
                ].map((prd) => (
                  <div key={prd.id} className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">ID: {prd.id}</span>
                        <h5 className="text-sm font-bold text-white">{prd.crop}</h5>
                        <span className="text-xs text-emerald-400">🌾 {prd.producer}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] rounded-full font-bold">
                        {prd.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Available Volume:</span>
                        <span className="text-white font-bold">{prd.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quality Spec:</span>
                        <span className="text-cyan-300">{prd.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target FPO Price:</span>
                        <span className="text-emerald-400 font-bold">{prd.targetPrice}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1">
                        <span className="text-slate-500">Interested Buyer:</span>
                        <span className="text-purple-300 font-medium">{prd.buyer}</span>
                      </div>
                    </div>

                    <div>
                      {orderedProduceId === prd.id ? (
                        <div className="w-full py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" />
                          <span>Purchase Order Dispatched</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOrderedProduceId(prd.id)}
                          className="w-full py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 transition"
                        >
                          Execute Institutional Purchase
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
