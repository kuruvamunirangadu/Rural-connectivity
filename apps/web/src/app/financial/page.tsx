'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PieChart,
  ArrowUpRight,
  Landmark,
  FileCheck2,
  Ban,
  Scale,
} from 'lucide-react';

export type FinancialRole =
  | 'FARMER'
  | 'TRACTOR_OWNER'
  | 'FPO_MANAGER'
  | 'SUPPLIER'
  | 'BANK_UNDERWRITER';

export type FinancialTab =
  | 'overview'
  | 'crop-economics'
  | 'consent'
  | 'credit-readiness'
  | 'partners-products'
  | 'applications-repayments';

interface IncomeItem {
  id: string;
  sourceType: string;
  amount: number;
  date: string;
  referenceType: string;
  referenceId: string;
  description: string;
  status: string;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
  referenceType: string;
  referenceId: string;
  description: string;
  status: string;
}

interface ConsentItem {
  id: string;
  purpose: string;
  scope: string[];
  partnerName: string;
  status: 'GRANTED' | 'REVOKED' | 'EXPIRED';
  grantedAt: string;
  expiresAt: string;
  auditTrail: { timestamp: string; action: string; details: string }[];
}

interface FinancingProduct {
  id: string;
  partnerName: string;
  partnerType: string;
  name: string;
  code: string;
  purpose: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  indicativeInterestRate: number;
  description: string;
}

interface FinancingApplication {
  id: string;
  productName: string;
  partnerName: string;
  applicationNumber: string;
  requestedAmount: number;
  approvedAmount?: number;
  interestRatePerAnnum?: number;
  tenureMonths: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  submittedAt: string;
  externalReference?: string;
  decisionNotes?: string;
}

interface RepaymentItem {
  id: string;
  applicationId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  status: 'PAID' | 'UPCOMING' | 'DUE' | 'OVERDUE';
  paidAt?: string;
  externalReference?: string;
}

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<FinancialTab>('overview');
  const [activeRole, setActiveRole] = useState<FinancialRole>('FARMER');

  // Income & Expenses state
  const [incomes] = useState<IncomeItem[]>([
    {
      id: 'inc-101',
      sourceType: 'PRODUCE_SALE',
      amount: 2227050,
      date: '2026-02-15',
      referenceType: 'ProduceOrder',
      referenceId: 'ORD-2026-COT-8801',
      description: 'Produce sale of 300Q Bt-2 Cotton to Deccan Cotton Mills via Escrow',
      status: 'VERIFIED',
    },
    {
      id: 'inc-102',
      sourceType: 'SERVICE_EARNING',
      amount: 4200,
      date: '2026-02-08',
      referenceType: 'WorkOffer',
      referenceId: 'WO-8812',
      description: 'Rotavator operator assistance on neighboring plot',
      status: 'VERIFIED',
    },
  ]);

  const [expenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-201',
      category: 'TRACTOR_SERVICE',
      amount: 4750,
      date: '2026-02-10',
      referenceType: 'Booking',
      referenceId: 'BK-ROT-8802',
      description: '5.0 Acres Rotavator Land Preparation operation by Suresh Reddy',
      status: 'VERIFIED',
    },
    {
      id: 'exp-202',
      category: 'INPUT_PURCHASE',
      amount: 8200,
      date: '2026-02-12',
      referenceType: 'Procurement',
      referenceId: 'RFQ-ORD-901',
      description: 'Fertilizer purchase (10x Neem Coated Urea, 2x Zinc) from Sri Venkateshwara Hub',
      status: 'VERIFIED',
    },
    {
      id: 'exp-203',
      category: 'TRANSPORT',
      amount: 823.4,
      date: '2026-02-16',
      referenceType: 'TransportBooking',
      referenceId: 'TR-BK-3301',
      description: 'Logistics freight for 5000 kg cotton haulage to Central FPO Yard',
      status: 'VERIFIED',
    },
  ]);

  // Consents state
  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: 'cns-sbi-001',
      purpose: 'CREDIT_ASSESSMENT',
      scope: ['PLATFORM_TRANSACTIONS', 'PRODUCE_SALES', 'FARM_ACREAGE'],
      partnerName: 'State Bank of India (Rural Banking Division)',
      status: 'GRANTED',
      grantedAt: '2026-01-10',
      expiresAt: '2026-04-10',
      auditTrail: [
        {
          timestamp: '2026-01-10 09:00 AM',
          action: 'CONSENT_GRANTED',
          details: 'User authorized 90-day data sharing for Kisan Working Capital appraisal.',
        },
      ],
    },
    {
      id: 'cns-nabard-002',
      purpose: 'INCOME_VERIFICATION',
      scope: ['SERVICE_EARNINGS', 'SETTLEMENT_HISTORY'],
      partnerName: 'NABARD / Primary Agricultural Credit Society (PACS)',
      status: 'GRANTED',
      grantedAt: '2026-01-20',
      expiresAt: '2026-07-20',
      auditTrail: [
        {
          timestamp: '2026-01-20 10:30 AM',
          action: 'CONSENT_GRANTED',
          details: 'User authorized 180-day data sharing for PACS subsidized input line.',
        },
      ],
    },
  ]);

  // Financing Products catalog
  const financingProducts: FinancingProduct[] = [
    {
      id: 'prod-sbi-kcc-01',
      partnerName: 'State Bank of India',
      partnerType: 'PUBLIC_SECTOR_BANK',
      name: 'Kisan Seasonal Crop Working Capital',
      code: 'SBI-KCC-SEASONAL',
      purpose: 'WORKING_CAPITAL',
      minAmount: 15000,
      maxAmount: 300000,
      minTenureMonths: 6,
      maxTenureMonths: 18,
      indicativeInterestRate: 7.0,
      description: 'Subsidized seasonal crop production loan tied to verified land acreage and harvesting cycle.',
    },
    {
      id: 'prod-pacs-input-03',
      partnerName: 'NABARD PACS',
      partnerType: 'COOPERATIVE',
      name: 'Direct Agri-Input Purchase Micro-Line',
      code: 'PACS-INPUT-LINE',
      purpose: 'INPUT_PURCHASE',
      minAmount: 5000,
      maxAmount: 100000,
      minTenureMonths: 3,
      maxTenureMonths: 12,
      indicativeInterestRate: 4.0,
      description: 'Zero-collateral micro-line disbursed directly to verified fertilizer and seed input suppliers.',
    },
    {
      id: 'prod-sbi-mach-02',
      partnerName: 'State Bank of India',
      partnerType: 'PUBLIC_SECTOR_BANK',
      name: 'Farm Mechanization & Tractor Term Loan',
      code: 'SBI-TRACTOR-TERM',
      purpose: 'TRACTOR',
      minAmount: 100000,
      maxAmount: 1200000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      indicativeInterestRate: 8.75,
      description: 'Medium-term asset financing for tractors, rotavators, power sprayers, and combine harvesters.',
    },
    {
      id: 'prod-icici-b2b-04',
      partnerName: 'ICICI Rural Banking',
      partnerType: 'PRIVATE_BANK',
      name: 'FPO Warehouse Receipt Loan',
      code: 'ICICI-WHR-POSTHARVEST',
      purpose: 'CROP_ACTIVITY',
      minAmount: 50000,
      maxAmount: 2000000,
      minTenureMonths: 3,
      maxTenureMonths: 12,
      indicativeInterestRate: 8.25,
      description: 'Liquidity financing against pledged harvested produce stored in verified FPO aggregation warehouses.',
    },
  ];

  // Applications state
  const [applications, setApplications] = useState<FinancingApplication[]>([
    {
      id: 'fin-app-9901',
      productName: 'Kisan Seasonal Crop Working Capital',
      partnerName: 'State Bank of India',
      applicationNumber: 'APP-2026-SBI-8801',
      requestedAmount: 80000,
      approvedAmount: 80000,
      interestRatePerAnnum: 7.0,
      tenureMonths: 12,
      status: 'APPROVED',
      submittedAt: '2026-01-12',
      externalReference: 'SBI-AGRI-882194',
      decisionNotes: 'Application sanctioned under Kisan Credit Line scheme for Kharif Bt-Cotton crop cycle.',
    },
  ]);

  // Repayments state
  const [repayments, setRepayments] = useState<RepaymentItem[]>([
    {
      id: 'rep-01',
      applicationId: 'fin-app-9901',
      installmentNumber: 1,
      dueDate: '2026-02-12',
      amount: 6940,
      principalComponent: 6473,
      interestComponent: 467,
      status: 'PAID',
      paidAt: '2026-02-10',
      externalReference: 'UPI-SBI-REP-900214',
    },
    {
      id: 'rep-02',
      applicationId: 'fin-app-9901',
      installmentNumber: 2,
      dueDate: '2026-03-12',
      amount: 6940,
      principalComponent: 6511,
      interestComponent: 429,
      status: 'UPCOMING',
    },
    {
      id: 'rep-03',
      applicationId: 'fin-app-9901',
      installmentNumber: 3,
      dueDate: '2026-04-12',
      amount: 6940,
      principalComponent: 6549,
      interestComponent: 391,
      status: 'UPCOMING',
    },
  ]);

  // Modal State for New Financing Application
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FinancingProduct>(financingProducts[0]);
  const [applyAmount, setApplyAmount] = useState('80000');
  const [applyTenure, setApplyTenure] = useState('12');
  const [consentGrantedForApply, setConsentGrantedForApply] = useState(true);

  // Totals calculation
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const netPlatformActivity = totalIncome - totalExpense;

  // Revoke Consent Handler
  const handleRevokeConsent = (consentId: string) => {
    setConsents((prev) =>
      prev.map((c) =>
        c.id === consentId
          ? {
              ...c,
              status: 'REVOKED' as const,
              auditTrail: [
                ...c.auditTrail,
                {
                  timestamp: new Date().toLocaleString(),
                  action: 'CONSENT_REVOKED',
                  details: 'User revoked third-party data sharing access.',
                },
              ],
            }
          : c
      )
    );
  };

  // Pay Repayment Handler
  const handlePayRepayment = (repId: string) => {
    setRepayments((prev) =>
      prev.map((r) =>
        r.id === repId
          ? {
              ...r,
              status: 'PAID' as const,
              paidAt: new Date().toISOString().split('T')[0],
              externalReference: `UPI-SBI-${Date.now().toString().slice(-6)}`,
            }
          : r
      )
    );
  };

  // Submit Application Handler
  const handleSubmitApplication = () => {
    const newApp: FinancingApplication = {
      id: `fin-app-${Date.now().toString(36)}`,
      productName: selectedProduct.name,
      partnerName: selectedProduct.partnerName,
      applicationNumber: `APP-2026-${selectedProduct.partnerName.substring(0, 3).toUpperCase()}-${Date.now()
        .toString()
        .slice(-4)}`,
      requestedAmount: parseInt(applyAmount) || 50000,
      approvedAmount: parseInt(applyAmount) || 50000,
      interestRatePerAnnum: selectedProduct.indicativeInterestRate,
      tenureMonths: parseInt(applyTenure) || 12,
      status: 'APPROVED',
      submittedAt: new Date().toISOString().split('T')[0],
      externalReference: `BANK-REF-${Date.now().toString(36).toUpperCase()}`,
      decisionNotes: 'Instant in-principle approval sanctioned based on verified platform crop history.',
    };

    setApplications((prev) => [newApp, ...prev]);
    setShowApplyModal(false);
    setActiveTab('applications-repayments');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 border-b border-emerald-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
              ← Return to Main Grid
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-200 font-semibold">RuralConnect Financial Hub</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <Link href="/marketplace" className="hover:text-white transition">B2B Marketplace</Link>
            <Link href="/logistics" className="hover:text-white transition">Logistics</Link>
            <Link href="/knowledge" className="hover:text-white transition">Knowledge Hub</Link>
            <Link href="/ai" className="hover:text-white transition">AI Advisor</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Landmark className="w-3.5 h-3.5" /> Milestone 18 — Rural Financial Infrastructure
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                💰 Rural Financial & Credit Readiness Grid
              </h1>
              <p className="mt-2 text-sm text-emerald-100/80 max-w-2xl">
                Consented economic activity profiles • Crop cash flow accounting • Purpose-specific revocable data
                sharing • Explainable credit readiness • Regulated partner integrations
              </p>
            </div>

            {/* Persona Switcher & Non-Bank Disclaimer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-emerald-950/80 border border-emerald-600/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Non-Lender Infrastructure (Partner Underwritten)</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-1.5 flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium px-1">Role:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as FinancialRole)}
                  className="bg-slate-900 border border-slate-700 text-emerald-300 rounded px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="FARMER">👨‍🌾 Farmer (Ravi Kumar)</option>
                  <option value="TRACTOR_OWNER">🚜 Tractor Provider (Suresh Reddy)</option>
                  <option value="FPO_MANAGER">🏢 FPO Operations Lead</option>
                  <option value="SUPPLIER">🧪 Agri-Input Supplier</option>
                  <option value="BANK_UNDERWRITER">🏦 Regulated Bank Partner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-emerald-800/60">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Platform Income</span>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">₹{(totalIncome / 100000).toFixed(2)} Lakh</p>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> Verified Escrow Inflows
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Platform Expenses</span>
              <p className="text-xl font-bold text-rose-300 mt-0.5">₹{(totalExpense / 1000).toFixed(1)}k</p>
              <span className="text-[10px] text-rose-200 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Services & Inputs
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Net Platform Activity</span>
              <p className="text-xl font-bold text-amber-300 mt-0.5">
                +₹{(netPlatformActivity / 100000).toFixed(2)} Lakh
              </p>
              <span className="text-[10px] text-amber-200 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Net Economic Surplus
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Active Consents</span>
              <p className="text-xl font-bold text-cyan-300 mt-0.5">
                {consents.filter((c) => c.status === 'GRANTED').length} Granted
              </p>
              <span className="text-[10px] text-cyan-200 flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3" /> Revocable Data Scope
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Credit Readiness</span>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">STRONG</p>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1 mt-0.5">
                <Scale className="w-3 h-3" /> 86.4/100 Benchmark
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Active Credit Line</span>
              <p className="text-xl font-bold text-white mt-0.5">₹80,000</p>
              <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                <Landmark className="w-3 h-3" /> SBI Kisan Credit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>💰 Overview & Cash Flows</span>
            </button>

            <button
              onClick={() => setActiveTab('crop-economics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'crop-economics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>🌾 Crop Economics & Periods</span>
            </button>

            <button
              onClick={() => setActiveTab('consent')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'consent'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>🛡️ Data Sharing Consents</span>
            </button>

            <button
              onClick={() => setActiveTab('credit-readiness')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'credit-readiness'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-500" />
              <span>📊 Credit Readiness Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('partners-products')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'partners-products'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>🏦 Partner Financing Products</span>
            </button>

            <button
              onClick={() => setActiveTab('applications-repayments')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'applications-repayments'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>📝 Applications & Repayments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: FINANCIAL OVERVIEW & CASH FLOWS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Platform Income</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 mt-2">
                  ₹{totalIncome.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  100% verified through produce commerce & service settlements
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Platform Expenses</span>
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-rose-700 mt-2">
                  ₹{totalExpense.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 mt-1">Machinery hire, input procurement, freight haulage</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Net Economic Activity</span>
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  +₹{netPlatformActivity.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 mt-1">Surplus platform-recorded liquidity position</p>
              </div>
            </div>

            {/* Income & Expense Breakdown Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Verified Incomes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    Itemized Platform Incomes ({incomes.length})
                  </h3>
                  <span className="text-xs text-slate-500">Escrow Reconciled</span>
                </div>

                <div className="space-y-3">
                  {incomes.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-100 text-emerald-800">
                            {inc.sourceType}
                          </span>
                          <span className="text-xs text-slate-500">{inc.date}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-semibold mt-1">{inc.description}</p>
                        <span className="text-[11px] text-slate-400">Ref: {inc.referenceId}</span>
                      </div>
                      <div className="text-right font-extrabold text-emerald-700 text-sm">
                        +₹{inc.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Expenses */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    Itemized Platform Expenses ({expenses.length})
                  </h3>
                  <span className="text-xs text-slate-500">Automated Ledger</span>
                </div>

                <div className="space-y-3">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-rose-100 text-rose-800">
                            {exp.category}
                          </span>
                          <span className="text-xs text-slate-500">{exp.date}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-semibold mt-1">{exp.description}</p>
                        <span className="text-[11px] text-slate-400">Ref: {exp.referenceId}</span>
                      </div>
                      <div className="text-right font-extrabold text-rose-700 text-sm">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CROP ECONOMICS & SEASONAL ACCOUNTING */}
        {activeTab === 'crop-economics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                Seasonal Crop Accounting & Production Margin Ledger
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Per-crop and per-plot platform activity aggregation showing variable production expenditures versus
                harvest sales revenue.
              </p>
            </div>

            {/* Plot 1: Cotton Crop */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">
                      Bt-Cotton (BG-II)
                    </span>
                    <span className="text-xs text-slate-600 font-medium">Kharif 2025-26 Season • 5.0 Acres</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Alpha Sector 5-Acre Black Cotton Plot</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500">Estimated Net Contribution</span>
                  <div className="text-xl font-extrabold text-emerald-700 mt-0.5">+₹22,13,276</div>
                  <span className="text-[11px] text-emerald-600">₹4,42,655 / Acre Margin</span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Land Prep & Machinery</span>
                  <div className="text-base font-bold text-slate-900 mt-1">₹4,750</div>
                  <span className="text-[10px] text-slate-400">Rotavator (Suresh Reddy)</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Seeds & Inputs</span>
                  <div className="text-base font-bold text-slate-900 mt-1">₹8,200</div>
                  <span className="text-[10px] text-slate-400">Neem Urea & Zinc</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Logistics Freight</span>
                  <div className="text-base font-bold text-slate-900 mt-1">₹823.40</div>
                  <span className="text-[10px] text-slate-400">5-Ton Tipper Haulage</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-700">Gross Produce Sales</span>
                  <div className="text-base font-bold text-emerald-800 mt-1">₹22,27,050</div>
                  <span className="text-[10px] text-emerald-600">300 Quintals @ ₹7,350/Q</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL DATA CONSENT MANAGER */}
        {activeTab === 'consent' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  Financial Data Ownership & Privacy Consent Portal
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  You have full ownership of your data. Share only purpose-specific, time-bounded data with regulated
                  lenders. Revoke access at any time.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-800">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Zero Data Selling Policy</span>
              </div>
            </div>

            {/* Consent Cards List */}
            <div className="space-y-4">
              {consents.map((consent) => (
                <div
                  key={consent.id}
                  className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                    consent.status === 'GRANTED' ? 'border-emerald-300' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            consent.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {consent.status}
                        </span>
                        <span className="text-xs font-bold text-slate-700">Purpose: {consent.purpose}</span>
                        <span className="text-xs text-slate-400">• Granted: {consent.grantedAt}</span>
                        <span className="text-xs text-slate-400">• Expires: {consent.expiresAt}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{consent.partnerName}</h3>

                      {/* Scopes */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-xs font-semibold text-slate-500">Authorized Data Scope:</span>
                        {consent.scope.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200"
                          >
                            ✓ {s.replace('_', ' ')}
                          </span>
                        ))}
                      </div>

                      {/* Audit Log */}
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <span className="font-semibold text-slate-400 block">Immutable Audit Trail:</span>
                        {consent.auditTrail.map((log, lIdx) => (
                          <div key={lIdx} className="text-[11px]">
                            • <span className="font-medium text-slate-700">{log.timestamp}</span>: {log.details}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {consent.status === 'GRANTED' ? (
                        <button
                          onClick={() => handleRevokeConsent(consent.id)}
                          className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" /> Revoke Consent Immediately
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold">
                          Access Revoked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CREDIT READINESS & ACTIVITY PROFILE */}
        {activeTab === 'credit-readiness' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-emerald-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                    <Scale className="w-3.5 h-3.5" /> Explainable Activity Indicators
                  </div>
                  <h2 className="text-2xl font-extrabold">Financial Activity Profile: STRONG</h2>
                  <p className="text-xs text-emerald-200 mt-1">
                    Based strictly on 18 months of platform-recorded transactions, produce trade, and escrow settlements.
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-xl text-center min-w-[140px] border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Composite Index</span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">86.4 / 100</div>
                </div>
              </div>

              {/* Regulatory Notice Banner */}
              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 text-xs text-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  Regulatory Notice: RuralConnect is not a lender or credit rating agency. This activity profile is
                  informational for partner banks.
                </span>
              </div>
            </div>

            {/* Indicator Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Transaction History',
                  rating: 'STRONG',
                  score: 92,
                  rationale: '74 completed verified transactions over 18 months on platform.',
                  source: 'Platform transaction ledger',
                },
                {
                  title: 'Income Stability',
                  rating: 'STRONG',
                  score: 85,
                  rationale: '12 seasonal produce sales batches settled through marketplace escrow.',
                  source: 'B2B Trade settlements',
                },
                {
                  title: 'Service & Labor Utilization',
                  rating: 'EXCELLENT',
                  score: 95,
                  rationale: '8 machinery bookings fulfilled with 100% on-time execution.',
                  source: 'Booking & Dispatch records',
                },
                {
                  title: 'Payment & Escrow Reliability',
                  rating: 'EXCELLENT',
                  score: 98,
                  rationale: '98.4% on-time settlement rate with zero payment defaults.',
                  source: 'Escrow Vault logs',
                },
                {
                  title: 'Profile & Land Verification',
                  rating: 'EXCELLENT',
                  score: 100,
                  rationale: 'Tier 4 verified identity (Aadhaar, geo-spatial field boundary).',
                  source: 'Spatial Location & Identity Master',
                },
                {
                  title: 'Dispute Activity',
                  rating: 'EXCELLENT',
                  score: 100,
                  rationale: '0 outstanding disputes or chargebacks recorded.',
                  source: 'Trust & Dispute Engine',
                },
              ].map((ind, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">{ind.title}</span>
                      <span className="px-2 py-0.5 text-xs font-extrabold rounded bg-emerald-100 text-emerald-800">
                        {ind.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-2">{ind.rationale}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: {ind.source}</span>
                    <span className="font-bold text-slate-700">{ind.score}/100</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('partners-products')}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-2 shadow-sm"
              >
                <span>Explore Regulated Financing Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: REGULATED FINANCIAL PARTNERS & PRODUCTS */}
        {activeTab === 'partners-products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  Regulated Partner Financing Catalog
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Credit products from RBI-regulated Public Banks, NBFCs, and Cooperatives tailored for farmers and
                  rural service providers.
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {financingProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-800">
                        {prod.partnerName}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {prod.indicativeInterestRate}% p.a. Indicative
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">{prod.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{prod.description}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block">Credit Limit:</span>
                        <span className="font-bold text-slate-800">
                          ₹{prod.minAmount.toLocaleString('en-IN')} – ₹{prod.maxAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tenure:</span>
                        <span className="font-bold text-slate-800">
                          {prod.minTenureMonths} to {prod.maxTenureMonths} Months
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Code: {prod.code}</span>
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setShowApplyModal(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                    >
                      Apply with Consented Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: APPLICATIONS & REPAYMENTS */}
        {activeTab === 'applications-repayments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                Active Financing Applications & Installment Repayment Schedule
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Real-time status of submitted partner loan applications and upcoming EMI repayment installments.
              </p>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {app.status}
                        </span>
                        <span className="text-xs font-bold text-slate-700">App No: {app.applicationNumber}</span>
                        <span className="text-xs text-slate-400">• Submitted: {app.submittedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {app.productName} ({app.partnerName})
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500">Sanctioned Amount</span>
                      <div className="text-xl font-extrabold text-emerald-700">
                        ₹{(app.approvedAmount || app.requestedAmount).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {app.interestRatePerAnnum}% p.a. • {app.tenureMonths} Months
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">Partner Underwriting Notes: </span>
                    <span>{app.decisionNotes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Repayments Schedule Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Monthly EMI Repayment Schedule</h3>
                  <p className="text-xs text-slate-500">Application: APP-2026-SBI-8801 (State Bank of India)</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {repayments.map((rep) => (
                  <div key={rep.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Installment #{rep.installmentNumber}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            rep.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rep.status}
                        </span>
                        <span className="text-xs text-slate-500">Due Date: {rep.dueDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Principal: ₹{rep.principalComponent.toLocaleString('en-IN')} | Interest: ₹
                        {rep.interestComponent.toLocaleString('en-IN')}
                        {rep.externalReference && ` | Ref: ${rep.externalReference}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-slate-900">₹{rep.amount.toLocaleString('en-IN')}</span>
                      {rep.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayRepayment(rep.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm"
                        >
                          Pay EMI via UPI
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200 flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  {selectedProduct.partnerName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requested Amount (₹)</label>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requested Tenure (Months)</label>
                <select
                  value={applyTenure}
                  onChange={(e) => setApplyTenure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-bold"
                >
                  <option value="6">6 Months (Single Season)</option>
                  <option value="12">12 Months (Annual Cycle)</option>
                  <option value="24">24 Months (Two-Year Term)</option>
                </select>
              </div>

              {/* Explicit Consent Agreement */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={consentGrantedForApply}
                    onChange={(e) => setConsentGrantedForApply(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <label className="text-[11px] text-slate-700 leading-tight">
                    I grant explicit consent to share my verified platform transaction history, farm acreage (5.0
                    acres), and produce sales with{' '}
                    <span className="font-bold text-slate-900">{selectedProduct.partnerName}</span> for underwriting
                    appraisal purposes. This consent is revocable at any time.
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={!consentGrantedForApply}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                Submit Application to Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
