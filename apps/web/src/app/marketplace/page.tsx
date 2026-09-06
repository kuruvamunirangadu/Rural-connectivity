'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Layers,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Plus,
  Search,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  Lock,
  AlertTriangle,
  History,
  Check,
  X,
} from 'lucide-react';

export type MarketplaceRole = 'COMMODITY_BUYER' | 'FPO_MANAGER' | 'INDIVIDUAL_FARMER' | 'QUALITY_INSPECTOR';

interface ProduceListingItem {
  id: string;
  code: string;
  sellerId?: string;
  sellerName: string;
  organizationId?: string;
  organizationName?: string;
  sellerType: 'FPO' | 'FARMER';
  cropName: string;
  cropVariety: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  harvestDate: string;
  qualityGrade: string;
  district: string;
  mandal: string;
  village: string;
  askingPrice: number;
  priceUnit: string;
  description: string;
  status: 'AVAILABLE' | 'PARTIALLY_COMMITTED' | 'COMMITTED' | 'SOLD';
  verificationTier: 'UNVERIFIED' | 'SELF_DECLARED' | 'FPO_INSPECTED' | 'LAB_CERTIFIED' | 'GOVERNMENT_GRADED';
  moisturePercent?: number;
  tags: string[];
}

interface OfferRevisionItem {
  revisionNumber: number;
  initiatedBy: 'BUYER' | 'SELLER';
  initiatorName: string;
  offeredQuantity: number;
  offeredUnitPrice: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  message: string;
  createdAt: string;
}

interface ProduceOfferItem {
  id: string;
  offerNumber: string;
  listingId: string;
  cropName: string;
  buyerName: string;
  buyerOrganization: string;
  sellerName: string;
  offeredQuantity: number;
  offeredUnitPrice: number;
  unit: string;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  currentRevision: number;
  status: 'PENDING_SELLER_REVIEW' | 'PENDING_BUYER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  expiresAt: string;
  revisions: OfferRevisionItem[];
}

interface OrderItemRecord {
  id: string;
  orderNumber: string;
  cropName: string;
  cropVariety: string;
  qualityGrade: string;
  buyerName: string;
  sellerName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  platformFee: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  escrowStatus: 'NOT_FUNDED' | 'ESCROW_HELD' | 'PARTIALLY_RELEASED' | 'RELEASED' | 'REFUNDED';
  status: 'CONFIRMED' | 'IN_FULFILLMENT' | 'LOGISTICS_DISPATCHED' | 'DELIVERED' | 'SETTLED' | 'DISPUTED' | 'CANCELLED';
  transportRequestId?: string;
  disputeReason?: string;
  createdAt: string;
}

interface AggregationLotItem {
  id: string;
  farmerName: string;
  farmerVillage: string;
  contributedQuantity: number;
  unit: string;
  unitPricePayable: number;
  inwardDate: string;
  qualityPassed: boolean;
}

interface AggregationBatch {
  id: string;
  batchCode: string;
  organizationName: string;
  collectionCenter: string;
  cropName: string;
  cropVariety: string;
  qualityGrade: string;
  targetQuantity: number;
  collectedQuantity: number;
  unit: string;
  status: 'COLLECTING' | 'AGGREGATED' | 'LISTED' | 'DISPATCHED';
  publishedListingId?: string;
  items: AggregationLotItem[];
}

export default function AgriculturalMarketplacePage() {
  const [activeRole, setActiveRole] = useState<MarketplaceRole>('COMMODITY_BUYER');
  const [activeTab, setActiveTab] = useState<
    'discovery' | 'aggregation' | 'offers' | 'orders' | 'fulfillment' | 'intelligence'
  >('discovery');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedSellerType, setSelectedSellerType] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');

  // Interactive state: Listings
  const [listings, setListings] = useState<ProduceListingItem[]>([
    {
      id: 'prd-cotton-01',
      code: 'PRD-2026-COT-01',
      sellerName: 'Kalyandurg Cotton FPO Cluster (42 Member Farmers)',
      organizationId: 'org-kalyan-fpo',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      sellerType: 'FPO',
      cropName: 'Cotton (Long-Staple Bt-2)',
      cropVariety: 'Brahma 32mm Staple',
      quantity: 450,
      availableQuantity: 450,
      unit: 'Quintals',
      harvestDate: '2026-02-14',
      qualityGrade: 'Grade A (32mm)',
      district: 'Mahbubnagar',
      mandal: 'Kalyan Zone',
      village: 'Central Aggregation Yard',
      askingPrice: 7400,
      priceUnit: 'INR/Quintal',
      description: 'Standard machine-ginned export lot with 32mm staple length. Moisture certified at 7.4%.',
      status: 'AVAILABLE',
      verificationTier: 'FPO_INSPECTED',
      moisturePercent: 7.4,
      tags: ['FPO Aggregated', '32mm Long Staple', 'Export Quality', 'Zero Trash'],
    },
    {
      id: 'prd-paddy-02',
      code: 'PRD-2026-PAD-02',
      sellerName: 'Deccan Organic Farmers Coop (18 Farmers)',
      organizationId: 'org-deccan-coop',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      sellerType: 'FPO',
      cropName: 'Sona Masoori Organic Paddy',
      cropVariety: 'BPT 5204 (NPOP Certified)',
      quantity: 280,
      availableQuantity: 280,
      unit: 'Quintals',
      harvestDate: '2026-02-16',
      qualityGrade: 'Export Grade 1',
      district: 'Ranga Reddy',
      mandal: 'Chevella',
      village: 'Chevella Storage Hub',
      askingPrice: 2850,
      priceUnit: 'INR/Quintal',
      description: 'NPOP organic certified aromatic slender grain paddy. Verified zero pesticide residue.',
      status: 'AVAILABLE',
      verificationTier: 'LAB_CERTIFIED',
      moisturePercent: 12.1,
      tags: ['NPOP Organic Certified', 'Aromatic Grain', 'Chevella Cluster'],
    },
    {
      id: 'prd-groundnut-03',
      code: 'PRD-2026-GNT-03',
      sellerId: 'usr-ravi-001',
      sellerName: 'Ravi Kumar (Direct Farmer)',
      sellerType: 'FARMER',
      cropName: 'Groundnut (K-6 Bold Pods)',
      cropVariety: 'Kadiri-6 High Oil',
      quantity: 80,
      availableQuantity: 80,
      unit: 'Quintals',
      harvestDate: '2026-02-18',
      qualityGrade: 'Grade A',
      district: 'Vikarabad',
      mandal: 'Tandur',
      village: 'Tangipalli',
      askingPrice: 6900,
      priceUnit: 'INR/Quintal',
      description: 'Bold groundnut pods harvested from 5-acre irrigated black soil plot. Sun-dried to perfection.',
      status: 'AVAILABLE',
      verificationTier: 'SELF_DECLARED',
      moisturePercent: 6.8,
      tags: ['Direct Farmer', 'Kadiri-6 High Oil', 'Black Soil'],
    },
    {
      id: 'prd-chilli-04',
      code: 'PRD-2026-CHL-04',
      sellerId: 'usr-suresh-002',
      sellerName: 'Suresh Reddy (Direct Farmer)',
      sellerType: 'FARMER',
      cropName: 'Guntur Red Chilli (Teja)',
      cropVariety: 'Teja S17 Hot Dry',
      quantity: 50,
      availableQuantity: 50,
      unit: 'Quintals',
      harvestDate: '2026-02-19',
      qualityGrade: 'Grade A Export',
      district: 'Guntur',
      mandal: 'Tenali',
      village: 'Tenali Rural',
      askingPrice: 19500,
      priceUnit: 'INR/Quintal',
      description: 'Deep red high pungency Teja dry chillies without stalks. Verified SHU 75,000+.',
      status: 'AVAILABLE',
      verificationTier: 'GOVERNMENT_GRADED',
      moisturePercent: 9.5,
      tags: ['High SHU Pungency', 'Stalkless Dry', 'Export Quality'],
    },
  ]);

  // Aggregation Batches
  const [aggregationBatches, setAggregationBatches] = useState<AggregationBatch[]>([
    {
      id: 'agg-cot-batch-01',
      batchCode: 'AGG-2026-COT-B01',
      organizationName: 'Kalyandurg Cotton & Groundnut Producer Co. Ltd.',
      collectionCenter: 'Kalyan Central Aggregation Yard',
      cropName: 'Cotton (Long-Staple Bt-2)',
      cropVariety: 'Brahma 32mm Staple',
      qualityGrade: 'Grade A (32mm)',
      targetQuantity: 500,
      collectedQuantity: 450,
      unit: 'Quintals',
      status: 'LISTED',
      publishedListingId: 'prd-cotton-01',
      items: [
        {
          id: 'lot-1',
          farmerName: 'K. Venkatesh',
          farmerVillage: 'Kalyandurg South',
          contributedQuantity: 120,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-14',
          qualityPassed: true,
        },
        {
          id: 'lot-2',
          farmerName: 'M. Lakshmi Narayana',
          farmerVillage: 'Brahmasamudram',
          contributedQuantity: 180,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-14',
          qualityPassed: true,
        },
        {
          id: 'lot-3',
          farmerName: 'B. Srinivas',
          farmerVillage: 'Settur Mandal',
          contributedQuantity: 150,
          unit: 'Quintals',
          unitPricePayable: 7300,
          inwardDate: '2026-02-15',
          qualityPassed: true,
        },
      ],
    },
    {
      id: 'agg-pad-batch-02',
      batchCode: 'AGG-2026-PAD-B02',
      organizationName: 'Deccan Watershed & Organic Farmers Cooperative',
      collectionCenter: 'Chevella Organic Storage Hub',
      cropName: 'Sona Masoori Organic Paddy',
      cropVariety: 'BPT 5204 (NPOP Certified)',
      qualityGrade: 'Export Grade 1',
      targetQuantity: 300,
      collectedQuantity: 280,
      unit: 'Quintals',
      status: 'LISTED',
      publishedListingId: 'prd-paddy-02',
      items: [
        {
          id: 'lot-11',
          farmerName: 'G. Ramana',
          farmerVillage: 'Chevella West',
          contributedQuantity: 140,
          unit: 'Quintals',
          unitPricePayable: 2800,
          inwardDate: '2026-02-16',
          qualityPassed: true,
        },
        {
          id: 'lot-12',
          farmerName: 'S. Chandrasekhar',
          farmerVillage: 'Shabad Valley',
          contributedQuantity: 140,
          unit: 'Quintals',
          unitPricePayable: 2800,
          inwardDate: '2026-02-16',
          qualityPassed: true,
        },
      ],
    },
  ]);

  // Active Offers
  const [offers, setOffers] = useState<ProduceOfferItem[]>([
    {
      id: 'ofr-cot-101',
      offerNumber: 'OFR-2026-COT-101',
      listingId: 'prd-cotton-01',
      cropName: 'Cotton (Long-Staple Bt-2)',
      buyerName: 'Vikram Mehta',
      buyerOrganization: 'Deccan Mills & Agro-Industrial Ltd.',
      sellerName: 'Kalyandurg Cotton FPO Cluster',
      offeredQuantity: 300,
      offeredUnitPrice: 7350,
      unit: 'Quintals',
      totalAmount: 2205000,
      paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
      deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
      currentRevision: 1,
      status: 'PENDING_SELLER_REVIEW',
      expiresAt: '2026-03-01',
      revisions: [
        {
          revisionNumber: 1,
          initiatedBy: 'BUYER',
          initiatorName: 'Vikram Mehta (Deccan Mills)',
          offeredQuantity: 300,
          offeredUnitPrice: 7350,
          totalAmount: 2205000,
          paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
          deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
          message: 'Initial commercial offer for 300Q bulk lot with 7-day pickup guarantee.',
          createdAt: '2026-02-18 10:00',
        },
      ],
    },
    {
      id: 'ofr-gnt-102',
      offerNumber: 'OFR-2026-GNT-102',
      listingId: 'prd-groundnut-03',
      cropName: 'Groundnut (K-6 Bold Pods)',
      buyerName: 'Ramesh Agro Oils',
      buyerOrganization: 'Telangana Agro Oil Refineries Ltd.',
      sellerName: 'Ravi Kumar (Direct Farmer)',
      offeredQuantity: 80,
      offeredUnitPrice: 6850,
      unit: 'Quintals',
      totalAmount: 548000,
      paymentTerms: '100% Escrow on Gate Inward',
      deliveryTerms: 'Buyer arranges truck pickup at Tangipalli farm gate',
      currentRevision: 2,
      status: 'PENDING_BUYER_REVIEW',
      expiresAt: '2026-03-05',
      revisions: [
        {
          revisionNumber: 1,
          initiatedBy: 'BUYER',
          initiatorName: 'Ramesh Agro Oils',
          offeredQuantity: 80,
          offeredUnitPrice: 6700,
          totalAmount: 536000,
          paymentTerms: '100% Escrow on Gate Inward',
          deliveryTerms: 'Buyer truck pickup',
          message: 'Initial offer for whole lot at spot index.',
          createdAt: '2026-02-19 09:00',
        },
        {
          revisionNumber: 2,
          initiatedBy: 'SELLER',
          initiatorName: 'Ravi Kumar (Farmer)',
          offeredQuantity: 80,
          offeredUnitPrice: 6850,
          totalAmount: 548000,
          paymentTerms: '100% Escrow on Gate Inward',
          deliveryTerms: 'Buyer arranges truck pickup at Tangipalli farm gate',
          message: 'Counter-offer: Quality is clean Grade-A bold pods, minimum 6850 INR/Q.',
          createdAt: '2026-02-19 14:30',
        },
      ],
    },
  ]);

  // Active Orders
  const [orders, setOrders] = useState<OrderItemRecord[]>([
    {
      id: 'ord-cot-8801',
      orderNumber: 'ORD-2026-COT-8801',
      cropName: 'Cotton (Long-Staple Bt-2)',
      cropVariety: 'Brahma 32mm Staple',
      qualityGrade: 'Grade A (32mm)',
      buyerName: 'Vikram Mehta (Deccan Mills)',
      sellerName: 'Kalyandurg Cotton FPO Cluster',
      quantity: 300,
      unit: 'Quintals',
      unitPrice: 7350,
      subtotal: 2205000,
      platformFee: 22050,
      totalAmount: 2227050,
      paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
      deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
      escrowStatus: 'ESCROW_HELD',
      status: 'LOGISTICS_DISPATCHED',
      transportRequestId: 'TRK-M15-88219',
      createdAt: '2026-02-19 11:00',
    },
  ]);

  // Modals & UI forms
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAggregationModal, setShowAggregationModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<ProduceListingItem | null>(null);
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<ProduceOfferItem | null>(null);

  // Form states
  const [offerFormQty, setOfferFormQty] = useState<number>(100);
  const [offerFormPrice, setOfferFormPrice] = useState<number>(7350);
  const [offerFormMsg, setOfferFormMsg] = useState('');
  const [counterPrice, setCounterPrice] = useState<number>(7400);
  const [counterMsg, setCounterMsg] = useState('');

  // New Listing Form
  const [newCropName, setNewCropName] = useState('Cotton (Long-Staple Bt-2)');
  const [newCropVariety, setNewCropVariety] = useState('Brahma 32mm');
  const [newQty, setNewQty] = useState(100);
  const [newPrice, setNewPrice] = useState(7400);
  const [newDistrict, setNewDistrict] = useState('Mahbubnagar');
  const [newMandal, setNewMandal] = useState('Kalyandurg');
  const [newVillage, setNewVillage] = useState('Central Village');
  const [newGrade, setNewGrade] = useState('Grade A');
  const [newDesc, setNewDesc] = useState('Clean agricultural commodity harvest.');

  // New Aggregation Lot Form
  const [targetBatchId, setTargetBatchId] = useState('agg-cot-batch-01');
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newLotCrop, setNewLotCrop] = useState('Cotton (Long-Staple Bt-2)');
  const [newLotVariety, setNewLotVariety] = useState('Brahma 32mm Staple');
  const [newLotGrade, setNewLotGrade] = useState('Grade A (32mm)');
  const [newLotQty, setNewLotQty] = useState(50);
  const [newLotPrice, setNewLotPrice] = useState(7300);
  const [aggregationError, setAggregationError] = useState('');

  // Filtering listings
  const filteredListings = listings.filter((l) => {
    if (selectedCrop !== 'ALL' && !l.cropName.toLowerCase().includes(selectedCrop.toLowerCase())) return false;
    if (selectedSellerType === 'FPO' && l.sellerType !== 'FPO') return false;
    if (selectedSellerType === 'FARMER' && l.sellerType !== 'FARMER') return false;
    if (selectedDistrict !== 'ALL' && l.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (selectedGrade !== 'ALL' && !l.qualityGrade.includes(selectedGrade)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.cropName.toLowerCase().includes(q) ||
        l.cropVariety.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Action: Submit New Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `prd-${Date.now().toString(36)}`;
    const code = `PRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isFPO = activeRole === 'FPO_MANAGER';

    const item: ProduceListingItem = {
      id: newId,
      code,
      sellerName: isFPO
        ? 'Kalyandurg FPO Cluster (Aggregated Farmers)'
        : 'Ravi Kumar (Verified Producer)',
      sellerType: isFPO ? 'FPO' : 'FARMER',
      organizationName: isFPO ? 'Kalyandurg Producer Co.' : undefined,
      cropName: newCropName,
      cropVariety: newCropVariety,
      quantity: newQty,
      availableQuantity: newQty,
      unit: 'Quintals',
      harvestDate: new Date().toISOString().split('T')[0],
      qualityGrade: newGrade,
      district: newDistrict,
      mandal: newMandal,
      village: newVillage,
      askingPrice: newPrice,
      priceUnit: 'INR/Quintal',
      description: newDesc,
      status: 'AVAILABLE',
      verificationTier: isFPO ? 'FPO_INSPECTED' : 'SELF_DECLARED',
      moisturePercent: 8.0,
      tags: [isFPO ? 'FPO Aggregation' : 'Direct Producer', newGrade],
    };

    setListings([item, ...listings]);
    setShowNewListingModal(false);
  };

  // Action: Submit Buyer Offer
  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;

    if (offerFormQty > selectedListingForOffer.availableQuantity) {
      alert(`Cannot offer for ${offerFormQty} Q. Only ${selectedListingForOffer.availableQuantity} Q available!`);
      return;
    }

    const offerId = `ofr-${Date.now().toString(36)}`;
    const offerNumber = `OFR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = offerFormQty * offerFormPrice;

    const newOffer: ProduceOfferItem = {
      id: offerId,
      offerNumber,
      listingId: selectedListingForOffer.id,
      cropName: selectedListingForOffer.cropName,
      buyerName: 'Vikram Mehta (Deccan Mills)',
      buyerOrganization: 'Deccan Mills & Agro-Industrial Ltd.',
      sellerName: selectedListingForOffer.sellerName,
      offeredQuantity: offerFormQty,
      offeredUnitPrice: offerFormPrice,
      unit: selectedListingForOffer.unit,
      totalAmount,
      paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
      deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
      currentRevision: 1,
      status: 'PENDING_SELLER_REVIEW',
      expiresAt: '2026-03-05',
      revisions: [
        {
          revisionNumber: 1,
          initiatedBy: 'BUYER',
          initiatorName: 'Vikram Mehta (Deccan Mills)',
          offeredQuantity: offerFormQty,
          offeredUnitPrice: offerFormPrice,
          totalAmount,
          paymentTerms: '20% Advance Escrow, 80% on Dispatch Inspection',
          deliveryTerms: 'Seller arranged transport to Mahbubnagar rail yard',
          message: offerFormMsg || 'Commercial produce offer submitted via RuralConnect.',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };

    setOffers([newOffer, ...offers]);
    setShowOfferModal(false);
    setActiveTab('offers');
  };

  // Action: Accept Offer & Create Order (Zero Overselling Guard)
  const handleAcceptOffer = (offer: ProduceOfferItem) => {
    // 1. Find Listing
    const listing = listings.find((l) => l.id === offer.listingId);
    if (!listing) {
      alert('Associated listing not found.');
      return;
    }

    if (offer.offeredQuantity > listing.availableQuantity) {
      alert(
        `[ZERO OVERSELLING GUARD] Cannot fulfill ${offer.offeredQuantity} Q. Only ${listing.availableQuantity} Q remains available in stock!`
      );
      return;
    }

    // 2. Decrement available inventory atomically
    const remainingQty = listing.availableQuantity - offer.offeredQuantity;
    const newStatus = remainingQty <= 0 ? 'COMMITTED' : 'PARTIALLY_COMMITTED';

    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id
          ? {
              ...l,
              availableQuantity: remainingQty,
              status: newStatus,
            }
          : l
      )
    );

    // 3. Mark offer accepted
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id
          ? {
              ...o,
              status: 'ACCEPTED',
            }
          : o
      )
    );

    // 4. Create confirmed order
    const orderId = `ord-${Date.now().toString(36)}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const platformFee = Math.round(offer.totalAmount * 0.01);

    const newOrder: OrderItemRecord = {
      id: orderId,
      orderNumber,
      cropName: offer.cropName,
      cropVariety: listing.cropVariety,
      qualityGrade: listing.qualityGrade,
      buyerName: offer.buyerName,
      sellerName: offer.sellerName,
      quantity: offer.offeredQuantity,
      unit: offer.unit,
      unitPrice: offer.offeredUnitPrice,
      subtotal: offer.totalAmount,
      platformFee,
      totalAmount: offer.totalAmount + platformFee,
      paymentTerms: offer.paymentTerms,
      deliveryTerms: offer.deliveryTerms,
      escrowStatus: 'ESCROW_HELD',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOrders([newOrder, ...orders]);
    setActiveTab('orders');
  };

  // Action: Counter Offer
  const handleCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForCounter) return;

    const revNum = selectedOfferForCounter.currentRevision + 1;
    const isSeller = activeRole === 'FPO_MANAGER' || activeRole === 'INDIVIDUAL_FARMER';
    const totalAmount = selectedOfferForCounter.offeredQuantity * counterPrice;

    const newRev: OfferRevisionItem = {
      revisionNumber: revNum,
      initiatedBy: isSeller ? 'SELLER' : 'BUYER',
      initiatorName: isSeller ? selectedOfferForCounter.sellerName : selectedOfferForCounter.buyerName,
      offeredQuantity: selectedOfferForCounter.offeredQuantity,
      offeredUnitPrice: counterPrice,
      totalAmount,
      paymentTerms: selectedOfferForCounter.paymentTerms,
      deliveryTerms: selectedOfferForCounter.deliveryTerms,
      message: counterMsg || `Counter-offer terms updated to ${counterPrice} INR/Q.`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOffers((prev) =>
      prev.map((o) =>
        o.id === selectedOfferForCounter.id
          ? {
              ...o,
              currentRevision: revNum,
              offeredUnitPrice: counterPrice,
              totalAmount,
              status: isSeller ? 'PENDING_BUYER_REVIEW' : 'PENDING_SELLER_REVIEW',
              revisions: [...o.revisions, newRev],
            }
          : o
      )
    );

    setShowCounterModal(false);
  };

  // Action: Add Farmer lot to Aggregation Batch with Compatibility Validation
  const handleAddAggregationLot = (e: React.FormEvent) => {
    e.preventDefault();
    setAggregationError('');

    const batch = aggregationBatches.find((b) => b.id === targetBatchId);
    if (!batch) return;

    // Strict Compatibility Rule: Crop, Variety, Grade
    if (newLotCrop.trim().toLowerCase() !== batch.cropName.trim().toLowerCase()) {
      setAggregationError(`Crop mismatch: Batch requires '${batch.cropName}', received '${newLotCrop}'`);
      return;
    }
    if (newLotVariety.trim().toLowerCase() !== batch.cropVariety.trim().toLowerCase()) {
      setAggregationError(`Variety mismatch: Batch requires '${batch.cropVariety}', received '${newLotVariety}'`);
      return;
    }
    if (newLotGrade.trim() !== batch.qualityGrade.trim()) {
      setAggregationError(`Grade mismatch: Batch requires '${batch.qualityGrade}', received '${newLotGrade}'`);
      return;
    }

    const lotId = `lot-${Date.now().toString(36)}`;
    const newLot: AggregationLotItem = {
      id: lotId,
      farmerName: newFarmerName || 'Participating Smallholder',
      farmerVillage: 'Kalyandurg Cluster Zone',
      contributedQuantity: newLotQty,
      unit: batch.unit,
      unitPricePayable: newLotPrice,
      inwardDate: new Date().toISOString().split('T')[0],
      qualityPassed: true,
    };

    const newCollected = batch.collectedQuantity + newLotQty;
    const isAggregated = newCollected >= batch.targetQuantity;

    setAggregationBatches((prev) =>
      prev.map((b) =>
        b.id === batch.id
          ? {
              ...b,
              collectedQuantity: newCollected,
              status: isAggregated ? 'AGGREGATED' : b.status,
              items: [...b.items, newLot],
            }
          : b
      )
    );

    setShowAggregationModal(false);
    setNewFarmerName('');
  };

  // Action: Publish Master Listing from Aggregation Batch
  const handlePublishAggregationBatch = (batch: AggregationBatch) => {
    const listingId = `prd-${Date.now().toString(36)}`;
    const code = `PRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newListing: ProduceListingItem = {
      id: listingId,
      code,
      sellerName: `${batch.organizationName} (${batch.items.length} Aggregated Farmers)`,
      organizationName: batch.organizationName,
      sellerType: 'FPO',
      cropName: batch.cropName,
      cropVariety: batch.cropVariety,
      quantity: batch.collectedQuantity,
      availableQuantity: batch.collectedQuantity,
      unit: batch.unit,
      harvestDate: new Date().toISOString().split('T')[0],
      qualityGrade: batch.qualityGrade,
      district: 'Mahbubnagar',
      mandal: 'Kalyandurg Zone',
      village: batch.collectionCenter,
      askingPrice: 7450,
      priceUnit: 'INR/Quintal',
      description: `Bulk aggregated master batch of ${batch.collectedQuantity} ${batch.unit} assembled from ${batch.items.length} verified FPO smallholder farmers at ${batch.collectionCenter}.`,
      status: 'AVAILABLE',
      verificationTier: 'FPO_INSPECTED',
      moisturePercent: 7.5,
      tags: ['FPO Aggregation', 'Bulk Lot', batch.qualityGrade],
    };

    setListings([newListing, ...listings]);
    setAggregationBatches((prev) =>
      prev.map((b) => (b.id === batch.id ? { ...b, status: 'LISTED', publishedListingId: listingId } : b))
    );
    setActiveTab('discovery');
  };

  // Action: Settle Order Escrow
  const handleSettleOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'SETTLED',
              escrowStatus: 'RELEASED',
            }
          : o
      )
    );
  };

  // Action: Dispute Order
  const handleDisputeOrder = (orderId: string) => {
    const reason = prompt('Enter dispute reason (e.g., moisture deviation or grade mismatch):');
    if (!reason) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'DISPUTED',
              disputeReason: reason,
            }
          : o
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Cyber Navigation Bar */}
      <header className="border-b border-emerald-900/40 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide">RuralConnect MarketB2B</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MILESTONE 16
              </span>
            </div>
            <p className="text-xs text-slate-400">Agricultural Marketplace & Farm-to-Buyer Commerce Network</p>
          </div>
        </div>

        {/* Persona Switcher Bar */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Perspective:
          </span>
          {[
            { id: 'COMMODITY_BUYER', label: 'Commodity Buyer' },
            { id: 'FPO_MANAGER', label: 'FPO Aggregator' },
            { id: 'INDIVIDUAL_FARMER', label: 'Direct Farmer' },
            { id: 'QUALITY_INSPECTOR', label: 'Quality Assessor' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id as MarketplaceRole)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeRole === role.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
          >
            ← System Overview
          </Link>
          <button
            onClick={() => setShowNewListingModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Post Produce Listing
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Marketplace Metric Hero Banners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Available Commodity Stock</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">860 Quintals</div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" /> Across 4 Certified Lots
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">FPO Aggregation Batches</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-white">730 Quintals</div>
              <p className="text-[11px] text-teal-400 flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3" /> 60 Participating Smallholders
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Active Escrow Valuation</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-amber-300">₹27.75 Lakhs</div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3 text-amber-400" /> 100% Escrow Protected
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Zero Overselling Guard</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-emerald-300">Active & Enforced</div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                Transactional atomic reservation
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto text-sm">
          {[
            { id: 'discovery', label: '🌾 Produce Discovery & Catalog', count: listings.length },
            { id: 'aggregation', label: '🚜 FPO Aggregation Hub', count: aggregationBatches.length },
            { id: 'offers', label: '💬 Offers & Negotiations', count: offers.length },
            { id: 'orders', label: '📋 Orders & Escrow Ledger', count: orders.length },
            { id: 'fulfillment', label: '🚚 Logistics & Fulfillment (M15)' },
            { id: 'intelligence', label: '📊 Market Price Benchmark' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-xl font-bold flex items-center gap-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-800/90 text-emerald-400 border-b-2 border-emerald-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-700/60 text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCE DISCOVERY & CATALOG */}
        {activeTab === 'discovery' && (
          <div className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crop, variety, FPO cluster, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Commodities</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Chilli">Red Chilli</option>
                </select>

                <select
                  value={selectedSellerType}
                  onChange={(e) => setSelectedSellerType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Seller Types</option>
                  <option value="FPO">FPO Bulk Aggregation</option>
                  <option value="FARMER">Direct Farmer</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Districts</option>
                  <option value="Mahbubnagar">Mahbubnagar</option>
                  <option value="Ranga Reddy">Ranga Reddy</option>
                  <option value="Vikarabad">Vikarabad</option>
                  <option value="Guntur">Guntur</option>
                </select>

                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Grades</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Export">Export Grade</option>
                </select>
              </div>
            </div>

            {/* Produce Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/30"
                >
                  <div>
                    {/* Header: Badges & Code */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              listing.sellerType === 'FPO'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {listing.sellerType === 'FPO' ? 'FPO Aggregation Lot' : 'Direct Producer'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{listing.code}</span>
                        </div>
                        <h2 className="text-base font-bold text-white mt-1.5">{listing.cropName}</h2>
                        <p className="text-xs text-slate-400 font-medium">{listing.cropVariety}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-400">
                          ₹{listing.askingPrice.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400">{listing.priceUnit}</span>
                      </div>
                    </div>

                    {/* Stock Meter */}
                    <div className="mt-3.5 bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Available Volume:</span>
                        <span className="font-bold text-white">
                          {listing.availableQuantity} / {listing.quantity} {listing.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            listing.availableQuantity === 0
                              ? 'bg-rose-500'
                              : listing.availableQuantity < listing.quantity
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${(listing.availableQuantity / listing.quantity) * 100}%`,
                          }}
                        />
                      </div>
                      {listing.availableQuantity < listing.quantity && (
                        <p className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Part of stock committed to active contracts
                        </p>
                      )}
                    </div>

                    {/* Quality & Origin Details */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Grade: </span>
                        <strong className="text-white">{listing.qualityGrade}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                        <span>Tier: </span>
                        <strong className="text-teal-300">{listing.verificationTier.replace('_', ' ')}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Location: </span>
                        <span className="truncate">{listing.district}, {listing.mandal}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Harvest: </span>
                        <span>{listing.harvestDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">{listing.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 truncate">Seller: {listing.sellerName}</span>

                    <button
                      disabled={listing.availableQuantity <= 0}
                      onClick={() => {
                        setSelectedListingForOffer(listing);
                        setOfferFormQty(Math.min(100, listing.availableQuantity));
                        setOfferFormPrice(listing.askingPrice);
                        setShowOfferModal(true);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        listing.availableQuantity <= 0
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      }`}
                    >
                      <span>Negotiate / Make Offer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FPO AGGREGATION HUB */}
        {activeTab === 'aggregation' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-900/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-400" /> Multi-Farmer Produce Aggregation Hub
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Enables FPOs and Cooperatives to combine smallholder farmer lots into standardized commercial batches (e.g. 4T + 6T + 3T + 7T = 20T bulk) with strict quality compatibility rules.
                </p>
              </div>

              <button
                onClick={() => {
                  setAggregationError('');
                  setShowAggregationModal(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-950/40 flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Inward New Farmer Lot
              </button>
            </div>

            {/* Aggregation Batches */}
            <div className="space-y-4">
              {aggregationBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {batch.batchCode}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{batch.organizationName}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {batch.cropName} — {batch.cropVariety}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Collection Yard: <strong className="text-slate-200">{batch.collectionCenter}</strong> • Required Grade:{' '}
                        <strong className="text-teal-300">{batch.qualityGrade}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          batch.status === 'LISTED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        Status: {batch.status}
                      </span>

                      {batch.status !== 'LISTED' && (
                        <button
                          onClick={() => handlePublishAggregationBatch(batch)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Publish to Market
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Volume Gauge */}
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Aggregated Volume Progress:</span>
                      <span className="font-bold text-white">
                        {batch.collectedQuantity} / {batch.targetQuantity} {batch.unit} ({batch.items.length} Farmers)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (batch.collectedQuantity / batch.targetQuantity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Farmer Lots Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2 px-3 font-semibold">Farmer Member</th>
                          <th className="py-2 px-3 font-semibold">Village Cluster</th>
                          <th className="py-2 px-3 font-semibold">Contributed Lot</th>
                          <th className="py-2 px-3 font-semibold">Payable Rate</th>
                          <th className="py-2 px-3 font-semibold">Inward Date</th>
                          <th className="py-2 px-3 font-semibold">QC Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {batch.items.map((lot) => (
                          <tr key={lot.id} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-teal-400" /> {lot.farmerName}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">{lot.farmerVillage}</td>
                            <td className="py-2.5 px-3 font-semibold text-emerald-400">
                              {lot.contributedQuantity} {lot.unit}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">₹{lot.unitPricePayable} / {lot.unit}</td>
                            <td className="py-2.5 px-3 text-slate-400">{lot.inwardDate}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" /> QC Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OFFERS & NEGOTIATIONS */}
        {activeTab === 'offers' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Active Commercial Offers & Counter-Negotiations
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-round non-binding offer revisions with audit trail and escrow settlement terms.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {offer.offerNumber}
                        </span>
                        <span className="text-xs text-slate-400">Revision #{offer.currentRevision}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{offer.cropName}</h3>
                      <p className="text-xs text-slate-400">
                        Buyer: <strong className="text-slate-200">{offer.buyerName}</strong> ({offer.buyerOrganization}) • Seller:{' '}
                        <strong className="text-slate-200">{offer.sellerName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400">
                        ₹{offer.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">
                        {offer.offeredQuantity} {offer.unit} @ ₹{offer.offeredUnitPrice}/{offer.unit}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : offer.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {offer.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Negotiation Revisions History */}
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-emerald-400" /> Revision Audit History
                    </div>
                    <div className="space-y-2">
                      {offer.revisions.map((rev) => (
                        <div
                          key={rev.revisionNumber}
                          className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800/80 text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center text-slate-400 text-[11px]">
                            <span className="font-bold text-slate-200">
                              Rev #{rev.revisionNumber} by {rev.initiatorName}
                            </span>
                            <span>{rev.createdAt}</span>
                          </div>
                          <div className="flex justify-between items-center font-semibold text-emerald-300">
                            <span>
                              {rev.offeredQuantity} {offer.unit} @ ₹{rev.offeredUnitPrice}/{offer.unit}
                            </span>
                            <span>Total: ₹{rev.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] italic">"{rev.message}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {offer.status !== 'ACCEPTED' && offer.status !== 'REJECTED' && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOfferForCounter(offer);
                          setCounterPrice(offer.offeredUnitPrice);
                          setShowCounterModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                      >
                        Counter-Negotiate
                      </button>

                      <button
                        onClick={() => handleAcceptOffer(offer)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Terms & Generate Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & ESCROW LEDGER */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Commercial Produce Orders & Escrow Vault
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Guaranteed settlement execution, anti-overselling lock, and dispute management.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">Created {order.createdAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {order.cropName} ({order.cropVariety})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Buyer: <strong className="text-slate-200">{order.buyerName}</strong> • Seller:{' '}
                        <strong className="text-slate-200">{order.sellerName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">
                        {order.quantity} {order.unit} @ ₹{order.unitPrice}/{order.unit} + ₹{order.platformFee} Facilitation Fee
                      </p>
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'SETTLED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : order.status === 'DISPUTED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        Status: {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Escrow and Terms Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">Escrow Vault Status:</span>
                      <strong className="text-amber-400 flex items-center gap-1 mt-0.5">
                        <Lock className="w-3.5 h-3.5" /> {order.escrowStatus.replace(/_/g, ' ')}
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-1">{order.paymentTerms}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Fulfillment / Logistics Bridge:</span>
                      <strong className="text-teal-300 flex items-center gap-1 mt-0.5">
                        <Truck className="w-3.5 h-3.5" /> {order.transportRequestId || 'Assigned to M15 Dispatch'}
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-1">{order.deliveryTerms}</p>
                    </div>
                  </div>

                  {order.disputeReason && (
                    <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3 text-xs text-rose-300">
                      <strong className="flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Dispute Logged:
                      </strong>
                      <p className="mt-1">{order.disputeReason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                    {order.status !== 'SETTLED' && order.status !== 'DISPUTED' && (
                      <>
                        <button
                          onClick={() => handleDisputeOrder(order.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 transition"
                        >
                          Raise Quality Dispute
                        </button>
                        <button
                          onClick={() => handleSettleOrder(order.id)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Release Escrow & Settle Order
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LOGISTICS & FULFILLMENT */}
        {activeTab === 'fulfillment' && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-900/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" /> Milestone 15 Logistics Dispatch & Tracking Bridge
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Orders automatically link into the multi-axle freight transportation pipeline for gate loading, waypoint GPS tracking, arrival moisture inspection, and delivery signoff.
                </p>
              </div>

              <Link
                href="/logistics"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition"
              >
                Open Full Logistics Cockpit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Active Fulfillment Cards */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    TRK-M15-88219
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    Order #ORD-2026-COT-8801 — 300 Quintals Cotton Bales
                  </h3>
                  <p className="text-xs text-slate-400">
                    Carrier: <strong className="text-slate-200">Heavy Commercial 16-Ton Truck (TS-08-AG-9214)</strong> • Driver:{' '}
                    <strong className="text-slate-200">Anil Rathod (+91 98480 22334)</strong>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  IN TRANSIT
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold">
                  ✓ Yard Loaded
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold">
                  ✓ Dispatch QC Passed
                </div>
                <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500 text-emerald-300 font-bold animate-pulse">
                  ● En Route (78 km)
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-500 font-medium">
                  Destination Inward
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MARKET INTELLIGENCE & PRICE BENCHMARK */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> APMC Mandi Benchmark & Spot Price Indices
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time commodity price tracking across southern agricultural hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  crop: 'Cotton (Bt-2 Long Staple)',
                  variety: 'Brahma 32mm',
                  price: 7450,
                  change: '+1.8%',
                  demand: 'HIGH DEMAND',
                  color: 'text-emerald-400',
                  sevenDay: '₹7,320 / Q',
                },
                {
                  crop: 'Sona Masoori Organic Paddy',
                  variety: 'BPT 5204 Organic',
                  price: 2850,
                  change: '+0.5%',
                  demand: 'STEADY DEMAND',
                  color: 'text-teal-400',
                  sevenDay: '₹2,820 / Q',
                },
                {
                  crop: 'Groundnut (Bold Pods)',
                  variety: 'Kadiri-6 High Oil',
                  price: 6900,
                  change: '-0.8%',
                  demand: 'MODERATE',
                  color: 'text-amber-400',
                  sevenDay: '₹6,950 / Q',
                },
                {
                  crop: 'Guntur Red Chilli (Teja)',
                  variety: 'Teja S17 Dry',
                  price: 19500,
                  change: '+3.2%',
                  demand: 'HIGH DEMAND',
                  color: 'text-emerald-400',
                  sevenDay: '₹18,900 / Q',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.crop}</h4>
                      <p className="text-xs text-slate-400">{item.variety}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {item.demand}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[11px] text-slate-400">Current Spot Benchmark</span>
                      <div className="text-2xl font-black text-white">₹{item.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ Quintal</span></div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${item.color}`}>{item.change}</span>
                      <p className="text-[10px] text-slate-400">7-Day Avg: {item.sevenDay}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREATE PRODUCE LISTING */}
      {showNewListingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" /> Post New Produce Listing
              </h3>
              <button onClick={() => setShowNewListingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Commodity Crop</label>
                  <input
                    type="text"
                    required
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Crop Variety</label>
                  <input
                    type="text"
                    required
                    value={newCropVariety}
                    onChange={(e) => setNewCropVariety(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Quantity (Q)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Asking Price (₹/Q)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Quality Grade</label>
                  <input
                    type="text"
                    required
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">District</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Mandal</label>
                  <input
                    type="text"
                    required
                    value={newMandal}
                    onChange={(e) => setNewMandal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Village / Yard</label>
                  <input
                    type="text"
                    required
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewListingModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT OFFER */}
      {showOfferModal && selectedListingForOffer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Submit Produce Offer
              </h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Target Listing:</span>
              <h4 className="text-sm font-bold text-white">{selectedListingForOffer.cropName}</h4>
              <p className="text-slate-400">
                Max Stock: <strong>{selectedListingForOffer.availableQuantity} {selectedListingForOffer.unit}</strong> • Asking Price:{' '}
                <strong>₹{selectedListingForOffer.askingPrice}/Q</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Required Quantity ({selectedListingForOffer.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedListingForOffer.availableQuantity}
                    required
                    value={offerFormQty}
                    onChange={(e) => setOfferFormQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Offered Price (₹/Quintal)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={offerFormPrice}
                    onChange={(e) => setOfferFormPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] flex justify-between font-semibold">
                <span className="text-slate-400">Estimated Total Valuation:</span>
                <span className="text-emerald-400">₹{(offerFormQty * offerFormPrice).toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Commercial Notes / Terms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need batch dispatch within 5 days. Escrow funding ready."
                  value={offerFormMsg}
                  onChange={(e) => setOfferFormMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Send Commercial Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COUNTER OFFER */}
      {showCounterModal && selectedOfferForCounter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" /> Counter-Negotiate Offer
              </h3>
              <button onClick={() => setShowCounterModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Offer Terms:</span>
              <h4 className="text-sm font-bold text-white">{selectedOfferForCounter.cropName}</h4>
              <p className="text-slate-300">
                {selectedOfferForCounter.offeredQuantity} {selectedOfferForCounter.unit} @ ₹{selectedOfferForCounter.offeredUnitPrice}/Q
              </p>
            </div>

            <form onSubmit={handleCounterOffer} className="space-y-3">
              <div>
                <label className="text-slate-400 font-medium">Proposed Counter Unit Price (₹/Quintal)</label>
                <input
                  type="number"
                  min="100"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] flex justify-between font-semibold">
                <span className="text-slate-400">Revised Total Valuation:</span>
                <span className="text-amber-400">
                  ₹{(selectedOfferForCounter.offeredQuantity * counterPrice).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Counter Reason / Justification</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Higher grade moisture certificate included, rate non-negotiable."
                  value={counterMsg}
                  onChange={(e) => setCounterMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Submit Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INWARD AGGREGATION LOT */}
      {showAggregationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" /> Inward Smallholder Farmer Lot
              </h3>
              <button onClick={() => setShowAggregationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {aggregationError && (
              <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-3 text-rose-300 flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{aggregationError}</span>
              </div>
            )}

            <form onSubmit={handleAddAggregationLot} className="space-y-3">
              <div>
                <label className="text-slate-400 font-medium">Select Target Aggregation Batch</label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                >
                  {aggregationBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} — {b.cropName} ({b.cropVariety}) [{b.qualityGrade}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Farmer Member Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Contributed Quantity (Q)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLotQty}
                    onChange={(e) => setNewLotQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={newLotCrop}
                    onChange={(e) => setNewLotCrop(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Variety</label>
                  <input
                    type="text"
                    required
                    value={newLotVariety}
                    onChange={(e) => setNewLotVariety(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Quality Grade</label>
                  <input
                    type="text"
                    required
                    value={newLotGrade}
                    onChange={(e) => setNewLotGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">FPO Payable Rate (₹/Quintal)</label>
                <input
                  type="number"
                  min="100"
                  required
                  value={newLotPrice}
                  onChange={(e) => setNewLotPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAggregationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Validate & Add Lot to Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
