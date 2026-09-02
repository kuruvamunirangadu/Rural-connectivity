'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronLeft, ShieldCheck, Send } from 'lucide-react';

export default function FuturisticSupplierPage() {
  const [inventory] = useState([
    { id: 'inv-1', name: 'Neem Coated Urea (45kg Bag)', category: 'Fertilizer', stock: 350, price: 266.5, status: 'In Stock' },
    { id: 'inv-2', name: 'DAP 18:46:0 (50kg Bag)', category: 'Fertilizer', stock: 180, price: 1350.0, status: 'In Stock' },
    { id: 'inv-3', name: 'Cotton Hybrid-6 Seeds (450g)', category: 'Hybrid Seeds', stock: 95, price: 850.0, status: 'Low Stock' },
    { id: 'inv-4', name: 'Zinc Sulphate 33% (1kg)', category: 'Micronutrient', stock: 120, price: 140.0, status: 'In Stock' },
  ]);

  const [rfqs, setRfqs] = useState([
    { id: 'rfq-01', farmer: 'Ravi Kumar', village: 'Tangipalli', distance: '2.5 km', request: '10x Neem Urea Bags, 2x Zinc 1kg', estimate: '₹2,945', status: 'PENDING' },
    { id: 'rfq-02', farmer: 'B. Venkat', village: 'Malkapur', distance: '4.8 km', request: '5x DAP 50kg Bags', estimate: '₹6,750', status: 'PENDING' },
  ]);

  const handleSendQuote = (id: string) => {
    setRfqs(rfqs.map((r) => (r.id === id ? { ...r, status: 'QUOTED' } : r)));
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
          <Package className="w-6 h-6 text-teal-400 animate-pulse" />
          Agri-Input Supplier & Licensed Hub Command
        </h1>
        <p className="text-xs text-slate-400">
          Manage certified fertilizer stock, hybrid seeds, regulatory compliance licenses, and farmer RFQs.
        </p>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Inventory Stock</span>
          <p className="text-2xl font-black text-teal-400 mt-1">745 Units</p>
          <span className="text-[11px] text-emerald-400">4 Active Categories</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Pending Inquiries</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{rfqs.length} Farmer RFQs</p>
          <span className="text-[11px] text-slate-400">Tandur Mandal</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Regulatory License</span>
          <p className="text-xl font-black text-emerald-400 mt-1">TS/VKR/042</p>
          <span className="text-[11px] text-slate-400">Verified Dealer</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-500 block uppercase">Delivery Radius</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">20 km</p>
          <span className="text-[11px] text-emerald-400">Drone + Vehicle Routing</span>
        </div>
      </div>

      {/* License Badges */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 relative z-10 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Regulatory Dealer Licenses</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">FERTILIZER LICENSE</span>
            <span className="text-emerald-400 font-bold block">TS/VKR/FERT/2023/042</span>
            <span className="text-[10px] text-slate-400">Dept. of Agriculture, Telangana</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">SEED DEALER LICENSE</span>
            <span className="text-emerald-400 font-bold block">TS/VKR/SEED/2022/118</span>
            <span className="text-[10px] text-slate-400">Valid Thru 2027</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">GSTIN COMPLIANCE</span>
            <span className="text-cyan-400 font-bold block">36AABCS1234F1Z8</span>
            <span className="text-[10px] text-slate-400">Active Taxpayer Status</span>
          </div>
        </div>
      </div>

      {/* Product Catalog */}
      <div className="space-y-3 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Inventory & Live Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map((item) => (
            <div key={item.id} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-teal-400 block">{item.category}</span>
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                  ₹{item.price}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Units in Stock: <strong className="text-white">{item.stock} Units</strong></span>
                <span className={item.stock < 100 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming RFQs */}
      <div className="space-y-3 relative z-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Nearby Farmer Inquiries & RFQs</h2>
        <div className="space-y-3">
          {rfqs.map((r) => (
            <div key={r.id} className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-bold">
                    {r.id}
                  </span>
                  <h3 className="text-base font-bold text-white">{r.farmer}</h3>
                  <span className="text-slate-400">({r.village} • {r.distance})</span>
                </div>
                <p className="text-slate-300">Items Requested: {r.request}</p>
                <span className="text-emerald-400 font-bold block">Quotation Subtotal: {r.estimate}</span>
              </div>

              {r.status === 'QUOTED' ? (
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold">
                  ✓ QUOTE SENT TO FARMER
                </span>
              ) : (
                <button
                  onClick={() => handleSendQuote(r.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT QUOTE & CONFIRM STOCK</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
