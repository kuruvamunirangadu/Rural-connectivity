'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radar,
  Cpu,
  Zap,
  Activity,
  Radio,
  Satellite,
  ShieldCheck,
  Sparkles,
  Layers,
  Package,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  ArrowUpRight,
  Send,
  Lock,
  Wifi,
  Droplets,
  Sun,
  Wind,
  Globe,
  Play,
  Volume2,
  Users,
  Wrench,
  Calendar,
  DollarSign,
  AlertTriangle,
  Plus,
  Building2,
  Truck,
  ShoppingBag,
  BookOpen,
  Landmark,
} from 'lucide-react';

export type RoleType = 'FARMER' | 'TRACTOR_OWNER' | 'CONTRACTOR' | 'SKILLED_WORKER' | 'SUPPLIER' | 'EQUIPMENT_OWNER';

interface PersonaProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  activeRole: RoleType;
  roles: RoleType[];
}

const PERSONAS: Record<RoleType, PersonaProfile> = {
  FARMER: {
    id: 'usr-ravi-001',
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    village: 'Tangipalli',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'FARMER',
    roles: ['FARMER', 'TRACTOR_OWNER', 'CONTRACTOR'],
  },
  TRACTOR_OWNER: {
    id: 'usr-suresh-002',
    name: 'Suresh Reddy',
    phone: '+91 98481 12233',
    village: 'Tangipalli North',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'TRACTOR_OWNER',
    roles: ['TRACTOR_OWNER', 'FARMER'],
  },
  CONTRACTOR: {
    id: 'usr-contractor-003',
    name: 'M. Anjaneyulu (Sri Sai Logistics)',
    phone: '+91 98482 99001',
    village: 'Tandur Town',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'CONTRACTOR',
    roles: ['CONTRACTOR', 'FARMER'],
  },
  SKILLED_WORKER: {
    id: 'usr-laxman-004',
    name: 'Laxman Naik',
    phone: '+91 98483 44556',
    village: 'Kotbaspalli',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'SKILLED_WORKER',
    roles: ['SKILLED_WORKER'],
  },
  SUPPLIER: {
    id: 'usr-supplier-005',
    name: 'M. Srinivas Reddy (Sri Venkateshwara Hub)',
    phone: '+91 98484 77889',
    village: 'Tandur Market Yard',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'SUPPLIER',
    roles: ['SUPPLIER'],
  },
  EQUIPMENT_OWNER: {
    id: 'usr-equipment-006',
    name: 'K. Balaji (Balaji Agri-Tech)',
    phone: '+91 98485 11223',
    village: 'Malkapur',
    mandal: 'Tandur',
    district: 'Vikarabad',
    activeRole: 'EQUIPMENT_OWNER',
    roles: ['EQUIPMENT_OWNER'],
  },
};

const NEARBY_MACHINES = [
  {
    id: 'tr-001',
    ownerName: 'Suresh Reddy',
    ownerPhone: '+91 98481 12233',
    brand: 'Mahindra',
    model: 'Arjun 550 DI Pro',
    hp: 50,
    rating: 4.9,
    jobsCompleted: 142,
    attachments: ['Rotavator', 'Plough', 'Trailer'],
    distanceKm: 3.4,
    matchScore: 98,
    status: 'ACTIVE_AVAILABLE',
    ratePerHour: 950,
    specs: { rtkGps: true, fuelLevel: '88%', engineRpm: 1850, health: '99%' },
  },
  {
    id: 'tr-002',
    ownerName: 'Ramesh Goud',
    ownerPhone: '+91 98482 23344',
    brand: 'John Deere',
    model: '5310 PowerTech',
    hp: 55,
    rating: 4.8,
    jobsCompleted: 98,
    attachments: ['Rotavator', 'Seed Drill', 'Disc Harrow'],
    distanceKm: 7.8,
    matchScore: 94,
    status: 'ACTIVE_AVAILABLE',
    ratePerHour: 1050,
    specs: { rtkGps: true, fuelLevel: '92%', engineRpm: 2100, health: '96%' },
  },
  {
    id: 'tr-003',
    ownerName: 'Venkat Rao',
    ownerPhone: '+91 98483 34455',
    brand: 'Swaraj',
    model: '735 FE Hydro',
    hp: 35,
    rating: 4.6,
    jobsCompleted: 64,
    attachments: ['Cultivator', 'Trailer'],
    distanceKm: 2.1,
    matchScore: 71,
    status: 'LIMITED_CAPACITY',
    ratePerHour: 750,
    specs: { rtkGps: false, fuelLevel: '65%', engineRpm: 1600, health: '91%' },
    reason: 'Insufficient HP (< 45 HP) for Deep Rotavation',
  },
];

const NEARBY_SUPPLIERS = [
  {
    id: 'sup-a',
    shopName: 'Sri Venkateshwara Agri-Input Hub',
    ownerName: 'M. Srinivas Reddy',
    distanceKm: 2.5,
    stockStatus: 'In Stock (350 Units)',
    deliveryDrone: true,
    pricePerBag: 266.5,
  },
  {
    id: 'sup-b',
    shopName: 'Balaji Kisan Quantum Center',
    ownerName: 'K. Balaji',
    distanceKm: 4.8,
    stockStatus: 'In Stock (120 Units)',
    deliveryDrone: false,
    pricePerBag: 270.0,
  },
  {
    id: 'sup-c',
    shopName: 'Kisan Mitra Agro-Supply Depo',
    ownerName: 'P. Naresh',
    distanceKm: 8.2,
    stockStatus: 'Low Stock (Restocking in 18h)',
    deliveryDrone: true,
    pricePerBag: 265.0,
  },
];

export default function FuturisticHome() {
  const [activeRole, setActiveRole] = useState<RoleType>('FARMER');
  const user = PERSONAS[activeRole];

  // Role-specific Tab States
  const [farmerTab, setFarmerTab] = useState<'PLOTS' | 'RADAR' | 'PRICING' | 'BOOKINGS' | 'SUPPLIES' | 'COMMS'>('RADAR');
  const [tractorTab, setTractorTab] = useState<'FLEET' | 'AVAILABILITY' | 'DISPATCH' | 'FIELD_OPS' | 'EARNINGS' | 'COMMS'>('FLEET');
  const [contractorTab, setContractorTab] = useState<'PROJECTS' | 'RESOURCES' | 'ROSTER' | 'ESCROW'>('PROJECTS');
  const [workerTab, setWorkerTab] = useState<'SKILLS' | 'AVAILABILITY' | 'JOB_OFFERS' | 'EARNINGS'>('SKILLS');
  const [supplierTab, setSupplierTab] = useState<'INVENTORY' | 'LICENSES' | 'INQUIRIES' | 'DISPATCH'>('INVENTORY');
  const [equipmentTab, setEquipmentTab] = useState<'EQUIPMENT' | 'RENTAL_RATES' | 'RENTALS' | 'EARNINGS'>('EQUIPMENT');

  const [radarDegree, setRadarDegree] = useState(0);
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Farmer Specific States
  const [farmerPlots, setFarmerPlots] = useState([
    { id: 'plot-1', name: 'Alpha Sector (North Field)', acres: 5.0, crop: 'Cotton Hybrid-6', soilMoisture: '28% Optimal', status: 'READY_FOR_ROTAVATION', village: 'Tangipalli' },
    { id: 'plot-2', name: 'Canal Basin Plot #2', acres: 3.5, crop: 'Paddy BPT-5204', soilMoisture: '34% High', status: 'IRRIGATED', village: 'Tangipalli' },
  ]);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [newPlotName, setNewPlotName] = useState('');
  const [newPlotAcres, setNewPlotAcres] = useState('4.0');
  const [newPlotCrop, setNewPlotCrop] = useState('Cotton Hybrid-6');

  // Pricing Calculator States (Farmer)
  const [calcWork, setCalcWork] = useState<'rotavator' | 'ploughing' | 'leveling' | 'seeding'>('rotavator');
  const [calcAcres, setCalcAcres] = useState(5);
  const [calcAttachment] = useState('rotavator');
  const [calcDistance, setCalcDistance] = useState(4);
  const [calcHours] = useState(6);
  const [calcPeakSeason, setCalcPeakSeason] = useState(false);

  // Booking & Live Lifecycle States (Farmer & Tractor Owner)
  const [bookingStep, setBookingStep] = useState<
    'REQUESTED' | 'MATCHED' | 'DISPATCHED' | 'IN_FIELD' | 'WORK_COMPLETED' | 'AI_AUDITED' | 'ESCROW_RELEASED'
  >('DISPATCHED');
  const [harvestedAcreage, setHarvestedAcreage] = useState(3.4);

  // Tractor Owner Specific States
  const [tractorAvailabilityRadius, setTractorAvailabilityRadius] = useState(15);
  const [minWorkAcres, setMinWorkAcres] = useState(2);
  const [isTractorAvailableToday, setIsTractorAvailableToday] = useState(true);
  const [tractorRequests, setTractorRequests] = useState([
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
    {
      id: 'wr-10002',
      farmer: 'G. Mallaiah',
      work: 'Deep Ploughing',
      area: '8.0 Acres',
      date: 'Sept 6',
      time: '6:30 AM',
      location: 'Malkapur (6.2 km)',
      offerPrice: '₹7,200',
      status: 'AWAITING_CONFIRMATION',
    },
  ]);

  // Skilled Worker Specific States
  const [workerAvailableToday, setWorkerAvailableToday] = useState(true);
  const [workerDailyRate, setWorkerDailyRate] = useState(550);
  const workerRadius = 10;
  const [workerJobOffers, setWorkerJobOffers] = useState([
    { id: 'wo-01', farmer: 'Ravi Kumar', skill: 'Sprayer Operator', crop: 'Cotton', days: 2, wage: '₹550 / day', distance: '3.4 km', status: 'PENDING' },
    { id: 'wo-02', farmer: 'S. Narsimha', skill: 'Tractor Operator', crop: 'Paddy', days: 1, wage: '₹600 / day', distance: '5.1 km', status: 'PENDING' },
  ]);

  // Supplier Specific States
  const supplierInventory = [
    { id: 'inv-1', name: 'Neem Coated Urea (45kg Bag)', category: 'Fertilizer', stock: 350, unitPrice: 266.5, status: 'In Stock' },
    { id: 'inv-2', name: 'DAP 18:46:0 (50kg Bag)', category: 'Fertilizer', stock: 180, unitPrice: 1350.0, status: 'In Stock' },
    { id: 'inv-3', name: 'Cotton Hybrid-6 Seeds (450g)', category: 'Seeds', stock: 95, unitPrice: 850.0, status: 'Low Stock' },
    { id: 'inv-4', name: 'Zinc Sulphate 33% (1kg)', category: 'Micronutrient', stock: 120, unitPrice: 140.0, status: 'In Stock' },
  ];
  const supplierRfqs = [
    { id: 'rfq-01', farmer: 'Ravi Kumar', village: 'Tangipalli', products: '10x Neem Coated Urea, 2x Zinc', totalEst: '₹2,945', status: 'AWAITING_QUOTE' },
    { id: 'rfq-02', farmer: 'B. Venkat', village: 'Malkapur', products: '5x DAP 50kg', totalEst: '₹6,750', status: 'AWAITING_QUOTE' },
  ];

  // Equipment Owner Specific States
  const equipmentList = [
    { id: 'eq-1', name: 'Aspee HTP-35 Power Sprayer', type: 'Sprayer', capacity: '35 LPM Discharge (5.5 HP)', ratePerAcre: 350, ratePerDay: 1200, bundleOperator: true, available: true },
    { id: 'eq-2', name: 'Kirloskar 7.5 HP High-Volume Pump', type: 'Water Pump', capacity: '1200 LPM Flow', ratePerAcre: 450, ratePerDay: 1500, bundleOperator: false, available: true },
    { id: 'eq-3', name: 'Neptune 16L Battery Knapsack', type: 'Sprayer', capacity: '16 Litres (12V Battery)', ratePerAcre: 150, ratePerDay: 400, bundleOperator: false, available: true },
  ];

  // Communications
  const [commChannel, setCommChannel] = useState<'in_app' | 'sms' | 'whatsapp' | 'ivr_agent'>('in_app');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'SYSTEM', text: '⚡ Autonomous Grid Locked: Booking #BK-9024 confirmed.', time: '07:00 AM' },
    { id: 2, sender: 'Suresh Reddy (Tractor Owner)', text: 'Namaskaram, Mahindra 550 DI is fueled and heading to Field #4.', time: '07:02 AM' },
    { id: 3, sender: 'Ravi Kumar (Farmer)', text: 'Please enter via the North Solar Canal gate. Soil moisture is optimal.', time: '07:05 AM' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarDegree((prev) => (prev + 4) % 360);
      setLiveSeconds((s) => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const baseRate = calcWork === 'rotavator' ? 950 : calcWork === 'ploughing' ? 900 : calcWork === 'leveling' ? 1200 : 800;
  const baseCharge = baseRate * calcAcres;
  const attachmentRate = calcAttachment === 'rotavator' ? 350 : calcAttachment === 'plough' ? 250 : 300;
  const attachmentCharge = attachmentRate * calcAcres;
  const mobKm = Math.max(0, calcDistance - 3);
  const mobCharge = mobKm * 35;
  const overtimeHours = Math.max(0, calcHours - calcAcres * 1.5);
  const overtimeCharge = overtimeHours * 450;
  const seasonMultiplier = calcPeakSeason ? 1.15 : 1.0;
  const totalCalculatedPrice = Math.round((baseCharge + attachmentCharge + mobCharge + overtimeCharge) * seasonMultiplier);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: Date.now(),
        sender: `${user.name} (${activeRole.replace('_', ' ')})`,
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const handleAddPlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotName) return;
    setFarmerPlots([
      ...farmerPlots,
      {
        id: `plot-${Date.now()}`,
        name: newPlotName,
        acres: Number(newPlotAcres),
        crop: newPlotCrop,
        soilMoisture: '27% Optimal',
        status: 'SURVEYED',
        village: user.village,
      },
    ]);
    setNewPlotName('');
    setShowAddPlot(false);
  };

  const handleAcceptJobOffer = (id: string) => {
    setWorkerJobOffers((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'ACCEPTED' } : j)));
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* BACKGROUND SCI-FI GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP GLOBAL STATUS BAR */}
      <div className="relative z-50 bg-[#090E1B]/90 backdrop-blur-2xl border-b border-emerald-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2.5" />
              <span>GEO-GRID ONLINE</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span>RTK ±1.8cm</span>
              <span className="text-slate-600">•</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>5G MESH (12ms)</span>
              <span className="text-slate-600">•</span>
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>SECTOR TG-VKR-04 ({user.mandal})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full text-slate-300 text-[11px]">
            <div className="flex items-center gap-1 text-amber-400">
              <Sun className="w-3.5 h-3.5" />
              <span>31.4°C</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-cyan-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Soil 28%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <Wind className="w-3.5 h-3.5" />
              <span>Rain Risk 4%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-0.5 rounded-full text-[11px] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TIER 4 TRUST (98.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER WITH STRICT PERSONA SELECTION */}
      <header className="relative z-40 bg-[#0B1020]/90 backdrop-blur-2xl border-b border-slate-800/80 sticky top-0 font-mono">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B1020] flex items-center justify-center text-[7px] font-black text-slate-950">
                AI
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  RuralConnect <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">OS 4.0</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Role-Dedicated Agricultural Resource & Service Grid
              </p>
            </div>
          </div>

          {/* ACTIVE PERSONA SWITCHER */}
          <div className="flex items-center gap-1.5 bg-slate-900/95 p-1 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
            <span className="text-[10px] text-slate-500 px-2 font-bold uppercase hidden lg:inline">PERSONA:</span>
            {[
              { id: 'FARMER', label: 'Farmer', icon: '🌾' },
              { id: 'TRACTOR_OWNER', label: 'Tractor Owner', icon: '🚜' },
              { id: 'CONTRACTOR', label: 'Contractor', icon: '🏗️' },
              { id: 'SKILLED_WORKER', label: 'Worker / Operator', icon: '👷' },
              { id: 'SUPPLIER', label: 'Input Supplier', icon: '🧪' },
              { id: 'EQUIPMENT_OWNER', label: 'Sprayers & Pumps', icon: '⚙️' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as RoleType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeRole === role.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}

            <Link
              href="/organization"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-cyan-300 font-bold text-xs hover:bg-indigo-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Institutional Network (FPO/Govt)</span>
            </Link>

            <Link
              href="/logistics"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Logistics & Transport Grid</span>
            </Link>

            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agri-Marketplace B2B</span>
            </Link>

            <Link
              href="/knowledge"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs hover:bg-teal-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Knowledge & Advisory Hub</span>
            </Link>

            <Link
              href="/financial"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Financial & Credit Readiness</span>
            </Link>

            <Link
              href="/ai"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition shadow-sm ml-1 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AI Intelligence Hub</span>
            </Link>
          </div>
        </div>

        {/* ROLE-SPECIFIC STRICT TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto border-t border-slate-800/60 py-2">
          {/* FARMER TABS */}
          {activeRole === 'FARMER' && (
            <>
              {[
                { id: 'PLOTS', label: '🌾 My Farmland Plots', count: `${farmerPlots.length} PLOTS` },
                { id: 'RADAR', label: '⚡ Request Machine & Labor (Radar)', count: 'LiDAR AI' },
                { id: 'PRICING', label: '💰 Dynamic Cost Calculator', count: 'ESCROW' },
                { id: 'BOOKINGS', label: '📋 My Bookings & Field Telemetry', count: bookingStep },
                { id: 'SUPPLIES', label: '🧪 Agri-Input Store', count: '3 STORES' },
                { id: 'COMMS', label: '💬 Operator Comms & IVR', count: 'TELUGU/ENG' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFarmerTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    farmerTab === tab.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    farmerTab === tab.id ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* TRACTOR OWNER TABS */}
          {activeRole === 'TRACTOR_OWNER' && (
            <>
              {[
                { id: 'FLEET', label: '🚜 Connected Fleet & Machinery', count: '2 TRACTORS' },
                { id: 'AVAILABILITY', label: '📅 Availability & Service Radius', count: `${tractorAvailabilityRadius} KM` },
                { id: 'DISPATCH', label: '⚡ Incoming Dispatch Requests', count: `${tractorRequests.length} NEW` },
                { id: 'FIELD_OPS', label: '📡 Live Field Mission', count: 'IN FIELD' },
                { id: 'EARNINGS', label: '💵 Payouts & Escrow Yield', count: '₹4,750' },
                { id: 'COMMS', label: '💬 Farmer Communication', count: 'ACTIVE' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTractorTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    tractorTab === tab.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    tractorTab === tab.id ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* CONTRACTOR TABS */}
          {activeRole === 'CONTRACTOR' && (
            <>
              {[
                { id: 'PROJECTS', label: '🏗️ Mega-Cluster Pooled Projects', count: '2 CLUSTERS' },
                { id: 'RESOURCES', label: '📊 Resource Aggregation & Shortages', count: '92% READY' },
                { id: 'ROSTER', label: '👥 Workforce & Fleet Roster', count: '20 OPERATORS' },
                { id: 'ESCROW', label: '💰 Project Escrow Budgets', count: '₹5,25,000' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setContractorTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    contractorTab === tab.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    contractorTab === tab.id ? 'bg-purple-500/30 text-purple-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* SKILLED WORKER TABS */}
          {activeRole === 'SKILLED_WORKER' && (
            <>
              {[
                { id: 'SKILLS', label: '👷 My Skills & Certifications', count: 'VERIFIED' },
                { id: 'AVAILABILITY', label: '📅 Daily Wage & Availability', count: `₹${workerDailyRate}/DAY` },
                { id: 'JOB_OFFERS', label: '📋 Local Job Offers', count: `${workerJobOffers.length} OFFERS` },
                { id: 'EARNINGS', label: '💵 Payouts & Work History', count: '34 JOBS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setWorkerTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    workerTab === tab.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    workerTab === tab.id ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* SUPPLIER TABS */}
          {activeRole === 'SUPPLIER' && (
            <>
              {[
                { id: 'INVENTORY', label: '🧪 Product Catalog & Stock', count: `${supplierInventory.length} ITEMS` },
                { id: 'LICENSES', label: '🛡️ Licenses & Compliance', count: 'VERIFIED' },
                { id: 'INQUIRIES', label: '📩 Farmer RFQ Quotations', count: `${supplierRfqs.length} INQUIRIES` },
                { id: 'DISPATCH', label: '🚚 Orders & Delivery Radius', count: '20 KM' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSupplierTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    supplierTab === tab.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    supplierTab === tab.id ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* EQUIPMENT OWNER TABS */}
          {activeRole === 'EQUIPMENT_OWNER' && (
            <>
              {[
                { id: 'EQUIPMENT', label: '⚙️ Sprayers & Pumps Inventory', count: `${equipmentList.length} UNITS` },
                { id: 'RENTAL_RATES', label: '📦 Rental Rates & Bundles', count: 'PER ACRE/DAY' },
                { id: 'RENTALS', label: '📋 Active Rental Bookings', count: '1 ACTIVE' },
                { id: 'EARNINGS', label: '💵 Rental Yield', count: '₹28,400' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEquipmentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    equipmentTab === tab.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    equipmentTab === tab.id ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </header>

      {/* MAIN COCKPIT VIEW */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ROLE-SPECIFIC CONTEXT HUD */}
        <div className="glass-panel-glow rounded-3xl p-5 relative overflow-hidden font-mono">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PERSONA VIEW: <strong className="text-white uppercase">{activeRole.replace('_', ' ')}</strong></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">ID: {user.id}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                <span>{user.name}</span>
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full font-normal">
                  📍 {user.village}, {user.mandal}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {activeRole === 'FARMER' && 'Registered Plots: 2 Fields (8.5 Acres) | Crops: Cotton & Paddy | Connected RTK GPS'}
                {activeRole === 'TRACTOR_OWNER' && 'Registered Fleet: 2 Heavy Tractors (50 HP & 55 HP) | Service Radius: 15 km | Schedule: Available'}
                {activeRole === 'CONTRACTOR' && 'Contractor Fleet: Sri Sai Logistics | Mega-Cluster: 170 Acres Pooled | 20 Deployed Workers'}
                {activeRole === 'SKILLED_WORKER' && 'Specialization: Sprayer Operator & Tractor Driver | Daily Rate: ₹550/day | Rating: ★ 4.8'}
                {activeRole === 'SUPPLIER' && 'Licensed Hub: Fertilizer & Hybrid Seeds | License: TS/VKR/FERT/2023/042 | Verified Dealer'}
                {activeRole === 'EQUIPMENT_OWNER' && 'Fleet: Aspee Power Sprayers & Kirloskar Water Pumps | Operator Bundles Available'}
              </p>
            </div>

            {/* ROLE-SPECIFIC HUD METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto text-xs">
              {activeRole === 'FARMER' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">TOTAL LAND</span>
                    <span className="text-lg font-black text-emerald-400">8.5 Acres</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">ACTIVE ESCROW</span>
                    <span className="text-lg font-black text-cyan-400">₹4,750</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">SOIL MOISTURE</span>
                    <span className="text-lg font-black text-purple-400">28% Optimal</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">ACTIVE MISSION</span>
                    <span className="text-lg font-black text-amber-400">#BK-9024</span>
                  </div>
                </>
              )}

              {activeRole === 'TRACTOR_OWNER' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">FLEET UNITS</span>
                    <span className="text-lg font-black text-cyan-400">2 Tractors</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">OPERATING RADIUS</span>
                    <span className="text-lg font-black text-emerald-400">{tractorAvailabilityRadius} km</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">TODAY'S YIELD</span>
                    <span className="text-lg font-black text-emerald-400">₹4,750</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">ENGINE HEALTH</span>
                    <span className="text-lg font-black text-purple-400">98% (1850 RPM)</span>
                  </div>
                </>
              )}

              {activeRole === 'CONTRACTOR' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">POOLED ACREAGE</span>
                    <span className="text-lg font-black text-purple-400">170 Acres</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">RESOURCE READY</span>
                    <span className="text-lg font-black text-emerald-400">92%</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">ESCROW BUDGET</span>
                    <span className="text-lg font-black text-cyan-400">₹5,25,000</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">TEAM DEPLOYED</span>
                    <span className="text-lg font-black text-amber-400">20 Workers</span>
                  </div>
                </>
              )}

              {activeRole === 'SKILLED_WORKER' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">DAILY WAGE RATE</span>
                    <span className="text-lg font-black text-amber-400">₹{workerDailyRate} / day</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">WORK RADIUS</span>
                    <span className="text-lg font-black text-emerald-400">{workerRadius} km</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">RATING</span>
                    <span className="text-lg font-black text-cyan-400">★ 4.8 (34 Jobs)</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">AVAILABILITY</span>
                    <span className="text-lg font-black text-emerald-400">{workerAvailableToday ? 'AVAILABLE' : 'OFF'}</span>
                  </div>
                </>
              )}

              {activeRole === 'SUPPLIER' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">TOTAL STOCK</span>
                    <span className="text-lg font-black text-teal-400">745 Units</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">PENDING RFQS</span>
                    <span className="text-lg font-black text-amber-400">{supplierRfqs.length} Inquiries</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">DEALER LICENSE</span>
                    <span className="text-lg font-black text-emerald-400">VERIFIED</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">DELIVERY RADIUS</span>
                    <span className="text-lg font-black text-cyan-400">20 km</span>
                  </div>
                </>
              )}

              {activeRole === 'EQUIPMENT_OWNER' && (
                <>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">EQUIPMENT UNITS</span>
                    <span className="text-lg font-black text-emerald-400">3 Machines</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">OPERATOR BUNDLE</span>
                    <span className="text-lg font-black text-cyan-400">ENABLED</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">ACTIVE RENTALS</span>
                    <span className="text-lg font-black text-amber-400">1 Unit Out</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">MONTHLY REVENUE</span>
                    <span className="text-lg font-black text-emerald-400">₹28,400</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌾 1. FARMER ROLE SCREENS                                                 */}
        {/* ========================================================================= */}
        {activeRole === 'FARMER' && (
          <div className="space-y-6">
            {/* FARMER TAB 1: PLOTS */}
            {farmerTab === 'PLOTS' && (
              <div className="space-y-4 font-mono">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Satellite className="w-5 h-5 text-emerald-400" />
                      My Farmland Plots & GIS Vector Mapping
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage surveyed field boundaries, active crops, and soil telemetry.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddPlot(!showAddPlot)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-[0_0_15px_#10B981] flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddPlot ? 'CANCEL' : 'MAP NEW SECTOR'}</span>
                  </button>
                </div>

                {showAddPlot && (
                  <form onSubmit={handleAddPlotSubmit} className="glass-panel-glow rounded-3xl p-5 border border-emerald-500/40 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase block">Register New Farm Plot</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 text-[10px] block mb-1">Plot Label</label>
                        <input
                          type="text"
                          placeholder="e.g. South Borewell Field"
                          value={newPlotName}
                          onChange={(e) => setNewPlotName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[10px] block mb-1">Area (Acres)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={newPlotAcres}
                          onChange={(e) => setNewPlotAcres(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[10px] block mb-1">Active Crop</label>
                        <select
                          value={newPlotCrop}
                          onChange={(e) => setNewPlotCrop(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="Cotton Hybrid-6">Cotton Hybrid-6</option>
                          <option value="Paddy BPT-5204">Paddy BPT-5204</option>
                          <option value="Chilli Super-10">Chilli Super-10</option>
                          <option value="Red Gram Asha">Red Gram Asha</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md">
                      SAVE PLOT TO MESH
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmerPlots.map((plot) => (
                    <div key={plot.id} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">ID: {plot.id}</span>
                          <h4 className="text-base font-bold text-white">{plot.name}</h4>
                          <span className="text-xs text-emerald-400 font-bold">{plot.acres} Acres • {plot.crop}</span>
                        </div>
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-full">
                          {plot.village}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                        <div className="bg-slate-900/80 p-2 rounded-xl">
                          <span className="text-[10px] text-slate-500 block">SOIL MOISTURE</span>
                          <span className="text-emerald-400 font-bold">{plot.soilMoisture}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2 rounded-xl">
                          <span className="text-[10px] text-slate-500 block">FIELD STATUS</span>
                          <span className="text-cyan-400 font-bold">{plot.status}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCalcAcres(plot.acres);
                          setFarmerTab('RADAR');
                        }}
                        className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>DISPATCH TRACTOR TO THIS PLOT</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FARMER TAB 2: RADAR & MATCHING */}
            {farmerTab === 'RADAR' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Radar className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                        <h3 className="text-xs font-bold uppercase text-emerald-300">
                          Hyperlocal LiDAR Radar
                        </h3>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                        SCAN RADIUS: 15 KM
                      </span>
                    </div>

                    <div className="relative w-full aspect-square rounded-full border border-emerald-500/30 bg-[#060D1A] flex items-center justify-center overflow-hidden my-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                      <div className="absolute w-3/4 h-3/4 rounded-full border border-emerald-500/20" />
                      <div className="absolute w-1/2 h-1/2 rounded-full border border-emerald-500/20" />
                      <div className="absolute w-1/4 h-1/4 rounded-full border border-emerald-500/30 bg-emerald-500/5" />
                      <div className="absolute w-full h-[1px] bg-emerald-500/20" />
                      <div className="absolute h-full w-[1px] bg-emerald-500/20" />

                      <div
                        className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-white origin-left left-1/2 top-1/2 shadow-[0_0_15px_#10B981]"
                        style={{ transform: `rotate(${radarDegree}deg)` }}
                      />

                      <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_15px_#10B981] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                      </div>

                      <div className="absolute top-[28%] left-[62%] flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 border border-white -ml-3.5" />
                      </div>

                      <div className="absolute bottom-[32%] right-[25%]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                      </div>

                      <div className="absolute top-[40%] left-[22%]">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                      <span className="text-cyan-400">● Suresh (98% Match)</span>
                      <span className="text-emerald-400">● Ramesh (94% Match)</span>
                      <span className="text-amber-400">● Venkat (Under-HP)</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Ranked Tractor Candidate Matches
                      </h3>
                      <p className="text-xs text-slate-400">
                        Evaluated for 5.0 Acres Rotavation in Tangipalli
                      </p>
                    </div>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-xl">
                      Req: Rotavator (≥45 HP)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {NEARBY_MACHINES.map((machine, idx) => (
                      <div
                        key={machine.id}
                        className={`glass-panel rounded-3xl p-4 transition-all border ${
                          idx === 0
                            ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-slate-900/80'
                            : 'border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                idx === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                              }`}>
                                RANK #{idx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-white">
                                {machine.brand} {machine.model}
                              </h4>
                              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                                {machine.hp} HP
                              </span>
                            </div>

                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2.5">
                              <span className="text-slate-200">👤 {machine.ownerName}</span>
                              <span>•</span>
                              <span>⭐ {machine.rating} ({machine.jobsCompleted} jobs)</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">📍 {machine.distanceKm} km</span>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {machine.attachments.map((att) => (
                                <span key={att} className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.2 rounded">
                                  ⚡ {att}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                            <div className="text-right">
                              <span className="text-xl font-black text-emerald-400">{machine.matchScore}</span>
                              <span className="text-xs text-slate-500">/100</span>
                            </div>

                            {machine.matchScore >= 80 ? (
                              <button
                                onClick={() => {
                                  setFarmerTab('BOOKINGS');
                                  setBookingStep('DISPATCHED');
                                }}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-[0_0_12px_#10B981] transition flex items-center gap-1.5"
                              >
                                <span>DISPATCH</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg">
                                {machine.reason || 'Under-spec'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FARMER TAB 3: PRICING & ESCROW CALCULATOR */}
            {farmerTab === 'PRICING' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
                <div className="lg:col-span-7 glass-panel rounded-3xl p-5 space-y-4 border border-emerald-500/20">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      Dynamic Work Tariff & Escrow Calculator
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standard formula: (Base Rate + Attachment Charge) × Acres + Mobilization + Overtime
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-300 uppercase tracking-wider block">Operation</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'rotavator', label: 'Rotavation', rate: '₹950/ac' },
                        { id: 'ploughing', label: 'Ploughing', rate: '₹900/ac' },
                        { id: 'leveling', label: 'Laser Level', rate: '₹1200/ac' },
                        { id: 'seeding', label: 'Seeding', rate: '₹800/ac' },
                      ].map((op) => (
                        <button
                          key={op.id}
                          onClick={() => setCalcWork(op.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            calcWork === op.id
                              ? 'bg-emerald-500/20 border-emerald-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-xs font-bold block">{op.label}</span>
                          <span className="text-[10px] text-emerald-400">{op.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Acreage</span>
                      <span className="text-emerald-400 font-bold">{calcAcres} Acres</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={calcAcres}
                      onChange={(e) => setCalcAcres(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Mobilization Distance</span>
                      <span className="text-cyan-400 font-bold">{calcDistance} km (3km free)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={calcDistance}
                      onChange={(e) => setCalcDistance(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-200 font-bold block">Peak Agricultural Surge (+15%)</span>
                      <span className="text-slate-500 text-[10px]">Harvest & sowing season rate multiplier</span>
                    </div>
                    <button
                      onClick={() => setCalcPeakSeason(!calcPeakSeason)}
                      className={`px-3 py-1 rounded-full font-bold ${
                        calcPeakSeason ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {calcPeakSeason ? 'SURGE ACTIVE' : 'OFF PEAK'}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel-glow rounded-3xl p-5 space-y-4 border border-emerald-500/30">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">SMART ESCROW QUOTE</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        VERIFIED TARIFF
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Base Rate ({calcAcres} ac × ₹{baseRate})</span>
                        <span>₹{baseCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attachment Charge ({calcAttachment})</span>
                        <span>₹{attachmentCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobilization ({mobKm} km × ₹35)</span>
                        <span>₹{mobCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Season Multiplier</span>
                        <span>{seasonMultiplier}x</span>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                        <div>
                          <span className="text-xs text-slate-400 block">TOTAL ESCROW DEPOSIT</span>
                          <span className="text-[9px] text-emerald-400">Released only on your field confirmation</span>
                        </div>
                        <span className="text-2xl font-black text-emerald-400">
                          ₹{totalCalculatedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFarmerTab('BOOKINGS');
                        setBookingStep('DISPATCHED');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-[0_0_15px_#10B981] flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>DEPOSIT IN ESCROW & BOOK TRACTOR</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FARMER TAB 4: BOOKINGS & TELEMETRY */}
            {farmerTab === 'BOOKINGS' && (
              <div className="space-y-4 font-mono">
                <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Active Mission Lifecycle #BK-9024
                      </h3>
                      <p className="text-xs text-slate-400">
                        Autonomous 7-step progression with RTK GPS field telemetry tracking.
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                      STATUS: {bookingStep}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
                    {[
                      { id: 'REQUESTED', label: '1. Requested' },
                      { id: 'MATCHED', label: '2. Matched' },
                      { id: 'DISPATCHED', label: '3. En Route' },
                      { id: 'IN_FIELD', label: '4. In Field' },
                      { id: 'WORK_COMPLETED', label: '5. Completed' },
                      { id: 'AI_AUDITED', label: '6. Audited' },
                      { id: 'ESCROW_RELEASED', label: '7. Paid' },
                    ].map((step, idx) => {
                      const isCurrent = bookingStep === step.id;
                      const isDone = ['REQUESTED', 'MATCHED', 'DISPATCHED', 'IN_FIELD', 'WORK_COMPLETED', 'AI_AUDITED', 'ESCROW_RELEASED'].indexOf(bookingStep) >= idx;
                      return (
                        <div
                          key={step.id}
                          onClick={() => setBookingStep(step.id as any)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition ${
                            isCurrent
                              ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                              : isDone
                              ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-950/40 border-slate-800/60 text-slate-600'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-700" />}
                          </div>
                          <span className="text-[10px] font-bold block">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        Tractor Live Telemetry Stream
                      </h4>
                      <span className="text-[10px] text-emerald-400">UPDATED {liveSeconds % 5}s AGO</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">TILLAGE AREA</span>
                        <span className="text-lg font-black text-emerald-400">{harvestedAcreage} / 4.0 Ac</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">ENGINE RPM</span>
                        <span className="text-lg font-black text-cyan-400">1,850</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">FUEL LEVEL</span>
                        <span className="text-lg font-black text-purple-400">88%</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">GEO-FENCE</span>
                        <span className="text-lg font-black text-emerald-400">LOCKED</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Ploughing Progress</span>
                        <span>{Math.round((harvestedAcreage / 4.0) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(harvestedAcreage / 4.0) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setHarvestedAcreage((a) => Math.min(4.0, +(a + 0.5).toFixed(1)))}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl border border-slate-700 text-slate-200"
                      >
                        +0.5 Ac Ploughed
                      </button>
                      <button
                        onClick={() => {
                          setHarvestedAcreage(4.0);
                          setBookingStep('WORK_COMPLETED');
                        }}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-xs rounded-xl border border-emerald-500/40 text-emerald-300"
                      >
                        Mark 100% Completed
                      </button>
                      <button
                        onClick={() => setBookingStep('ESCROW_RELEASED')}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-xs rounded-xl border border-cyan-500/40 text-cyan-300"
                      >
                        Release Escrow Payout
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-slate-950 font-black">
                        SR
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Suresh Reddy</h4>
                        <span className="text-[11px] text-emerald-400 block">⭐ 4.9 (142 missions)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 border-t border-b border-slate-800 py-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Machine:</span>
                        <span>Mahindra 550 DI (50 HP)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Attachment:</span>
                        <span>Rotavator 42 Blades</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Agreed Price:</span>
                        <span className="text-emerald-400 font-bold">₹4,750</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Escrow Status:</span>
                        <span className="text-cyan-400 font-bold">LOCKED IN VAULT</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setFarmerTab('COMMS')}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Chat Driver</span>
                      </button>
                      <a
                        href="tel:9848112233"
                        className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FARMER TAB 5: SUPPLIES */}
            {farmerTab === 'SUPPLIES' && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      Agri-Input Store & Licensed Fertilizer Hubs
                    </h3>
                    <p className="text-xs text-slate-400">
                      Order genuine Neem-coated Urea, hybrid seeds, and micronutrients from verified dealers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {NEARBY_SUPPLIERS.map((sup) => (
                    <div key={sup.id} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[10px] text-slate-500 block">ID: {sup.id}</span>
                          <h4 className="text-sm font-bold text-white">{sup.shopName}</h4>
                          <span className="text-xs text-emerald-400">👤 {sup.ownerName}</span>
                        </div>
                        <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md font-bold">
                          {sup.distanceKm} km
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Neem Urea Bag (45kg):</span>
                          <span className="text-emerald-400 font-bold">₹{sup.pricePerBag}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stock Availability:</span>
                          <span>{sup.stockStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Delivery Method:</span>
                          <span className={sup.deliveryDrone ? 'text-emerald-400' : 'text-slate-400'}>
                            {sup.deliveryDrone ? 'DRONE + VEHICLE' : 'ROAD ONLY'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Escrow quote requested from ${sup.shopName}`)}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
                      >
                        REQUEST RFQ QUOTE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FARMER TAB 6: COMMS */}
            {farmerTab === 'COMMS' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono">
                <div className="lg:col-span-8 glass-panel rounded-3xl p-5 border border-slate-800 space-y-3 flex flex-col h-[480px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">Comms Channel #BK-9024 (Suresh Reddy)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {(['in_app', 'sms', 'whatsapp', 'ivr_agent'] as const).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setCommChannel(ch)}
                          className={`text-[9px] uppercase px-2 py-0.5 rounded ${
                            commChannel === ch ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ch.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 text-xs">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl max-w-[80%] space-y-0.5 ${
                          msg.sender.includes('Ravi')
                            ? 'ml-auto bg-emerald-500/20 border border-emerald-500/30 text-emerald-100'
                            : msg.sender === 'SYSTEM'
                            ? 'mx-auto bg-slate-950 border border-slate-800 text-cyan-300 text-center text-[10px]'
                            : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[9px] text-slate-500">
                          <span className="font-bold">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type message to machine operator..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 rounded-xl text-xs flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                    <Volume2 className="w-4 h-4" />
                    <span>Telugu Voice Broadcast</span>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                    <span className="text-[9px] text-slate-500 block uppercase">Telugu Synthesizer Audio Stream</span>
                    <p className="text-slate-300 italic">
                      "రవి గారు, మీ బుకింగ్ #BK-9024 కన్ఫర్మ్ అయింది. సురేష్ రెడ్డి గారు 50 HP మహీంద్రా ట్రాక్టర్‌తో 7:00 గంటలకు మీ చేను వద్దకు చేరుకుంటారు."
                    </p>
                    <button
                      onClick={() => alert('Playing Telugu IVR voice audio')}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-[10px] font-bold flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play Voice Broadcast</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚜 2. TRACTOR OWNER ROLE SCREENS                                          */}
        {/* ========================================================================= */}
        {activeRole === 'TRACTOR_OWNER' && (
          <div className="space-y-6 font-mono">
            {/* TRACTOR TAB 1: FLEET */}
            {tractorTab === 'FLEET' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      Connected Machinery Fleet & IoT Sensors
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time tractor telemetry, equipped implements, and health index.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NEARBY_MACHINES.slice(0, 2).map((tr) => (
                    <div key={tr.id} className="glass-panel-glow rounded-3xl p-5 border border-cyan-500/30 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">ID: {tr.id}</span>
                          <h4 className="text-base font-black text-white">{tr.brand} {tr.model}</h4>
                        </div>
                        <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full">
                          {tr.hp} HP
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">RPM</span>
                          <span className="text-cyan-400 font-bold">{tr.specs.engineRpm}</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">FUEL</span>
                          <span className="text-emerald-400 font-bold">{tr.specs.fuelLevel}</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">HEALTH</span>
                          <span className="text-emerald-400 font-bold">{tr.specs.health}</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">GPS</span>
                          <span className="text-purple-400 font-bold">RTK ±2cm</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500 block mb-1">Attached Implements:</span>
                        <div className="flex flex-wrap gap-1">
                          {tr.attachments.map((att) => (
                            <span key={att} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px]">
                              ⚡ {att}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRACTOR TAB 2: AVAILABILITY */}
            {tractorTab === 'AVAILABILITY' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Operating Service Radius & Availability Schedule
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set your operating range and daily work availability for incoming algorithmic matches.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Operating Service Radius</span>
                        <span className="text-cyan-400 font-bold">{tractorAvailabilityRadius} km from Tangipalli</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="35"
                        value={tractorAvailabilityRadius}
                        onChange={(e) => setTractorAvailabilityRadius(Number(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Minimum Work Acreage Required</span>
                        <span className="text-emerald-400 font-bold">{minWorkAcres} Acres</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={minWorkAcres}
                        onChange={(e) => setMinWorkAcres(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-800 h-2 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Today's Dispatch Status</span>
                      <button
                        onClick={() => setIsTractorAvailableToday(!isTractorAvailableToday)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          isTractorAvailableToday ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isTractorAvailableToday ? 'ONLINE & READY' : 'OFFLINE (MAINTENANCE)'}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-slate-300 font-bold block">Weekly Schedule:</span>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                          <div key={day} className={`p-1.5 rounded-lg border ${idx === 2 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                            <span className="block font-bold">{day}</span>
                            <span>{idx === 2 ? 'Booked' : 'Open'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRACTOR TAB 3: DISPATCH REQUESTS */}
            {tractorTab === 'DISPATCH' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Incoming Dispatch Requests ({tractorRequests.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {tractorRequests.map((req) => (
                    <div key={req.id} className="glass-panel rounded-3xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-bold">
                            {req.id}
                          </span>
                          <h4 className="text-sm font-bold text-white">{req.farmer}</h4>
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
                        <button
                          onClick={() => setTractorRequests(tractorRequests.filter((r) => r.id !== req.id))}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            alert(`Accepted dispatch request #${req.id}. Mission initialized.`);
                            setTractorTab('FIELD_OPS');
                          }}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-[0_0_15px_#10B981]"
                        >
                          Accept & Dispatch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRACTOR TAB 4: FIELD OPS */}
            {tractorTab === 'FIELD_OPS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold block">ACTIVE OPERATION: MISSION #BK-9024</span>
                    <h3 className="text-lg font-black text-white">Field Tillage in Progress (Ravi Kumar - Tangipalli)</h3>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                    ESCROW LOCKED: ₹4,750
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PLOUGHED AREA</span>
                    <span className="text-xl font-black text-emerald-400">3.4 / 4.0 Ac</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CURRENT RPM</span>
                    <span className="text-xl font-black text-cyan-400">1,850</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DIESEL FLOW</span>
                    <span className="text-xl font-black text-purple-400">4.2 L/hr</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">SPEED</span>
                    <span className="text-xl font-black text-emerald-400">4.8 km/h</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Work completed notification sent to farmer for sign-off.')}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  TRANSMIT WORK COMPLETION PROOF
                </button>
              </div>
            )}

            {/* TRACTOR TAB 5: EARNINGS */}
            {tractorTab === 'EARNINGS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Tractor Owner Escrow Settlements & Earnings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Weekly Completed Tillage</span>
                    <p className="text-2xl font-black text-white mt-1">42 Acres</p>
                    <span className="text-xs text-emerald-400">8 Successful Missions</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Settled Bank Payouts</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">₹39,900</p>
                    <span className="text-xs text-slate-400">Direct UPI Transfer</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Pending in Escrow</span>
                    <p className="text-2xl font-black text-cyan-400 mt-1">₹4,750</p>
                    <span className="text-xs text-cyan-400">Releases upon completion</span>
                  </div>
                </div>
              </div>
            )}

            {/* TRACTOR TAB 6: COMMS */}
            {tractorTab === 'COMMS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Farmer Direct Coordination Channel
                </h3>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <span className="text-slate-400 block">Connected with Farmer: <strong>Ravi Kumar (Tangipalli)</strong></span>
                  <p className="text-slate-200">"Please enter via the North Solar Canal gate. Soil moisture is optimal."</p>
                  <button
                    onClick={() => alert('Reply transmitted to farmer.')}
                    className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Send Quick Reply: "Entering North Gate now"
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🏗️ 3. CONTRACTOR ROLE SCREENS                                             */}
        {/* ========================================================================= */}
        {activeRole === 'CONTRACTOR' && (
          <div className="space-y-6 font-mono">
            {contractorTab === 'PROJECTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-400" />
                      Mega-Cluster Pooled Acreage Operations
                    </h3>
                    <p className="text-xs text-slate-400">
                      Multi-village pooled land operations, bulk resource procurement, and automated smart milestone escrow.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
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
                  ].map((p) => (
                    <div key={p.ref} className="glass-panel-glow rounded-3xl p-5 border border-purple-500/30 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-[10px] text-purple-400 font-bold block">{p.ref} • {p.acreage}</span>
                          <h4 className="text-base font-bold text-white">{p.title}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">TOTAL ESCROW BUDGET</span>
                          <span className="text-base font-black text-emerald-400">{p.escrowBudget}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">HEAVY TRACTORS</span>
                          <span className="text-white font-bold">{p.tractors}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">SKILLED OPERATORS</span>
                          <span className="text-white font-bold">{p.workers}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-slate-500 block">DRONE SPRAYERS</span>
                          <span className="text-white font-bold">{p.sprayers}</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Cluster Execution Progress</span>
                          <span className="text-purple-400 font-bold">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contractorTab === 'RESOURCES' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-purple-400" />
                  Cluster Resource Shortage Detection
                </h3>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active Shortage: 1x 50 HP Tractor Needed for Cluster #CTR-000094</span>
                  </div>
                  <p className="text-slate-400">
                    System is expanding radius search bands (15 km to 25 km) to automatically recruit available local tractors in Vikarabad.
                  </p>
                </div>
              </div>
            )}

            {contractorTab === 'ROSTER' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Deployed Team of Operators (20 Workers)</h3>
                <p className="text-xs text-slate-400">Managed by Sri Sai Agri Logistics across 3 active Mandals.</p>
              </div>
            )}

            {contractorTab === 'ESCROW' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Contractor Milestone Escrow (₹5,25,000)</h3>
                <p className="text-xs text-slate-400">Multi-stage escrow funds locked for farmers and provider teams.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 👷 4. SKILLED WORKER ROLE SCREENS                                         */}
        {/* ========================================================================= */}
        {activeRole === 'SKILLED_WORKER' && (
          <div className="space-y-6 font-mono">
            {workerTab === 'SKILLS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      Verified Agricultural Skills & Experience
                    </h3>
                    <p className="text-xs text-slate-400">
                      Certified specializations and proven field job history.
                    </p>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
                    ★ 4.8 / 5.0 (34 Completed Jobs)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">✓ Sprayer Operator</span>
                    <p className="text-slate-400 text-[11px]">6 Years Experience • Power & HTP Sprayers</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">✓ Tractor Operator</span>
                    <p className="text-slate-400 text-[11px]">4 Years Experience • Rotavator & Ploughing</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">✓ Pump Technician</span>
                    <p className="text-slate-400 text-[11px]">3 Years Experience • Electric & Diesel Pumps</p>
                  </div>
                </div>
              </div>
            )}

            {workerTab === 'AVAILABILITY' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white">Daily Wage Rate & Availability Toggle</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-slate-300">Expected Daily Wage (INR)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-amber-400">₹</span>
                      <input
                        type="number"
                        value={workerDailyRate}
                        onChange={(e) => setWorkerDailyRate(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold w-32"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-slate-300">Availability Status</span>
                    <button
                      onClick={() => setWorkerAvailableToday(!workerAvailableToday)}
                      className={`w-full py-2 rounded-xl font-bold text-xs ${
                        workerAvailableToday ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {workerAvailableToday ? '✓ AVAILABLE FOR LOCAL WORK' : 'OFF DUTY'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {workerTab === 'JOB_OFFERS' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-white">Available Local Job Offers ({workerJobOffers.length})</h3>
                {workerJobOffers.map((offer) => (
                  <div key={offer.id} className="glass-panel rounded-3xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold block">{offer.id} • {offer.skill}</span>
                      <h4 className="text-sm font-bold text-white">{offer.farmer} ({offer.distance})</h4>
                      <p className="text-slate-400">Crop: {offer.crop} • Duration: {offer.days} Days • Payout: <strong className="text-emerald-400">{offer.wage}</strong></p>
                    </div>
                    {offer.status === 'ACCEPTED' ? (
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold">
                        ✓ ACCEPTED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcceptJobOffer(offer.id)}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl shadow-sm"
                      >
                        ACCEPT JOB OFFER
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {workerTab === 'EARNINGS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Wage History (34 Completed Missions)</h3>
                <p className="text-xs text-slate-400">Total earned this season: ₹18,700 (Direct to UPI)</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🧪 5. AGRI-INPUT SUPPLIER ROLE SCREENS                                     */}
        {/* ========================================================================= */}
        {activeRole === 'SUPPLIER' && (
          <div className="space-y-6 font-mono">
            {supplierTab === 'INVENTORY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-teal-400" />
                      Agri-Input Inventory & Real-Time Stock
                    </h3>
                    <p className="text-xs text-slate-400">
                      Fertilizers, hybrid seeds, and crop protection catalog.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplierInventory.map((item) => (
                    <div key={item.id} className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-teal-400 block">{item.category}</span>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                          ₹{item.unitPrice}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Units in Stock: <strong className="text-white">{item.stock} Units</strong></span>
                        <span className={item.stock < 100 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {supplierTab === 'LICENSES' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Regulatory Dealer Licenses & Compliance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] block">FERTILIZER DEALER LICENSE</span>
                    <span className="text-emerald-400 font-bold block">TS/VKR/FERT/2023/042</span>
                    <span className="text-[9px] text-slate-500">Verified by Dept of Agriculture</span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] block">SEED DEALER LICENSE</span>
                    <span className="text-emerald-400 font-bold block">TS/VKR/SEED/2022/118</span>
                    <span className="text-[9px] text-slate-500">Active Valid Thru 2027</span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] block">GSTIN</span>
                    <span className="text-cyan-400 font-bold block">36AABCS1234F1Z8</span>
                    <span className="text-[9px] text-slate-500">Active Taxpayer</span>
                  </div>
                </div>
              </div>
            )}

            {supplierTab === 'INQUIRIES' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-white">Farmer RFQ Inquiries ({supplierRfqs.length})</h3>
                {supplierRfqs.map((rfq) => (
                  <div key={rfq.id} className="glass-panel rounded-3xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-teal-400 font-bold block">{rfq.id} • {rfq.village}</span>
                      <h4 className="text-sm font-bold text-white">{rfq.farmer}</h4>
                      <p className="text-slate-300">Requested: {rfq.products}</p>
                      <span className="text-emerald-400 font-bold">Estimated Total: {rfq.totalEst}</span>
                    </div>
                    <button
                      onClick={() => alert(`Quotation confirmed for #${rfq.id}`)}
                      className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl"
                    >
                      SEND QUOTE & STOCK CONFIRMATION
                    </button>
                  </div>
                ))}
              </div>
            )}

            {supplierTab === 'DISPATCH' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Delivery Logistics & Radius (20 km)</h3>
                <p className="text-xs text-slate-400">Drone and small commercial vehicle delivery routing active in Tandur Sector.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ⚙️ 6. EQUIPMENT OWNER (SPRAYERS & PUMPS) ROLE SCREENS                       */}
        {/* ========================================================================= */}
        {activeRole === 'EQUIPMENT_OWNER' && (
          <div className="space-y-6 font-mono">
            {equipmentTab === 'EQUIPMENT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-emerald-400" />
                      Heavy Power Sprayers & Water Pumps Fleet
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage specialized equipment, discharge rates, and operator bundling options.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {equipmentList.map((eq) => (
                    <div key={eq.id} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-emerald-400 block">{eq.type}</span>
                          <h4 className="text-sm font-bold text-white">{eq.name}</h4>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                          {eq.available ? 'AVAILABLE' : 'RENTED'}
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                        <span className="text-slate-500 text-[10px] block uppercase">SPECIFICATIONS</span>
                        <p className="font-bold text-white">{eq.capacity}</p>
                        <p className="text-emerald-400">₹{eq.ratePerAcre} / Acre (₹{eq.ratePerDay} / Day)</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Bundled Operator:</span>
                        <span className={eq.bundleOperator ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {eq.bundleOperator ? 'YES (WITH DRIVER)' : 'EQUIPMENT ONLY'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {equipmentTab === 'RENTAL_RATES' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Rental Pricing & Operator Bundles</h3>
                <p className="text-xs text-slate-400">Configure daily and per-acre rental tariffs for dual combo matching.</p>
              </div>
            )}

            {equipmentTab === 'RENTALS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Active Equipment Rental Bookings</h3>
                <p className="text-xs text-slate-400">1x Aspee HTP Sprayer currently deployed at Tangipalli field.</p>
              </div>
            )}

            {equipmentTab === 'EARNINGS' && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="text-base font-black text-white">Rental Revenue (₹28,400 This Month)</h3>
                <p className="text-xs text-slate-400">Settled through RuralConnect smart escrow.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#090E1B]/90 mt-12 py-4 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RURALCONNECT QUANTUM AGRI-GRID • ROLE-SEGREGATED OS 4.0</span>
          <span className="text-emerald-400">ACTIVE PERSONA: {activeRole.replace('_', ' ')}</span>
        </div>
      </footer>
    </div>
  );
}
