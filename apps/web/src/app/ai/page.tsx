'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Tractor,
  Layers,
  DollarSign,
  Calendar,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  structuredData?: {
    intent: string;
    activity?: string;
    area?: number;
    resource?: string;
    attachment?: string;
    date?: string;
    requiresConfirmation?: boolean;
  };
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<'ASSISTANT' | 'PLANNER' | 'RECOMMENDATIONS' | 'PRICING' | 'MARKETPLACE_AI'>('ASSISTANT');
  
  // Chat state
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confirmedRequest, setConfirmedRequest] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'UP' | 'DOWN'>>({});

  // Pricing calculator state
  const [calcAcres, setCalcAcres] = useState(3);
  const [calcActivity, setCalcActivity] = useState<'ROTAVATING' | 'PLOUGHING' | 'SPRAYING'>('ROTAVATING');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Namaste Ravi garu! I am your RuralConnect Farm & Marketplace AI Assistant. How can I assist with your 5-acre cotton farm today?',
      time: '10:00 AM',
    },
  ]);

  const quickPrompts = [
    'Tomorrow morning I need a tractor with rotavator for 3 acres.',
    'I have 5 acres of cotton. What work should I plan next?',
    'Which tractor is best suited for my land preparation?',
    'How much will rotavating 4 acres cost in Tangipalli?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: ChatMessage;

      if (lower.includes('tractor') || lower.includes('rotavator') || lower.includes('plough')) {
        const areaMatch = text.match(/(\d+)\s*(acre|acres)/i);
        const area = areaMatch ? parseInt(areaMatch[1], 10) : 3;

        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: `I understood that you need a **Tractor with Rotavator** for **${area} acres** on tomorrow morning. I have prepared the structured requirement for your confirmation.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredData: {
            intent: 'CREATE_WORK_REQUEST',
            activity: 'ROTAVATING',
            area,
            resource: 'TRACTOR (45-55 HP)',
            attachment: 'ROTAVATOR (36-42 Blades)',
            date: 'Tomorrow, 7:00 AM',
            requiresConfirmation: true,
          },
        };
      } else if (lower.includes('plan') || lower.includes('cotton') || lower.includes('what work')) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Based on your 5-acre Cotton crop plan at Tangipalli (currently Day 42 - Vegetative Growth Stage), here are the top recommended upcoming tasks:\n\n1. 🔴 **Bollworm Pest Spraying** (Priority: HIGH) — Recommended: Power Sprayer + Certified Operator\n2. 🟡 **Top-Dressing Fertilization** (Priority: MEDIUM) — Recommended: Urea 46% N (5 bags)',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (lower.includes('cost') || lower.includes('price')) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: '📊 **AI Price Estimate**: For 3-4 acres of Rotavating in Guntur rural cluster, the estimated rate is **₹1,980 – ₹2,420** (Median ₹2,200) including implement calibration and standard transit within 15 km.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        reply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I can assist you with farm planning, tractor & equipment search, statistical cost estimates, and fertilizer availability. Feel free to ask or pick a suggestion below!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const handleConfirmRequest = () => {
    setConfirmedRequest('REQ-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleFeedback = (recId: string, type: 'UP' | 'DOWN') => {
    setFeedbackGiven((prev) => ({ ...prev, [recId]: type }));
  };

  // Price estimate calculations
  const calculatePrice = () => {
    let base = calcActivity === 'ROTAVATING' ? 950 : calcActivity === 'PLOUGHING' ? 900 : 600;
    const median = base * calcAcres + 350;
    return {
      min: Math.round(median * 0.9),
      max: Math.round(median * 1.1),
      median,
    };
  };
  const price = calculatePrice();

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090E1B]/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  RuralConnect <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">AI 4.0</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono">Farm & Marketplace Intelligence</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500 transition"
            >
              ← Main Cockpit
            </Link>
          </div>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className="border-b border-slate-800 bg-[#090E1B]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'ASSISTANT', label: '💬 AI Farm Assistant', icon: Bot },
            { id: 'PLANNER', label: '🌾 Farm Planning Intelligence', icon: Calendar },
            { id: 'RECOMMENDATIONS', label: '🚜 Resource Recommendations', icon: Tractor },
            { id: 'PRICING', label: '💰 AI Cost Estimator', icon: DollarSign },
            { id: 'MARKETPLACE_AI', label: '📊 Market & Supply Forecasts', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* GUARDRAIL SAFETY BANNER */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Milestone 13 AI Guardrails Active:</strong> AI assists decisions with live database retrieval. Critical actions (financial ledger changes, payments, settlements, and bookings) require explicit human confirmation.
            </span>
          </div>
          <span className="hidden md:inline px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
            ZERO AUTONOMOUS MUTATIONS
          </span>
        </div>

        {/* TAB 1: AI FARM ASSISTANT CHAT */}
        {activeTab === 'ASSISTANT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CHAT WINDOW */}
            <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex flex-col h-[640px] shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      RuralConnect Conversational AI
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Connected to: Tangipalli Field (5.0 ac Cotton)</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                  Retrieval Engine Active
                </span>
              </div>

              {/* MESSAGE STREAM */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-slate-950 font-semibold rounded-br-none shadow-md'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'
                      }`}
                    >
                      <div className="text-[10px] opacity-60 mb-1 flex items-center justify-between gap-4">
                        <span>{m.sender === 'user' ? '👨🌾 Farmer Ravi' : '🤖 RuralConnect AI'}</span>
                        <span>{m.time}</span>
                      </div>
                      <div className="whitespace-pre-line font-sans text-xs">{m.text}</div>

                      {/* STRUCTURED INTENT CONFIRMATION CARD */}
                      {m.structuredData?.requiresConfirmation && (
                        <div className="mt-4 pt-3 border-t border-slate-700 font-mono text-xs bg-slate-950/70 p-3.5 rounded-xl border space-y-2">
                          <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Confirmation Required
                            </span>
                            <span className="text-slate-400 text-[10px]">Intent: CREATE_WORK_REQUEST</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                            <div>Activity: <strong className="text-white">{m.structuredData.activity}</strong></div>
                            <div>Area: <strong className="text-white">{m.structuredData.area} Acres</strong></div>
                            <div>Machine: <strong className="text-white">{m.structuredData.resource}</strong></div>
                            <div>Implement: <strong className="text-white">{m.structuredData.attachment}</strong></div>
                          </div>

                          {confirmedRequest ? (
                            <div className="bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-lg text-emerald-300 font-bold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Request Confirmed! Work Request #{confirmedRequest} sent to matching engine.</span>
                            </div>
                          ) : (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={handleConfirmRequest}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                              >
                                <Check className="w-4 h-4" />
                                Confirm & Dispatch to Matching
                              </button>
                              <button
                                onClick={() => setInputQuery('Edit requirement: ')}
                                className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    <span>AI is retrieving farm context & analyzing intent...</span>
                  </div>
                )}
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="py-2 flex gap-1.5 overflow-x-auto border-t border-slate-800/80">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg whitespace-nowrap transition border border-slate-700/60"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask in English or Telugu (e.g., 'Need tractor for rotavator 3 acres tomorrow')..."
                  className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition"
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SIDEBAR CONTEXT & TOOLS */}
            <div className="lg:col-span-4 space-y-4">
              {/* CURRENT RETRIEVED FARM CONTEXT */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Retrieved Farm Context
                  </h4>
                  <span className="text-[10px] text-slate-400">ID: farm-001</span>
                </div>

                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Farm:</span>
                    <span className="text-white font-bold">Ravi Krishna Lands</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-emerald-400 font-bold">Tangipalli, Guntur</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Acreage:</span>
                    <span className="text-white font-bold">5.0 Acres (Surveyed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Crop:</span>
                    <span className="text-amber-400 font-bold">Bt-Cotton Hybrid-6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soil Moisture:</span>
                    <span className="text-cyan-400 font-bold">28% (Optimal)</span>
                  </div>
                </div>
              </div>

              {/* AI TOOLS STATUS */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 space-y-3 font-mono text-xs">
                <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Authorized AI Tools
                </h4>

                <div className="space-y-1.5 text-[11px]">
                  {[
                    { name: 'getFarmContext()', desc: 'Plot & soil telemetry', status: 'ALLOW' },
                    { name: 'getUpcomingActivities()', desc: 'Crop stage timeline', status: 'ALLOW' },
                    { name: 'searchResources()', desc: 'Deterministic matching', status: 'ALLOW' },
                    { name: 'createWorkRequest()', desc: 'Requires farmer confirm', status: 'CONFIRM' },
                    { name: 'executePayment()', desc: 'Strictly blocked', status: 'BLOCK' },
                  ].map((tool, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div>
                        <div className="text-slate-200 font-bold">{tool.name}</div>
                        <div className="text-[10px] text-slate-500">{tool.desc}</div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          tool.status === 'ALLOW'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tool.status === 'CONFIRM'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tool.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FARM PLANNING INTELLIGENCE */}
        {activeTab === 'PLANNER' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    AI Farm Planning & Activity Schedule
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Target: 5.0 Acres Bt-Cotton Hybrid-6 • Kharif Season 2026
                  </p>
                </div>
                <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold font-mono hover:bg-emerald-500/30 transition flex items-center gap-2 self-start">
                  <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate Growth Stage
                </button>
              </div>

              {/* SUGGESTED ACTIVITIES CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'act-1',
                    title: '🔴 Critical Pest Management Spraying',
                    stage: 'Stage 4: Boll Formation Protection (Day 45-55)',
                    priority: 'HIGH',
                    reason: 'Optimal 45-day window for bollworm protection in Bt-Cotton crop.',
                    equipment: '500L Power Sprayer (HTP-35)',
                    worker: 'Certified Sprayer Operator',
                    input: 'Coragen (Chlorantraniliprole) 300 ml',
                    supplier: 'Kisan Krishi Kendra (4.2 km)',
                  },
                  {
                    id: 'act-2',
                    title: '🟡 Secondary Nitrogen Top-Dressing',
                    stage: 'Stage 5: Vegetative Boost (Day 60-70)',
                    priority: 'MEDIUM',
                    reason: 'Top dressing stage for vegetative vigor and boll size enhancement.',
                    equipment: 'Standard Manual Application',
                    worker: 'Farm Labor (2 Workers)',
                    input: 'Urea 46% N (5 Bags / 225 kg)',
                    supplier: 'Rythu Seva Kendram (6.1 km)',
                  },
                ].map((item) => (
                  <div key={item.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{item.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.priority} PRIORITY
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs font-sans leading-relaxed">{item.reason}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span>🚜 Equipment:</span>
                        <span className="text-white font-bold">{item.equipment}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>👷 Labor:</span>
                        <span className="text-cyan-400 font-bold">{item.worker}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>🧪 Input Required:</span>
                        <span className="text-emerald-400 font-bold">{item.input}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => alert(`Activity '${item.title}' added to farm plan!`)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Add to Farm Plan
                      </button>
                      <button
                        onClick={() => setActiveTab('ASSISTANT')}
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPLAINABLE RESOURCE RECOMMENDATIONS */}
        {activeTab === 'RECOMMENDATIONS' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-emerald-400" />
                  Explainable Resource Recommendations
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Backed by deterministic 2-stage matching (Capability + Radius + Reliability)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'rec-1',
                    model: 'Mahindra 575 DI (50 HP)',
                    provider: 'Suresh Reddy',
                    distance: '3.8 km away',
                    rating: 4.8,
                    jobsDone: 96,
                    attachment: 'Rotavator (42-Blade) Attached',
                    confidence: 'HIGH',
                    reasons: [
                      '✓ 50 HP exceeds 45 HP threshold for 5-acre deep rotavation',
                      '✓ Certified 42-blade rotavator attached and calibrated',
                      '✓ Located 3.8 km away (well within 15 km service radius)',
                      '✓ 96% completion rate with 0 no-show incidents',
                    ],
                  },
                  {
                    id: 'rec-2',
                    model: 'John Deere 5050D (50 HP)',
                    provider: 'K. Venkat Rao',
                    distance: '6.2 km away',
                    rating: 4.9,
                    jobsDone: 114,
                    attachment: 'Laser Leveler + Heavy Rotavator',
                    confidence: 'HIGH',
                    reasons: [
                      '✓ High power dual-clutch transmission for tough black soil',
                      '✓ Dual implements ready for combo deployment',
                      '✓ ★ 4.9 top-tier provider in Tangipalli Mandal',
                      '✓ Direct UPI settlement enabled',
                    ],
                  },
                ].map((card) => (
                  <div key={card.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-white text-sm">{card.model}</h4>
                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2 font-sans">
                          <span>Owner: {card.provider}</span> • <span className="text-emerald-400">{card.distance}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-bold">
                        ★ {card.rating} ({card.jobsDone} jobs)
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        AI Match Explanation:
                      </div>
                      {card.reasons.map((r, i) => (
                        <div key={i} className="text-slate-300 text-[11px] font-sans">
                          {r}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Helpful?</span>
                        <button
                          onClick={() => handleFeedback(card.id, 'UP')}
                          className={`p-1.5 rounded-lg border transition ${
                            feedbackGiven[card.id] === 'UP' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(card.id, 'DOWN')}
                          className={`p-1.5 rounded-lg border transition ${
                            feedbackGiven[card.id] === 'DOWN' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        href="/"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1"
                      >
                        <span>Select Tractor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI PRICE ESTIMATOR */}
        {activeTab === 'PRICING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            <div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Statistical Price Range Estimator
              </h3>

              <div className="space-y-2">
                <label className="text-slate-400 block text-[11px]">Select Farm Activity</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ROTAVATING', label: 'Rotavation' },
                    { id: 'PLOUGHING', label: 'Ploughing' },
                    { id: 'SPRAYING', label: 'Spraying' },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setCalcActivity(op.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition font-bold ${
                        calcActivity === op.id ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Area (Acres):</span>
                  <span className="text-emerald-400 font-bold">{calcAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={calcAcres}
                  onChange={(e) => setCalcAcres(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded cursor-pointer"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                💡 <em>Price estimation uses regional historical median completed bookings in Guntur cluster (+/- 10% tolerance band). Final price is confirmed upon provider quote acceptance.</em>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  AI Estimated Range
                </span>
                <div className="text-3xl font-black text-white mt-3 font-sans">
                  ₹{price.min.toLocaleString()} – ₹{price.max.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">Median Estimate: ₹{price.median.toLocaleString()}</p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Base Machine Tariff:</span>
                  <span className="text-white">₹{(price.median - 350).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Transit Allowance (&lt;5 km):</span>
                  <span className="text-white">₹350</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Escrow Guarantee Fee:</span>
                  <span className="text-emerald-400">Included (Free)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('ASSISTANT');
                  handleSend(`I need a quote for ${calcActivity.toLowerCase()} ${calcAcres} acres`);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition text-center shadow-lg shadow-emerald-500/20"
              >
                Request Quotations with This Estimate →
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN & MARKETPLACE PREDICTIVE INTELLIGENCE */}
        {activeTab === 'MARKETPLACE_AI' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Marketplace Predictive Intelligence & Supply Gap Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cluster-wide forecasts for Guntur District (Next 30 Days)
                </p>
              </div>

              {/* DEMAND FORECAST METRICS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'TRACTOR DEMAND', value: '1,416 Reqs', change: '+18.0%', trend: 'up' },
                  { label: 'SPRAYER DEMAND', value: '890 Reqs', change: '+30.9%', trend: 'up' },
                  { label: 'SKILLED WORKERS', value: '1,052 Reqs', change: '+11.9%', trend: 'up' },
                  { label: 'WATER PUMPS', value: '242 Reqs', change: '+10.0%', trend: 'up' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400">{stat.label}</span>
                    <div className="text-lg font-bold text-white font-sans">{stat.value}</div>
                    <span className="text-[10px] font-bold text-emerald-400">{stat.change} vs Last Month</span>
                  </div>
                ))}
              </div>

              {/* SUPPLY GAPS WARNINGS */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Detected Regional Supply Gaps & Actionable Shortages
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">Tenali Mandal (Cluster X)</span>
                      <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded text-[10px] font-bold">
                        HIGH SHORTAGE RISK
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px] space-y-1">
                      <div>Expected Demand: <strong className="text-white">100 Tractors</strong></div>
                      <div>Available Suitable Supply: <strong className="text-white">63 Tractors</strong></div>
                      <div className="text-rose-400 font-bold">Potential Deficit: 37 Tractors (Rotavators)</div>
                    </div>
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 font-sans">
                      💡 <strong>Admin Action:</strong> Recruit 35+ rotavator-equipped tractor owners in Tenali perimeter to balance Kharif land prep demand.
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">Urea 46% N Stock Risk</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-bold">
                        SUPPLIER STOCKOUT WARNING
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px] space-y-1">
                      <div>Current Aggregate Stock: <strong className="text-white">180 Bags</strong></div>
                      <div>Projected 7-Day Demand: <strong className="text-white">220 Bags</strong></div>
                      <div className="text-amber-400 font-bold">Projected Deficit: 40 Bags</div>
                    </div>
                    <div className="text-[11px] text-cyan-400 bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20 font-sans">
                      💡 <strong>Supplier Alert:</strong> Automated notification dispatched to 4 local Agri-input suppliers to restock from central distributor.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

