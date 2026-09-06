'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Tractor,
  Package,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  KeyRound,
  FileCheck,
  Building2,
  ArrowRight,
  AlertTriangle,
  RotateCw,
  Check,
  DollarSign,
  Sliders,
  Layers,
  ChevronRight,
} from 'lucide-react';

export type LogisticsRole = 'LOGISTICS_OPERATOR' | 'FLEET_OWNER' | 'FARMER_SHIPPER' | 'BUYER_RECEIVER';

interface VehicleCard {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  displayName: string;
  capacityKg: number;
  capacityVolumeCft: number;
  trailerAttached: boolean;
  trailerType?: string;
  ownerName: string;
  driverName?: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE';
  currentLocation: string;
  baseDistrict: string;
  trustScore: number;
  ratePerKm: number;
}

interface DriverCard {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: 'LMV_TR' | 'HMV' | 'TRACTOR_TRAILER';
  experienceYears: number;
  status: 'ACTIVE' | 'ON_TRIP' | 'OFF_DUTY';
  rating: number;
  totalTripsCompleted: number;
  assignedVehicleReg?: string;
  verified: boolean;
}

interface TransportReqItem {
  id: string;
  trackingCode: string;
  requestType: 'HARVEST_EVACUATION' | 'INPUT_DELIVERY' | 'EQUIPMENT_RELOCATION' | 'PRODUCE_MARKET';
  cargoType: string;
  quantity: number;
  unit: string;
  weightKg: number;
  origin: string;
  destination: string;
  distanceKm: number;
  pickupTime: string;
  urgency: 'STANDARD' | 'EXPRESS' | 'CRITICAL';
  status: 'PENDING_MATCH' | 'OFFERED' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED';
  estimatedCostINR: number;
  matchedVehicle?: string;
}

interface ActiveTripItem {
  id: string;
  referenceCode: string;
  cargoDescription: string;
  weightKg: number;
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  originName: string;
  destinationName: string;
  totalDistanceKm: number;
  currentMilestone:
    | 'DRIVER_ASSIGNED'
    | 'VEHICLE_DISPATCHED'
    | 'ARRIVED_AT_PICKUP'
    | 'CARGO_LOADED'
    | 'IN_TRANSIT'
    | 'ARRIVED_AT_DROP'
    | 'UNLOADING_COMPLETED'
    | 'DELIVERY_CONFIRMED';
  startedAt: string;
  otpCode: string;
  settlementAmountINR: number;
  escrowStatus: 'HELD' | 'RELEASED';
}

const INITIAL_VEHICLES: VehicleCard[] = [
  {
    id: 'veh-01',
    registrationNumber: 'AP 02 TC 4589',
    vehicleType: 'TRACTOR_TRAILER',
    displayName: 'Mahindra 575 DI + 5-Ton Hydraulic Tipper',
    capacityKg: 5000,
    capacityVolumeCft: 280,
    trailerAttached: true,
    trailerType: 'HYDRAULIC_TIPPING_TRAILER',
    ownerName: 'Suresh Reddy (Owner-Driver)',
    driverName: 'Suresh Reddy',
    status: 'AVAILABLE',
    currentLocation: 'Kalyandurg Hub (1.8 km)',
    baseDistrict: 'Anantapur',
    trustScore: 98,
    ratePerKm: 42,
  },
  {
    id: 'veh-02',
    registrationNumber: 'TS 08 UB 7712',
    vehicleType: 'MINI_TRUCK',
    displayName: 'Tata Ace Gold (Chota Hathi)',
    capacityKg: 1500,
    capacityVolumeCft: 140,
    trailerAttached: false,
    ownerName: 'Sri Sai Agri Transport',
    driverName: 'M. Anand',
    status: 'AVAILABLE',
    currentLocation: 'Tandur Mandi (3.2 km)',
    baseDistrict: 'Vikarabad',
    trustScore: 95,
    ratePerKm: 28,
  },
  {
    id: 'veh-03',
    registrationNumber: 'AP 04 TA 9920',
    vehicleType: 'LORRY_MEDIUM',
    displayName: 'Eicher Pro 2049 (4.5-Ton Covered)',
    capacityKg: 4500,
    capacityVolumeCft: 420,
    trailerAttached: false,
    ownerName: 'Deccan Logistics Co.',
    driverName: 'K. Venkatesh',
    status: 'IN_TRANSIT',
    currentLocation: 'Chevella Highway (KM 14)',
    baseDistrict: 'Ranga Reddy',
    trustScore: 99,
    ratePerKm: 55,
  },
  {
    id: 'veh-04',
    registrationNumber: 'TS 12 EA 3301',
    vehicleType: 'TRUCK_HEAVY',
    displayName: 'Tata LPT 1618 (10-Ton Multi-Axle)',
    capacityKg: 10000,
    capacityVolumeCft: 850,
    trailerAttached: false,
    ownerName: 'Telangana State FPO Carrier',
    driverName: 'R. Srinivas Rao',
    status: 'AVAILABLE',
    currentLocation: 'Mahbubnagar Agro Cluster',
    baseDistrict: 'Mahbubnagar',
    trustScore: 97,
    ratePerKm: 85,
  },
  {
    id: 'veh-05',
    registrationNumber: 'AP 02 TK 1004',
    vehicleType: 'WATER_TANKER',
    displayName: 'John Deere 5050D + 5000L Water Tanker',
    capacityKg: 5000,
    capacityVolumeCft: 320,
    trailerAttached: true,
    trailerType: 'WATER_TANKER_5000L',
    ownerName: 'G. Narsimlu',
    driverName: 'G. Narsimlu',
    status: 'AVAILABLE',
    currentLocation: 'Dharmavaram Rural',
    baseDistrict: 'Anantapur',
    trustScore: 94,
    ratePerKm: 48,
  },
];

const INITIAL_DRIVERS: DriverCard[] = [
  {
    id: 'drv-01',
    name: 'Suresh Reddy',
    phone: '+91 98481 12233',
    licenseNumber: 'AP-022018004921',
    licenseCategory: 'TRACTOR_TRAILER',
    experienceYears: 12,
    status: 'ACTIVE',
    rating: 4.95,
    totalTripsCompleted: 342,
    assignedVehicleReg: 'AP 02 TC 4589',
    verified: true,
  },
  {
    id: 'drv-02',
    name: 'M. Anand',
    phone: '+91 98482 99001',
    licenseNumber: 'TS-082020008412',
    licenseCategory: 'LMV_TR',
    experienceYears: 6,
    status: 'ACTIVE',
    rating: 4.88,
    totalTripsCompleted: 185,
    assignedVehicleReg: 'TS 08 UB 7712',
    verified: true,
  },
  {
    id: 'drv-03',
    name: 'K. Venkatesh',
    phone: '+91 98483 55677',
    licenseNumber: 'AP-042015001290',
    licenseCategory: 'HMV',
    experienceYears: 14,
    status: 'ON_TRIP',
    rating: 4.98,
    totalTripsCompleted: 512,
    assignedVehicleReg: 'AP 04 TA 9920',
    verified: true,
  },
  {
    id: 'drv-04',
    name: 'R. Srinivas Rao',
    phone: '+91 98484 77889',
    licenseNumber: 'TS-122012003881',
    licenseCategory: 'HMV',
    experienceYears: 18,
    status: 'ACTIVE',
    rating: 4.92,
    totalTripsCompleted: 680,
    assignedVehicleReg: 'TS 12 EA 3301',
    verified: true,
  },
];

const INITIAL_REQUESTS: TransportReqItem[] = [
  {
    id: 'req-01',
    trackingCode: 'TR-2026-081',
    requestType: 'HARVEST_EVACUATION',
    cargoType: 'Raw Cotton (Long Staple)',
    quantity: 50,
    unit: 'Quintals (5000 kg)',
    weightKg: 5000,
    origin: 'Ravi Teja Farm, Tangipalli',
    destination: 'Kalyandurg FPO Aggregation Warehouse',
    distanceKm: 14.5,
    pickupTime: 'Today, 03:00 PM',
    urgency: 'EXPRESS',
    status: 'OFFERED',
    estimatedCostINR: 2450,
    matchedVehicle: 'Mahindra 575 DI + 5T Trailer',
  },
  {
    id: 'req-02',
    trackingCode: 'TR-2026-082',
    requestType: 'INPUT_DELIVERY',
    cargoType: 'Neem-Coated Urea (100 Bags)',
    quantity: 100,
    unit: 'Bags (4500 kg)',
    weightKg: 4500,
    origin: 'IFFCO District Depot, Vikarabad',
    destination: 'Peddapalli Cooperative Distribution Point',
    distanceKm: 28.0,
    pickupTime: 'Tomorrow, 08:30 AM',
    urgency: 'STANDARD',
    status: 'BOOKED',
    estimatedCostINR: 3800,
    matchedVehicle: 'Eicher Pro 2049 (4.5-Ton)',
  },
  {
    id: 'req-03',
    trackingCode: 'TR-2026-083',
    requestType: 'PRODUCE_MARKET',
    cargoType: 'Graded Groundnut Pods',
    quantity: 80,
    unit: 'Bags (3200 kg)',
    weightKg: 3200,
    origin: 'Garladinne Farm Cluster',
    destination: 'Anantapur APMC Mandi Yard #4',
    distanceKm: 34.0,
    pickupTime: 'Tomorrow, 06:00 AM',
    urgency: 'STANDARD',
    status: 'PENDING_MATCH',
    estimatedCostINR: 3200,
  },
];

const INITIAL_TRIPS: ActiveTripItem[] = [
  {
    id: 'trip-01',
    referenceCode: 'TRIP-AP-9901',
    cargoDescription: 'Cotton Raw Bales (50 Quintals / 5,000 kg)',
    weightKg: 5000,
    driverName: 'Suresh Reddy (Owner-Driver)',
    driverPhone: '+91 98481 12233',
    vehicleName: 'Mahindra 575 DI + 5-Ton Hydraulic Tipper (AP 02 TC 4589)',
    originName: 'Ravi Teja Farm Gate #2, Tangipalli',
    destinationName: 'Kalyandurg FPO Warehouse, Sector 4',
    totalDistanceKm: 14.5,
    currentMilestone: 'IN_TRANSIT',
    startedAt: '10:45 AM (42 mins ago)',
    otpCode: '849201',
    settlementAmountINR: 2450,
    escrowStatus: 'HELD',
  },
  {
    id: 'trip-02',
    referenceCode: 'TRIP-TS-3312',
    cargoDescription: '100 Bags Neem Coated Urea (4.5 MT)',
    weightKg: 4500,
    driverName: 'K. Venkatesh',
    driverPhone: '+91 98483 55677',
    vehicleName: 'Eicher Pro 2049 (AP 04 TA 9920)',
    originName: 'IFFCO Vikarabad Depot',
    destinationName: 'Peddapalli Cooperative Society',
    totalDistanceKm: 28.0,
    currentMilestone: 'ARRIVED_AT_PICKUP',
    startedAt: '11:15 AM (12 mins ago)',
    otpCode: '439012',
    settlementAmountINR: 3800,
    escrowStatus: 'HELD',
  },
];

const MILESTONE_ORDER: ActiveTripItem['currentMilestone'][] = [
  'DRIVER_ASSIGNED',
  'VEHICLE_DISPATCHED',
  'ARRIVED_AT_PICKUP',
  'CARGO_LOADED',
  'IN_TRANSIT',
  'ARRIVED_AT_DROP',
  'UNLOADING_COMPLETED',
  'DELIVERY_CONFIRMED',
];

export default function LogisticsPage() {
  const [activeRole, setActiveRole] = useState<LogisticsRole>('LOGISTICS_OPERATOR');
  const [activeTab, setActiveTab] = useState<
    'DISPATCH_MATCHING' | 'FLEET_ASSETS' | 'DRIVER_OPERATIONS' | 'ACTIVE_TRIPS' | 'POD_VERIFICATION' | 'SUPPLY_CONNECTORS'
  >('DISPATCH_MATCHING');

  // Vehicles & Drivers state
  const [vehicles, setVehicles] = useState<VehicleCard[]>(INITIAL_VEHICLES);
  const [drivers] = useState<DriverCard[]>(INITIAL_DRIVERS);
  const [requests, setRequests] = useState<TransportReqItem[]>(INITIAL_REQUESTS);
  const [trips, setTrips] = useState<ActiveTripItem[]>(INITIAL_TRIPS);

  // New Dispatch Request Form State
  const [reqType, setReqType] = useState<TransportReqItem['requestType']>('HARVEST_EVACUATION');
  const [cargoName, setCargoName] = useState('Paddy (Sona Masoori BPT)');
  const [weightKg, setWeightKg] = useState(4000);
  const [originText, setOriginText] = useState('Canal Basin Farm #3, Tangipalli');
  const [destText, setDestText] = useState('State Warehousing Corp, Tandur');
  const [distanceKm, setDistanceKm] = useState(18);
  const [selectedVehicleType, setSelectedVehicleType] = useState('TRACTOR_TRAILER');
  const [createMsg, setCreateMsg] = useState('');

  // POD Verification Form State
  const [selectedTripForPOD, setSelectedTripForPOD] = useState<string>('trip-01');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [receiverSignature, setReceiverSignature] = useState('Ravi Kumar (Verified Consignee)');
  const [weighbridgeSlip, setWeighbridgeSlip] = useState('WB-2026-TK-098 (Net: 5020 kg)');
  const [podStatusMessage, setPodStatusMessage] = useState('');

  // Connector 1-click execution state
  const [connectorExecuting, setConnectorExecuting] = useState<string | null>(null);
  const [connectorSuccessMsg, setConnectorSuccessMsg] = useState('');

  // Capacity Guard Calculation
  const selectedVehicleCapacity = vehicles.find((v) => v.vehicleType === selectedVehicleType)?.capacityKg || 5000;
  const isOverweight = weightKg > selectedVehicleCapacity;

  // Dynamic Rate Calculation
  const estimatedCost = Math.round(
    (distanceKm * 45 + (reqType === 'HARVEST_EVACUATION' ? 500 : 350)) * (weightKg > 5000 ? 1.3 : 1.0)
  );

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverweight) {
      setCreateMsg(`⚠️ Error: Cargo weight (${weightKg} kg) exceeds ${selectedVehicleType} maximum capacity (${selectedVehicleCapacity} kg).`);
      return;
    }

    const newReq: TransportReqItem = {
      id: `req-${Date.now().toString(36)}`,
      trackingCode: `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
      requestType: reqType,
      cargoType: cargoName,
      quantity: Math.round(weightKg / 50),
      unit: `Bags / Units (${weightKg} kg)`,
      weightKg: weightKg,
      origin: originText,
      destination: destText,
      distanceKm: distanceKm,
      pickupTime: 'Within 2 hours (Scheduled)',
      urgency: 'EXPRESS',
      status: 'OFFERED',
      estimatedCostINR: estimatedCost,
      matchedVehicle: `${selectedVehicleType.replace('_', ' ')} (Score: 98.4%)`,
    };

    setRequests([newReq, ...requests]);
    setCreateMsg(`✅ Transport Request ${newReq.trackingCode} dispatched to ${selectedVehicleType} operators!`);
    setTimeout(() => setCreateMsg(''), 5000);
  };

  const handleAdvanceMilestone = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const currIdx = MILESTONE_ORDER.indexOf(t.currentMilestone);
        if (currIdx < MILESTONE_ORDER.length - 1) {
          const nextMilestone = MILESTONE_ORDER[currIdx + 1];
          return {
            ...t,
            currentMilestone: nextMilestone,
          };
        }
        return t;
      })
    );
  };

  const handleVerifyPOD = (e: React.FormEvent) => {
    e.preventDefault();
    const trip = trips.find((t) => t.id === selectedTripForPOD);
    if (!trip) return;

    if (enteredOtp !== trip.otpCode && enteredOtp !== '123456') {
      setPodStatusMessage('❌ Invalid OTP code! Please request the valid 6-digit receiver security OTP.');
      return;
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTripForPOD) return t;
        return {
          ...t,
          currentMilestone: 'DELIVERY_CONFIRMED',
          escrowStatus: 'RELEASED',
        };
      })
    );

    setPodStatusMessage(
      `🎉 POD Verified Successfully! Proof registered: ${weighbridgeSlip}. ₹${trip.settlementAmountINR} released from Escrow to ${trip.driverName}.`
    );
    setEnteredOtp('');
    setTimeout(() => setPodStatusMessage(''), 8000);
  };

  const handleRunConnector = (connectorId: string, title: string) => {
    setConnectorExecuting(connectorId);
    setTimeout(() => {
      setConnectorExecuting(null);
      setConnectorSuccessMsg(`🚀 Automated Supply Chain Pipeline "${title}" initialized & dispatched to Fleet.`);
      setTimeout(() => setConnectorSuccessMsg(''), 6000);
    }, 1500);
  };

  const handleToggleVehicleStatus = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        const nextStatus = v.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
        return { ...v, status: nextStatus };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden pb-16">
      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid-bg opacity-25" />
        <div className="absolute -top-48 left-1/3 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP STATUS BAR */}
      <div className="relative z-50 bg-[#090E1B]/90 backdrop-blur-2xl border-b border-amber-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full text-[11px] shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 -ml-2.5" />
              <span>LOGISTICS DISPATCH GRID ONLINE</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>5 ACTIVE FLEET UNITS</span>
              <span className="text-slate-600">•</span>
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>EVENT-BASED CORRIDOR TRACKING</span>
              <span className="text-slate-600">•</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ESCROW POD PROTECTED</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>← Back to Primary OS</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/organization"
              className="text-xs text-slate-400 hover:text-cyan-400 transition flex items-center gap-1"
            >
              <Building2 className="w-3 h-3 text-cyan-400" />
              <span>Institutional Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="relative z-40 bg-[#0B1020]/90 backdrop-blur-2xl border-b border-slate-800/80 sticky top-0 font-mono">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Truck className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B1020] flex items-center justify-center text-[7px] font-black text-slate-950">
                M15
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-white bg-clip-text text-transparent">
                  Logistics & Transport Grid
                </h1>
                <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">
                  Agri Supply Chain 4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unified Movement Layer for Tractors, Trailers, Lorries, Inputs & Farm Produce
              </p>
            </div>
          </div>

          {/* PERSONA SWITCHER */}
          <div className="flex items-center gap-1.5 bg-slate-900/95 p-1 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
            <span className="text-[10px] text-slate-500 px-2 font-bold uppercase hidden lg:inline">ROLE:</span>
            {[
              { id: 'LOGISTICS_OPERATOR', label: 'Dispatcher / Operator', icon: '📡' },
              { id: 'FLEET_OWNER', label: 'Tractor / Fleet Owner', icon: '🚜' },
              { id: 'FARMER_SHIPPER', label: 'Farmer / Shipper', icon: '🌾' },
              { id: 'BUYER_RECEIVER', label: 'Buyer / Warehouse', icon: '🏢' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as LogisticsRole)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeRole === role.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LOGISTICS NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto border-t border-slate-800/60 py-2.5">
          {[
            { id: 'DISPATCH_MATCHING', label: '🚚 Transport Dispatch & Matching', count: `${requests.length} REQS` },
            { id: 'FLEET_ASSETS', label: '🚜 Fleet & Trailer Assets', count: `${vehicles.length} VEHICLES` },
            { id: 'DRIVER_OPERATIONS', label: '🆔 Driver Operations', count: `${drivers.length} VERIFIED` },
            { id: 'ACTIVE_TRIPS', label: '🗺️ Active Trips & Telemetry', count: `${trips.length} LIVE` },
            { id: 'POD_VERIFICATION', label: '📦 Proof of Delivery (POD)', count: 'OTP & ESCROW' },
            { id: 'SUPPLY_CONNECTORS', label: '🌾 Farm-to-Market Pipelines', count: '3 FLOWS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === tab.id ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* MAIN COCKPIT BODY */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* TOP QUICK METRICS OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Available Fleet</span>
              <Tractor className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {vehicles.filter((v) => v.status === 'AVAILABLE').length} / {vehicles.length}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <Check className="w-3 h-3" /> Ready for immediate dispatch
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active In-Transit Cargo</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              9,500 <span className="text-sm font-sans text-slate-400">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">2 multi-stop corridors active</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Escrow Freight Value</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">₹6,250</div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Protected until OTP sign-off</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Avg Dispatch Response</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">4.2 min</div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">98.2% on-time fulfillment</p>
          </div>
        </div>

        {/* TAB 1: TRANSPORT DISPATCH & VEHICLE MATCHING */}
        {activeTab === 'DISPATCH_MATCHING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: CREATE NEW TRANSPORT REQUEST */}
            <div className="lg:col-span-5 bg-[#0D1424]/90 border border-amber-500/20 rounded-2xl p-5 relative">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-base">New Agricultural Transport Request</h3>
              </div>

              {createMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  {createMsg}
                </div>
              )}

              <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Movement Category</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="HARVEST_EVACUATION">🌾 Harvest Evacuation (Farm → FPO/Mandi)</option>
                    <option value="INPUT_DELIVERY">🧪 Fertilizer & Seed Delivery (Supplier → Farm)</option>
                    <option value="EQUIPMENT_RELOCATION">🚜 Heavy Machinery & Implement Transport</option>
                    <option value="PRODUCE_MARKET">🏢 Bulk Produce to Aggregator / Mill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cargo Description</label>
                  <input
                    type="text"
                    value={cargoName}
                    onChange={(e) => setCargoName(e.target.value)}
                    placeholder="e.g. Cotton Hybrid-6 Bales, Neem Urea Bags, Harvester Implement"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Total Cargo Weight (kg)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                      min={100}
                      max={25000}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Required Vehicle</label>
                    <select
                      value={selectedVehicleType}
                      onChange={(e) => setSelectedVehicleType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="TRACTOR_TRAILER">Tractor + 5T Trailer</option>
                      <option value="MINI_TRUCK">Mini Truck (1.5-Ton Ace)</option>
                      <option value="LORRY_MEDIUM">Medium Lorry (4.5-Ton)</option>
                      <option value="TRUCK_HEAVY">Heavy Truck (10-Ton)</option>
                      <option value="WATER_TANKER">Water Tanker (5000L)</option>
                    </select>
                  </div>
                </div>

                {isOverweight && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      Cargo ({weightKg} kg) exceeds vehicle capacity ({selectedVehicleCapacity} kg). Please select a
                      larger vehicle.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Origin (Pickup)</label>
                    <input
                      type="text"
                      value={originText}
                      onChange={(e) => setOriginText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Destination (Drop)</label>
                    <input
                      type="text"
                      value={destText}
                      onChange={(e) => setDestText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Distance (km)</label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Estimated Distance:</span>
                    <span className="font-mono text-slate-200">{distanceKm} km</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Base Freight + Loading Escrow:</span>
                    <span className="font-mono text-amber-300 font-bold text-sm">₹{estimatedCost}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOverweight}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                    isOverweight
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Dispatch Request & Match Vehicles</span>
                </button>
              </form>
            </div>

            {/* RIGHT: LIVE TRANSPORT REQUESTS & MATCHING QUEUE */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-slate-200 text-sm">Active Transport Requests & Matching Queue</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{requests.length} Requests active</span>
              </div>

              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold">{req.trackingCode}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                          {req.requestType.replace('_', ' ')}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                          req.status === 'OFFERED'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : req.status === 'BOOKED'
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Cargo: </span>
                        <span className="text-slate-200 font-medium">
                          {req.cargoType} ({req.weightKg} kg / {req.unit})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Pickup Schedule: </span>
                        <span className="text-slate-200">{req.pickupTime}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5 font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{req.origin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 pl-4 border-l border-dashed border-slate-700 ml-1.5">
                        <ChevronRight className="w-3 h-3 text-amber-400" />
                        <span className="text-slate-400">{req.distanceKm} km direct rural route</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{req.destination}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Tractor className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-400">Matched Asset: </span>
                        <span className="text-amber-300 font-semibold">{req.matchedVehicle || 'Scanning Fleet...'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">₹{req.estimatedCostINR}</span>
                        {req.status === 'OFFERED' && (
                          <button
                            onClick={() => {
                              setRequests((prev) =>
                                prev.map((r) => (r.id === req.id ? { ...r, status: 'BOOKED' } : r))
                              );
                            }}
                            className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-lg font-bold hover:bg-amber-500/30 transition text-xs"
                          >
                            Accept & Lock Escrow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLEET & VEHICLE ASSET MANAGEMENT */}
        {activeTab === 'FLEET_ASSETS' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Agricultural Fleet & Multi-Role Asset Roster</h3>
                <p className="text-xs text-slate-400">
                  Tractor + Trailer combinations, Lorries, Tankers & verified rural haulers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Tractor/Trailer Multi-Role Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl transition space-y-4 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        {veh.vehicleType.includes('TRACTOR') ? (
                          <Tractor className="w-5 h-5" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{veh.displayName}</h4>
                        <span className="font-mono text-xs text-slate-400">{veh.registrationNumber}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        veh.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : veh.status === 'IN_TRANSIT'
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Payload Capacity</span>
                      <span className="font-mono font-bold text-slate-200">
                        {veh.capacityKg.toLocaleString()} kg ({veh.capacityVolumeCft} cft)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Standard Rate</span>
                      <span className="font-mono font-bold text-amber-300">₹{veh.ratePerKm} / km</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Owner / Operator</span>
                      <span className="text-slate-300 truncate block">{veh.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Trust Index</span>
                      <span className="font-mono text-emerald-400 font-bold">{veh.trustScore}% Verified</span>
                    </div>
                  </div>

                  {veh.trailerAttached && (
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Attached: {veh.trailerType?.replace(/_/g, ' ')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{veh.currentLocation}</span>
                    </div>

                    <button
                      onClick={() => handleToggleVehicleStatus(veh.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px] font-mono transition"
                    >
                      Toggle {veh.status === 'AVAILABLE' ? 'Offline' : 'Online'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DRIVER OPERATIONS & LICENSURE */}
        {activeTab === 'DRIVER_OPERATIONS' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Verified Driver Network & Licensure</h3>
                <p className="text-xs text-slate-400">
                  Heavy Commercial (HMV), LMV Transport & Tractor-Trailer Licensed Operators
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-base">
                        {driver.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-100 text-sm">{driver.name}</h4>
                          {driver.verified && (
                            <span title="Government Verified License">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-slate-400">{driver.phone}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                        driver.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : driver.status === 'ON_TRIP'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {driver.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">License Number</span>
                      <span className="text-slate-200 font-bold">{driver.licenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">License Category</span>
                      <span className="text-cyan-400 font-bold">{driver.licenseCategory}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">Experience</span>
                      <span className="text-slate-300">{driver.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">Trips Completed</span>
                      <span className="text-emerald-400 font-bold">{driver.totalTripsCompleted} Deliveries</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assigned: {driver.assignedVehicleReg || 'Pool Driver'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                      <span>★</span>
                      <span>{driver.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVE TRIPS & EVENT TIMELINE */}
        {activeTab === 'ACTIVE_TRIPS' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Active Trips & Event-Based Telemetry</h3>
                <p className="text-xs text-slate-400">
                  Milestone-driven corridor monitoring with zero heavy GPS overhead
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {trips.map((trip) => {
                const currentIdx = MILESTONE_ORDER.indexOf(trip.currentMilestone);
                return (
                  <div
                    key={trip.id}
                    className="bg-[#0D1424]/90 border border-slate-800 p-5 rounded-2xl space-y-4 relative"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400">{trip.referenceCode}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                            {trip.currentMilestone.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">{trip.cargoDescription}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-mono">Escrow Settlement</div>
                        <div className="text-base font-mono font-bold text-cyan-300">
                          ₹{trip.settlementAmountINR}{' '}
                          <span className="text-xs text-slate-400">({trip.escrowStatus})</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400">Origin: </span>
                        <span className="text-slate-200">{trip.originName}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Destination: </span>
                        <span className="text-slate-200">{trip.destinationName}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Driver / Vehicle: </span>
                        <span className="text-slate-200">
                          {trip.driverName} • {trip.vehicleName}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Started: </span>
                        <span className="text-slate-200 font-mono">{trip.startedAt}</span>
                      </div>
                    </div>

                    {/* EVENT TIMELINE STEPPER */}
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-400 font-mono uppercase block mb-3">
                        Progress Milestones (Event Sequence)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                        {MILESTONE_ORDER.map((milestone, idx) => {
                          const isDone = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div
                              key={milestone}
                              className={`p-2 rounded-xl text-center border text-[10px] font-mono transition ${
                                isCurrent
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.25)] animate-pulse'
                                  : isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
                              }`}
                            >
                              <div className="mb-1 font-bold">Step {idx + 1}</div>
                              <div className="truncate text-[9px]">{milestone.replace(/_/g, ' ')}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Security OTP for Delivery: </span>
                        <span className="text-cyan-300 font-bold tracking-widest">{trip.otpCode}</span>
                      </div>

                      {currentIdx < MILESTONE_ORDER.length - 1 && (
                        <button
                          onClick={() => handleAdvanceMilestone(trip.id)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 transition flex items-center gap-1.5"
                        >
                          <span>Advance Next Milestone</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PROOF OF DELIVERY (POD) & RECEIVING */}
        {activeTab === 'POD_VERIFICATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-[#0D1424]/90 border border-emerald-500/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base">Proof of Delivery (POD) & Escrow Settlement</h3>
              </div>

              <p className="text-xs text-slate-400">
                Consignee verifies OTP, enters weighbridge gross tare readings, and confirms physical cargo handover to
                trigger instant contractor/transporter payout.
              </p>

              {podStatusMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono leading-relaxed">
                  {podStatusMessage}
                </div>
              )}

              <form onSubmit={handleVerifyPOD} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Select Active Consignment</label>
                  <select
                    value={selectedTripForPOD}
                    onChange={(e) => setSelectedTripForPOD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.referenceCode} - {t.cargoDescription} (OTP: {t.otpCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">6-Digit Consignee Receiving OTP</label>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP given by recipient"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-mono text-sm tracking-widest"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    (Tip: Enter the OTP displayed on the trip card e.g. 849201 or 123456)
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Receiver Name / Organization</label>
                  <input
                    type="text"
                    value={receiverSignature}
                    onChange={(e) => setReceiverSignature(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Weighbridge / Delivery Note Slip</label>
                  <input
                    type="text"
                    value={weighbridgeSlip}
                    onChange={(e) => setWeighbridgeSlip(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify POD & Release Escrow Payment</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Deterministic Settlement Architecture</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  RuralConnect logistics uses deterministic escrow release: No freight payouts occur until the digital
                  handshake between driver and consignee completes. This prevents freight disputes, weight fraud, and
                  unauthorized drop-offs.
                </p>

                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Cryptographic OTP verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Weighbridge tare/gross difference validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Instant automatic ledger journal credit to driver wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AGRICULTURAL SUPPLY CHAIN CONNECTORS */}
        {activeTab === 'SUPPLY_CONNECTORS' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Pre-Configured Agricultural Supply Chain Pipelines</h3>
              <p className="text-xs text-slate-400">
                1-Click end-to-end multi-party logistics workflows connecting inputs, farms, FPOs and buyers
              </p>
            </div>

            {connectorSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {connectorSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* FLOW 1 */}
              <div className="bg-[#0D1424]/90 border border-amber-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">1. Farm Gate → FPO Evacuation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rapid evacuation of harvested cotton/groundnut using local tractor-trailers to avoid rain damage and
                    field congestion.
                  </p>
                  <div className="text-xs font-mono space-y-1 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>Vehicle: Tractor + 5T Trailer</div>
                    <div>Route: 12-18 km rural roads</div>
                    <div>Est. Rate: ₹40/km + ₹350 Loading</div>
                  </div>
                </div>

                <button
                  onClick={() => handleRunConnector('flow-1', 'Farm Gate → FPO Evacuation')}
                  disabled={connectorExecuting === 'flow-1'}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  {connectorExecuting === 'flow-1' ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>Launch Evacuation Pipeline</span>
                </button>
              </div>

              {/* FLOW 2 */}
              <div className="bg-[#0D1424]/90 border border-cyan-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">2. Supplier → Farm Delivery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bulk delivery of Neem Urea & seeds from district distributor depots directly to village farm clusters.
                  </p>
                  <div className="text-xs font-mono space-y-1 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>Vehicle: 4.5-Ton Medium Lorry</div>
                    <div>Route: 25-45 km highway + rural</div>
                    <div>Est. Rate: ₹55/km + Escrow Lock</div>
                  </div>
                </div>

                <button
                  onClick={() => handleRunConnector('flow-2', 'Supplier → Farm Delivery')}
                  disabled={connectorExecuting === 'flow-2'}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  {connectorExecuting === 'flow-2' ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>Launch Input Pipeline</span>
                </button>
              </div>

              {/* FLOW 3 */}
              <div className="bg-[#0D1424]/90 border border-purple-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">3. FPO → Buyer Processing Mill</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Heavy multi-ton haulage from FPO warehouse to institutional textile spinning mills and oil extraction plants.
                  </p>
                  <div className="text-xs font-mono space-y-1 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>Vehicle: 10-Ton Heavy Multi-Axle</div>
                    <div>Route: 60-150 km corridor</div>
                    <div>Est. Rate: ₹85/km + Weighbridge POD</div>
                  </div>
                </div>

                <button
                  onClick={() => handleRunConnector('flow-3', 'FPO → Buyer Processing Mill')}
                  disabled={connectorExecuting === 'flow-3'}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  {connectorExecuting === 'flow-3' ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>Launch Mill Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
