'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  Bell,
  Bot,
  Layers,
  Search,
  ShieldCheck,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Globe,
  Tag,
  Stethoscope,
  Send,
} from 'lucide-react';

export type KnowledgeUserRole =
  | 'FARMER'
  | 'EXTENSION_OFFICER'
  | 'AGRONOMIST_REVIEWER'
  | 'CONTENT_AUTHOR'
  | 'FPO_LEAD';

export type KnowledgeTab =
  | 'library'
  | 'checklists'
  | 'field-visits'
  | 'advisories'
  | 'ai-assistant'
  | 'governance';

// Types
interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentType: 'ARTICLE' | 'GUIDE' | 'CHECKLIST' | 'FAQ' | 'SAFETY_NOTICE';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  language: string;
  cropName?: string;
  activityType?: string;
  authorName: string;
  reviewedByName?: string;
  publishedAt?: string;
  currentVersion: number;
  sources: { sourceName: string; organization: string; citationText: string; referenceUrl?: string }[];
  tags: string[];
  teluguTitle?: string;
  teluguSummary?: string;
}

interface ActivityChecklistGuide {
  id: string;
  activityType: string;
  cropName: string;
  title: string;
  description: string;
  articleId: string;
  checklists: {
    stepNumber: number;
    phase: 'BEFORE_WORK' | 'EQUIPMENT_PPE' | 'APPLICATION' | 'AFTER_WORK';
    title: string;
    instruction: string;
    isMandatory: boolean;
  }[];
}

interface FieldObservationItem {
  id: string;
  category: 'PEST' | 'DISEASE' | 'NUTRIENT_DEFICIENCY' | 'WEED' | 'WATER_STRESS' | 'GENERAL_HEALTH';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedAreaPercentage?: number;
  recommendedArticleTitle?: string;
}

interface FieldVisitRecord {
  id: string;
  farmName: string;
  farmerName: string;
  location: string;
  officerName: string;
  visitDate: string;
  cropName: string;
  growthStage: string;
  overallHealthScore: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  observations: FieldObservationItem[];
}

interface AdvisoryItem {
  id: string;
  title: string;
  cropName: string;
  advisoryType: 'WEATHER_ALERT' | 'PEST_OUTBREAK' | 'STAGE_GUIDANCE' | 'FERTILIZER_SCHEDULE' | 'HARVEST_WINDOW';
  urgency: 'INFO' | 'ADVISORY' | 'WARNING' | 'CRITICAL';
  summary: string;
  actionItems: string[];
  validUntil: string;
  issuedByName: string;
  farmTarget: string;
  isAcknowledged: boolean;
  linkedArticleId?: string;
  linkedArticleTitle?: string;
}

interface KnowledgeGapItem {
  id: string;
  query: string;
  cropName?: string;
  activityType?: string;
  searchCount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_REVIEW' | 'CONTENT_CREATED' | 'RESOLVED';
  assignedAgronomist?: string;
}

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('library');
  const [activeRole, setActiveRole] = useState<KnowledgeUserRole>('FARMER');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'te' | 'hi'>('en');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  // Checklist interactive state
  const [activeChecklistId, setActiveChecklistId] = useState('guide-spraying-cotton');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Field Visits state
  const [fieldVisits, setFieldVisits] = useState<FieldVisitRecord[]>([
    {
      id: 'fvr-101',
      farmName: 'Rami Reddy 5-Acre Black Cotton Plot',
      farmerName: 'K. Rami Reddy',
      location: 'Nalgonda Mandal, Telangana',
      officerName: 'S. Mahender (Mandal Agri Officer)',
      visitDate: '2026-02-18',
      cropName: 'Bt-Cotton (BG-II)',
      growthStage: 'Square Formation & Early Flowering (65 DAS)',
      overallHealthScore: 78,
      status: 'COMPLETED',
      notes: 'Good crop canopy. Light sucking pest pressure noticed on lower leaves of perimeter rows.',
      observations: [
        {
          id: 'obs-01',
          category: 'PEST',
          severity: 'MODERATE',
          description: 'Observed 4-6 Jassid nymphs per leaf on 15 sampled plants. Below ETL (Economic Threshold Level 8/leaf).',
          affectedAreaPercentage: 12,
          recommendedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
        },
        {
          id: 'obs-02',
          category: 'NUTRIENT_DEFICIENCY',
          severity: 'LOW',
          description: 'Mild magnesium purpling on older leaves in red-soil patch.',
          affectedAreaPercentage: 5,
          recommendedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
        },
      ],
    },
    {
      id: 'fvr-102',
      farmName: 'Malleshappa Wetland Paddy Field',
      farmerName: 'B. Malleshappa',
      location: 'Suryapet District, Telangana',
      officerName: 'K. Anitha (Extension Officer)',
      visitDate: '2026-02-19',
      cropName: 'Paddy (Sona Masoori)',
      growthStage: 'Tillering Stage (30 DAT)',
      overallHealthScore: 92,
      status: 'COMPLETED',
      notes: 'Pani-pipe AWD tube installed properly. Standing water calibrated at 3 cm depth.',
      observations: [
        {
          id: 'obs-03',
          category: 'WATER_STRESS',
          severity: 'LOW',
          description: 'AWD regime followed correctly; water level at 5 cm below soil surface before re-irrigation cycle.',
          affectedAreaPercentage: 0,
          recommendedArticleTitle: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
        },
      ],
    },
  ]);

  // Advisories state
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([
    {
      id: 'adv-201',
      title: 'Pink Bollworm Pheromone Trap Monitoring & Sucking Pest Alert',
      cropName: 'Cotton',
      advisoryType: 'PEST_OUTBREAK',
      urgency: 'WARNING',
      summary:
        'Slight increase in sucking pest activity reported in Nalgonda block. Inspect 20 index plants per acre before scheduling chemical spray.',
      actionItems: [
        'Deploy 4-5 pheromone traps per acre at crop canopy height.',
        'Check ETL levels: spray only if > 6 jassids/leaf or > 8 moths/trap/night.',
        'Maintain 40-50 PSI hollow cone nozzle calibration and wear mandatory PPE.',
      ],
      validUntil: '2026-02-28',
      issuedByName: 'Dr. V. Prasad (PJTSAU Agronomist)',
      farmTarget: 'Nalgonda & Suryapet Cotton Clusters',
      isAcknowledged: false,
      linkedArticleId: 'art-cot-spray-guide',
      linkedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
    },
    {
      id: 'adv-202',
      title: 'AWD Alternate Wetting & Drying Cycle for Sona Masoori Tillering',
      cropName: 'Paddy / Rice',
      advisoryType: 'STAGE_GUIDANCE',
      urgency: 'INFO',
      summary:
        'Save 30% canal water during tillering by letting water drop to 15 cm inside pani pipe before applying next 5 cm depth flush.',
      actionItems: [
        'Inspect field water tube every morning.',
        'Maintain continuous water only during 10 days of flowering stage.',
      ],
      validUntil: '2026-03-05',
      issuedByName: 'PJTSAU Water Technology Centre',
      farmTarget: 'All Irrigated Command Area Farms',
      isAcknowledged: true,
      linkedArticleId: 'art-paddy-awd-irrigation',
      linkedArticleTitle: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
    },
    {
      id: 'adv-203',
      title: 'Sudden Unseasonal Rain & Gusty Wind Advisory (35 km/h)',
      cropName: 'All Crops',
      advisoryType: 'WEATHER_ALERT',
      urgency: 'CRITICAL',
      summary:
        'IMD predicts isolated thunderstorms and wind gusts. Immediately suspend all foliar spraying and clear drainage outlets.',
      actionItems: [
        'Suspend all tractor and power spraying operations immediately.',
        'Ensure harvested produce is moved to covered FPO sheds.',
        'Clear field boundary trenches to prevent water stagnation in groundnut plots.',
      ],
      validUntil: '2026-02-24',
      issuedByName: 'IMD Agri-Met & State Extension Directorate',
      farmTarget: 'South Telangana Regional Agro-Zone',
      isAcknowledged: false,
    },
  ]);

  // Articles state
  const [articles] = useState<KnowledgeArticle[]>([
    {
      id: 'art-cot-spray-guide',
      title: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
      slug: 'cotton-spraying-guide',
      summary:
        'Standard operational protocol for protective spraying in Bt-Cotton against sucking pests and pink bollworm with environmental threshold guidelines.',
      content: `### 1. Pre-Application Field Assessment
Before initiating any chemical application in cotton, verify economic threshold levels (ETL):
- **Sucking Pests (Aphids/Jassids)**: > 5-10 nymphs per leaf on 20 random index plants.
- **Whitefly**: > 6-8 adults per leaf.
- **Pink Bollworm**: > 8 male moths per pheromone trap for 3 consecutive nights.

### 2. Weather & Field Conditions
- **Wind Speed**: Apply when wind speed is between 3 to 10 km/h. Avoid high winds (> 15 km/h) to prevent chemical drift.
- **Timing**: Early morning (06:30 - 09:30 AM) or late afternoon (04:00 - 06:30 PM). Never spray during peak mid-day heat.
- **Rain Warning**: Ensure a minimum 4-6 hour rain-free window after foliar application.

### 3. Equipment Calibration & PPE
- Use hollow cone nozzles for insecticidal foliar coverage and flat fan nozzles for soil applications.
- Maintain operating pressure at 40-50 PSI for uniform droplet distribution (200-300 microns).
- Calibrate water volume: 200 Litres of spray solution per acre.
- Wear N95 respirator mask, nitrile chemical gloves, safety goggles, and protective suit.`,
      contentType: 'GUIDE',
      status: 'PUBLISHED',
      language: 'en',
      cropName: 'Cotton',
      activityType: 'SPRAYING',
      authorName: 'Dr. V. Prasad (PJTSAU Agronomist)',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-15',
      currentVersion: 1,
      sources: [
        {
          sourceName: 'PJTSAU Agronomy Directorate',
          organization: 'Professor Jayashankar Telangana State Agricultural University',
          citationText: 'PJTSAU Package of Practices for Cotton 2025-26, Bulletin No. 42',
          referenceUrl: 'https://pjtsau.edu.in/agronomy/cotton-pop-2025',
        },
        {
          sourceName: 'ICAR - Central Institute for Cotton Research',
          organization: 'ICAR',
          citationText: 'CICR Pink Bollworm Management Advisory, Technical Circular 88',
        },
      ],
      tags: ['Cotton', 'Spraying', 'IPM', 'Pest Management', 'PJTSAU Verified'],
      teluguTitle: 'ప్రత్తి పంటలో రసాయన పిచికారీ మరియు రక్షణ మార్గదర్శకాలు',
      teluguSummary: 'బి.టి ప్రత్తిలో రసం పీల్చే పురుగులు మరియు గులాబీ రంగు కాయతొలుచు పురుగు నివారణకు శాస్త్రీయ పిచికారీ విధానం.',
    },
    {
      id: 'art-sprayer-ppe-safety',
      title: 'Operator Personal Protective Equipment (PPE) & Chemical Safety Checklist',
      slug: 'sprayer-ppe-safety-checklist',
      summary:
        'Mandatory health and safety checklist for agricultural sprayer operators and farm workers handling agrochemicals.',
      content: `### Mandatory Operator PPE Checklist
1. **Respiratory Protection**: Wear N95 or activated-carbon organic vapor mask while mixing and spraying.
2. **Eye Protection**: Chemical splash safety goggles with indirect ventilation.
3. **Body Covering**: Full-sleeve water-resistant apron or coverall suit and broad-brimmed cap.
4. **Hands & Feet**: Nitrile chemical-resistant gloves and rubber knee-high gumboots.

### Safe Mixing & Decontamination Protocol
- Always mix chemicals in well-ventilated outdoor shaded spaces using designated measuring cylinders.
- Triple-rinse empty chemical containers immediately; puncture container bottoms to prevent reuse for domestic storage.
- Never blow clogged nozzles with the mouth; use a nylon brush or water flush.
- Operators must take a complete soap bath and wash clothing separately immediately following spray operations.`,
      contentType: 'SAFETY_NOTICE',
      status: 'PUBLISHED',
      language: 'en',
      activityType: 'SPRAYING',
      authorName: 'R. Sreenivas (Agri-Safety Specialist)',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-18',
      currentVersion: 1,
      sources: [
        {
          sourceName: 'Central Insecticides Board & Registration Committee (CIBRC)',
          organization: 'Ministry of Agriculture & Farmers Welfare',
          citationText: 'CIBRC Safety Manual for Agrochemical Applicators, 2025 Norms',
        },
      ],
      tags: ['Safety', 'PPE', 'Spraying', 'Chemical Handling', 'Operator Health'],
      teluguTitle: 'పిచికారీ ఆపరేటర్ రక్షణ పరికరాలు (PPE) మరియు భద్రతా నియమావళి',
      teluguSummary: 'రసాయన మందులు పిచికారీ చేసే సమయంలో ఆపరేటర్లు పాటించాల్సిన తప్పనిసరి భద్రతా సూచనలు.',
    },
    {
      id: 'art-paddy-awd-irrigation',
      title: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
      slug: 'paddy-awd-water-conservation',
      summary:
        'Field implementation guide for saving 25-35% irrigation water in Sona Masoori and BPT 5204 paddy using perforated pani-pipe field tubes.',
      content: `### Principle of Alternate Wetting and Drying (AWD)
AWD is a water-saving technology where paddy fields are not kept continuously submerged, but allowed to dry periodically without reducing grain yield.

### Installation of Field Water Tube (Pani Pipe)
1. Install a 30 cm long PVC pipe (10-15 cm diameter) with perforations in the bottom 20 cm into the soil.
2. Maintain water depth 5 cm above soil surface during initial transplanting and flowering.
3. During vegetative tillering, re-irrigate only when water level drops to 15 cm below ground level inside the pipe.
4. Withhold AWD during flowering window (one week before to one week after flowering) to safeguard spikelet fertility.`,
      contentType: 'GUIDE',
      status: 'PUBLISHED',
      language: 'en',
      cropName: 'Paddy / Rice',
      activityType: 'IRRIGATION',
      authorName: 'Dr. V. Prasad (PJTSAU Agronomist)',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-20',
      currentVersion: 1,
      sources: [
        {
          sourceName: 'PJTSAU Water Technology Centre',
          organization: 'Professor Jayashankar Telangana State Agricultural University',
          citationText: 'PJTSAU AWD Water Conservation Protocol for Southern Telangana Zone',
        },
      ],
      tags: ['Paddy', 'Irrigation', 'Water Conservation', 'AWD', 'Sona Masoori'],
      teluguTitle: 'వరి సాగులో నీటి పొదుపు కోసం ఆల్టర్నేట్ వెట్టింగ్ అండ్ డ్రైయింగ్ (AWD) విధానం',
      teluguSummary: 'పానీ-పైపు ద్వారా వరిలో 30% నీటిని ఆదా చేసుకునే శాస్త్రీయ పద్ధతి.',
    },
  ]);

  // Activity Guides
  const activityGuides: ActivityChecklistGuide[] = [
    {
      id: 'guide-spraying-cotton',
      activityType: 'SPRAYING',
      cropName: 'Cotton',
      title: 'Cotton Protective Spraying & Safety Protocol',
      description: 'End-to-end operational checklist for spraying operations on cotton fields.',
      articleId: 'art-cot-spray-guide',
      checklists: [
        {
          stepNumber: 1,
          phase: 'BEFORE_WORK',
          title: 'Field ETL & Weather Inspection',
          instruction:
            'Inspect 20 random cotton plants for economic threshold levels. Confirm wind speed < 12 km/h and no rain forecast for 4 hours.',
          isMandatory: true,
        },
        {
          stepNumber: 2,
          phase: 'EQUIPMENT_PPE',
          title: 'Sprayer Calibration & PPE Donning',
          instruction:
            'Verify nozzle discharge (hollow cone, 40 PSI). Put on N95 mask, nitrile chemical gloves, safety goggles, and protective apron.',
          isMandatory: true,
        },
        {
          stepNumber: 3,
          phase: 'APPLICATION',
          title: 'Downwind Spray Traversal',
          instruction:
            'Walk with the wind blowing across or away from operator; never walk directly into chemical spray mist. Maintain uniform walking pace.',
          isMandatory: true,
        },
        {
          stepNumber: 4,
          phase: 'AFTER_WORK',
          title: 'Triple Rinse & Operator Hygiene',
          instruction:
            'Triple rinse spray tank with clean water. Puncture empty containers. Operator must immediately bathe with soap and wash clothing separately.',
          isMandatory: true,
        },
      ],
    },
    {
      id: 'guide-irrigation-paddy',
      activityType: 'IRRIGATION',
      cropName: 'Paddy / Rice',
      title: 'Paddy AWD Irrigation & Pump Operation Guide',
      description: 'Water management steps for Alternate Wetting and Drying (AWD) in rice.',
      articleId: 'art-paddy-awd-irrigation',
      checklists: [
        {
          stepNumber: 1,
          phase: 'BEFORE_WORK',
          title: 'Check Field Pani Pipe Level',
          instruction:
            'Inspect water tube; re-irrigate only when water drops to 15 cm below ground level during tillering phase.',
          isMandatory: true,
        },
        {
          stepNumber: 2,
          phase: 'EQUIPMENT_PPE',
          title: 'Electrical & Pump Priming Check',
          instruction:
            'Check capacitor and starter switch. Prime centrifugal pump with water to prevent air locking.',
          isMandatory: true,
        },
        {
          stepNumber: 3,
          phase: 'APPLICATION',
          title: 'Controlled Furrow Inflow',
          instruction:
            'Inundate field plots up to 5 cm depth. Maintain perimeter bunds to prevent runoff losses.',
          isMandatory: false,
        },
        {
          stepNumber: 4,
          phase: 'AFTER_WORK',
          title: 'Main Sluice Valve Closure',
          instruction:
            'Close inlet valves tightly and record pump run hours for electricity budget tracking.',
          isMandatory: true,
        },
      ],
    },
  ];

  // Knowledge Gaps
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGapItem[]>([
    {
      id: 'gap-cot-irr-flower',
      query: 'Cotton furrow irrigation interval during square and boll bursting in red loam',
      cropName: 'Cotton',
      activityType: 'IRRIGATION',
      searchCount: 142,
      priority: 'HIGH',
      status: 'OPEN',
      assignedAgronomist: 'Unassigned',
    },
    {
      id: 'gap-gnt-pod-borer',
      query: 'Groundnut leaf miner organic botanical neem oil formulation ratio',
      cropName: 'Groundnut',
      activityType: 'SPRAYING',
      searchCount: 89,
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      assignedAgronomist: 'Dr. V. Prasad',
    },
    {
      id: 'gap-chilli-thrips',
      query: 'Black thrips in chilli IPM bio-control and sticky trap density',
      cropName: 'Red Chilli',
      activityType: 'SPRAYING',
      searchCount: 215,
      priority: 'CRITICAL',
      status: 'OPEN',
      assignedAgronomist: 'Dr. K. Somasekhar',
    },
  ]);

  // AI Assistant Query state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<
    {
      role: 'user' | 'assistant';
      content: string;
      sources?: { sourceName: string; citationText: string }[];
      safetyNote?: string;
      isVerified: boolean;
    }[]
  >([
    {
      role: 'assistant',
      content:
        'Namaste! I am the RuralConnect Agricultural Knowledge Assistant. I answer questions strictly grounded in PJTSAU, ICAR, and CIBRC university packages of practices with verified citations.',
      isVerified: true,
      safetyNote:
        'Safety Notice: AI advisories provide decision support. Always calibrate equipment and wear PPE prior to chemical application.',
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // New Observation Form Modal / Section state
  const [showObservationForm, setShowObservationForm] = useState(false);
  const [newObsCategory, setNewObsCategory] = useState<FieldObservationItem['category']>('PEST');
  const [newObsSeverity, setNewObsSeverity] = useState<FieldObservationItem['severity']>('MODERATE');
  const [newObsDescription, setNewObsDescription] = useState('');
  const [newObsAffectedArea, setNewObsAffectedArea] = useState('10');

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    if (selectedCropFilter !== 'ALL' && art.cropName && !art.cropName.toUpperCase().includes(selectedCropFilter)) {
      return false;
    }
    if (selectedActivityFilter !== 'ALL' && art.activityType !== selectedActivityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Toggle checklist step
  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // Acknowledge Advisory
  const handleAcknowledgeAdvisory = (id: string) => {
    setAdvisories((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isAcknowledged: true } : a))
    );
  };

  // AI Assistant Ask Handler
  const handleAskAi = () => {
    if (!aiPrompt.trim()) return;
    const userQ = aiPrompt.trim();
    setAiPrompt('');
    setAiChatHistory((prev) => [...prev, { role: 'user', content: userQ, isVerified: false }]);
    setIsAiThinking(true);

    setTimeout(() => {
      const qLower = userQ.toLowerCase();
      let assistantMsg = '';
      let sources: { sourceName: string; citationText: string }[] = [];
      let safetyNote = '';
      let isVerified = true;

      if (qLower.includes('cotton') || qLower.includes('spray') || qLower.includes('pest') || qLower.includes('wind')) {
        assistantMsg =
          'According to PJTSAU & ICAR-CICR Cotton Package of Practices, spraying should only be performed after crossing Economic Threshold Levels (ETL: > 5-10 sucking pest nymphs/leaf). Maintain spray operating pressure between 40-50 PSI with hollow cone nozzles. Only spray when wind speeds are between 3 to 10 km/h in early mornings or late afternoons.';
        sources = [
          {
            sourceName: 'PJTSAU Agronomy Directorate',
            citationText: 'PJTSAU Package of Practices for Cotton 2025-26, Bulletin No. 42',
          },
          {
            sourceName: 'ICAR - Central Institute for Cotton Research',
            citationText: 'CICR Pink Bollworm Management Advisory, Circular 88',
          },
        ];
        safetyNote =
          'Mandatory: Applicators must wear N95 mask, nitrile chemical gloves, safety goggles, and full protective coveralls.';
      } else if (qLower.includes('paddy') || qLower.includes('water') || qLower.includes('irrigation') || qLower.includes('awd')) {
        assistantMsg =
          'Under Alternate Wetting and Drying (AWD) protocol for Paddy, install a 30 cm perforated pani-pipe into the plot. Allow field water level to drop 15 cm below ground level during vegetative tillering before re-flooding to 5 cm depth. This saves 25-35% water while maintaining peak grain yields.';
        sources = [
          {
            sourceName: 'PJTSAU Water Technology Centre',
            citationText: 'PJTSAU AWD Water Conservation Protocol for Southern Telangana Zone',
          },
        ];
        safetyNote = 'Maintain continuous standing water strictly during the 10 days of the flowering period.';
      } else {
        assistantMsg = `We do not have a pre-approved, university-verified package of practices for "${userQ}". RuralConnect does not generate unverified agricultural prescriptions. We have recorded this inquiry as an official Knowledge Gap for our agronomy research team.`;
        sources = [];
        safetyNote = 'Strict Safety Rule: Chemical formulations require state agronomy committee review.';
        isVerified = false;

        // Auto record knowledge gap
        setKnowledgeGaps((prev) => [
          ...prev,
          {
            id: `gap-${Date.now().toString(36)}`,
            query: userQ,
            searchCount: 1,
            priority: 'LOW',
            status: 'OPEN',
            assignedAgronomist: 'Unassigned',
          },
        ]);
      }

      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantMsg,
          sources,
          safetyNote,
          isVerified,
        },
      ]);
      setIsAiThinking(false);
    }, 600);
  };

  // Add Observation Handler
  const handleAddObservation = (visitId: string) => {
    if (!newObsDescription.trim()) return;
    const newObs: FieldObservationItem = {
      id: `obs-${Date.now().toString(36)}`,
      category: newObsCategory,
      severity: newObsSeverity,
      description: newObsDescription,
      affectedAreaPercentage: parseInt(newObsAffectedArea) || 5,
      recommendedArticleTitle: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
    };

    setFieldVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, observations: [newObs, ...v.observations] } : v
      )
    );
    setNewObsDescription('');
    setShowObservationForm(false);
  };

  const selectedGuide = activityGuides.find((g) => g.id === activeChecklistId) || activityGuides[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Milestone 17 — Digital Agricultural Extension
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                🌾 Agricultural Knowledge & Advisory Hub
              </h1>
              <p className="mt-2 text-sm text-emerald-100/80 max-w-2xl">
                University-verified packages of practices • Standard operational safety checklists • Diagnostic field
                visit records • Contextual farm advisories • Guardrailed agronomy intelligence
              </p>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Language Selector */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-1 flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-400 ml-2 mr-1" />
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedLanguage === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLanguage('te')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedLanguage === 'te' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  తెలుగు
                </button>
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    selectedLanguage === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Persona Switcher */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-1.5 flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium px-1">Role:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as KnowledgeUserRole)}
                  className="bg-slate-900 border border-slate-700 text-emerald-300 rounded px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="FARMER">👨‍🌾 Farmer / Producer</option>
                  <option value="EXTENSION_OFFICER">🩺 Extension Officer / AO</option>
                  <option value="AGRONOMIST_REVIEWER">🔬 PJTSAU Review Agronomist</option>
                  <option value="CONTENT_AUTHOR">✍️ Content Author</option>
                  <option value="FPO_LEAD">🏢 FPO Operations Lead</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-emerald-800/60">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Verified Guides</span>
              <p className="text-xl font-bold text-white mt-0.5">{articles.length} Guides</p>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> PJTSAU / ICAR Approved
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Active Advisories</span>
              <p className="text-xl font-bold text-amber-300 mt-0.5">{advisories.length} Active</p>
              <span className="text-[10px] text-amber-200 flex items-center gap-1 mt-0.5">
                <Bell className="w-3 h-3" /> 1 Weather Alert
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Field Visits Logged</span>
              <p className="text-xl font-bold text-cyan-300 mt-0.5">{fieldVisits.length} Visits</p>
              <span className="text-[10px] text-cyan-200 flex items-center gap-1 mt-0.5">
                <Stethoscope className="w-3 h-3" /> Diagnostic Observations
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Knowledge Gaps</span>
              <p className="text-xl font-bold text-rose-300 mt-0.5">{knowledgeGaps.length} Demands</p>
              <span className="text-[10px] text-rose-200 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Zero-Result Telemetry
              </span>
            </div>
            <div className="hidden lg:block bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <span className="text-xs text-emerald-200">Safety Compliance</span>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">100% CIBRC</p>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Zero Hallucinations
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
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'library'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Crop Guides & Library</span>
            </button>

            <button
              onClick={() => setActiveTab('checklists')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'checklists'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>📋 Activity & Safety SOPs</span>
            </button>

            <button
              onClick={() => setActiveTab('field-visits')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'field-visits'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>🩺 Field Visits & Observations</span>
            </button>

            <button
              onClick={() => setActiveTab('advisories')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'advisories'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>🔔 Farm Advisory Feed</span>
              {advisories.some((a) => !a.isAcknowledged) && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'ai-assistant'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>🤖 AI Agronomy Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'governance'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>📊 Knowledge Gaps & Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: KNOWLEDGE LIBRARY & CROP GUIDES */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search verified crop practices, pests, spraying protocols, AWD water management..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">All Crops</option>
                    <option value="COTTON">Cotton</option>
                    <option value="PADDY">Paddy / Rice</option>
                    <option value="GROUNDNUT">Groundnut</option>
                    <option value="CHILLI">Red Chilli</option>
                  </select>

                  <select
                    value={selectedActivityFilter}
                    onChange={(e) => setSelectedActivityFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">All Activities</option>
                    <option value="SPRAYING">Spraying</option>
                    <option value="IRRIGATION">Irrigation / AWD</option>
                    <option value="SOWING">Sowing</option>
                    <option value="HARVESTING">Harvesting</option>
                  </select>
                </div>
              </div>

              {/* Tags quick filter */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex-wrap">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Popular Topics:
                </span>
                {['Cotton Spraying', 'Paddy AWD', 'PPE Safety', 'Pink Bollworm', 'Neem Formulation'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchQuery(topic)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {art.cropName || art.contentType}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        v{art.currentVersion}.0 • {art.language.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700">
                      {selectedLanguage === 'te' && art.teluguTitle ? art.teluguTitle : art.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {selectedLanguage === 'te' && art.teluguSummary ? art.teluguSummary : art.summary}
                    </p>

                    {/* Sources / Citations */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" /> Verified Sources:
                      </div>
                      <div className="space-y-1">
                        {art.sources.map((src, idx) => (
                          <div key={idx} className="text-[11px] text-slate-600 truncate">
                            • <span className="font-medium text-slate-800">{src.sourceName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">By {art.authorName.split(' ')[0]}</span>
                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredArticles.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No verified articles matched your query</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your search query "{searchQuery}" has been logged as an unmet demand in our Knowledge Gap telemetry for
                  our agronomy team to author next.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCropFilter('ALL');
                    setSelectedActivityFilter('ALL');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVITY & SAFETY CHECKLISTS (SOPs) */}
        {activeTab === 'checklists' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                    Standard Operational Protocols (SOPs) & Safety Checklists
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Step-by-step mandatory field checklists for equipment calibration, PPE, application, and post-work
                    decontamination.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activityGuides.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => setActiveChecklistId(guide.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeChecklistId === guide.id
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {guide.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Checklist Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white mb-2">
                      {selectedGuide.activityType} • {selectedGuide.cropName}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedGuide.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{selectedGuide.description}</p>
                  </div>

                  {/* Progress Tracker */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm text-center min-w-[140px]">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Checklist Progress
                    </span>
                    <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
                      {
                        selectedGuide.checklists.filter(
                          (c) => completedSteps[`${selectedGuide.id}-${c.stepNumber}`]
                        ).length
                      }{' '}
                      / {selectedGuide.checklists.length} Done
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist Steps by Phase */}
              <div className="p-6 space-y-4">
                {selectedGuide.checklists.map((step) => {
                  const stepKey = `${selectedGuide.id}-${step.stepNumber}`;
                  const isDone = !!completedSteps[stepKey];

                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStep(stepKey)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Step {step.stepNumber}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-700 uppercase">
                            {step.phase.replace('_', ' ')}
                          </span>
                          {step.isMandatory && (
                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Mandatory
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-sm font-bold mt-1 ${
                            isDone ? 'text-emerald-900 line-through' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </h4>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.instruction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bridge to Work Request / Booking CTA */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified against CIBRC Operator Safety Standards & PJTSAU POP.</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/bookings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                  >
                    🚜 Hire Certified Sprayer Operator on Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD VISITS & OBSERVATIONS */}
        {activeTab === 'field-visits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-cyan-600" />
                    Agronomist & Extension Officer Field Visit Diagnostic Ledger
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Official factual observations recorded by field officers during farm inspections. Factual logs
                    attached to verified guides.
                  </p>
                </div>

                {activeRole === 'EXTENSION_OFFICER' || activeRole === 'AGRONOMIST_REVIEWER' ? (
                  <button
                    onClick={() => setShowObservationForm(!showObservationForm)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Log New Field Observation
                  </button>
                ) : null}
              </div>
            </div>

            {/* New Observation Logger Modal/Form if open */}
            {showObservationForm && (
              <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-950 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-cyan-700" /> Log Diagnostic Field Observation for Rami Reddy
                    Plot
                  </h3>
                  <button
                    onClick={() => setShowObservationForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Observation Category</label>
                    <select
                      value={newObsCategory}
                      onChange={(e) => setNewObsCategory(e.target.value as FieldObservationItem['category'])}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800"
                    >
                      <option value="PEST">Pest Infestation</option>
                      <option value="DISEASE">Disease Symptom</option>
                      <option value="NUTRIENT_DEFICIENCY">Nutrient Deficiency</option>
                      <option value="WEED">Weed Competition</option>
                      <option value="WATER_STRESS">Water Stress / Drought</option>
                      <option value="GENERAL_HEALTH">General Crop Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Severity Level</label>
                    <select
                      value={newObsSeverity}
                      onChange={(e) => setNewObsSeverity(e.target.value as FieldObservationItem['severity'])}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800"
                    >
                      <option value="LOW">Low (Monitor)</option>
                      <option value="MODERATE">Moderate (Approaching ETL)</option>
                      <option value="HIGH">High (Crossed ETL)</option>
                      <option value="CRITICAL">Critical (Immediate Action)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Affected Plot Area (%)</label>
                    <input
                      type="number"
                      value={newObsAffectedArea}
                      onChange={(e) => setNewObsAffectedArea(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Factual Observation Notes (Record facts, counts, symptoms)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Sampled 20 plants across diagonals: found 5 aphids/leaf on lower foliage, no flower drop yet."
                    value={newObsDescription}
                    onChange={(e) => setNewObsDescription(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleAddObservation('fvr-101')}
                    className="px-4 py-2 bg-cyan-700 text-white rounded-lg text-xs font-bold hover:bg-cyan-800"
                  >
                    Save & Attach to Field Record
                  </button>
                </div>
              </div>
            )}

            {/* Visit Records Cards */}
            <div className="space-y-6">
              {fieldVisits.map((visit) => (
                <div key={visit.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Visit Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                          {visit.cropName}
                        </span>
                        <span className="text-xs text-slate-500">• {visit.growthStage}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{visit.farmName}</h3>
                      <p className="text-xs text-slate-600">
                        Farmer: <span className="font-semibold text-slate-800">{visit.farmerName}</span> | Location:{' '}
                        {visit.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Visited by {visit.officerName}</div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">Date: {visit.visitDate}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Health Score: {visit.overallHealthScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Observations Section */}
                  <div className="p-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Recorded Field Diagnostic Observations ({visit.observations.length})
                    </h4>

                    <div className="space-y-3">
                      {visit.observations.map((obs) => (
                        <div
                          key={obs.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                                  obs.severity === 'CRITICAL'
                                    ? 'bg-rose-100 text-rose-800'
                                    : obs.severity === 'HIGH'
                                    ? 'bg-amber-100 text-amber-800'
                                    : obs.severity === 'MODERATE'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-200 text-slate-800'
                                }`}
                              >
                                {obs.severity} SEVERITY
                              </span>
                              <span className="text-xs font-semibold text-slate-700">Category: {obs.category}</span>
                              {obs.affectedAreaPercentage !== undefined && obs.affectedAreaPercentage > 0 && (
                                <span className="text-xs text-slate-500">
                                  ({obs.affectedAreaPercentage}% canopy affected)
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-700 mt-1.5 font-medium">{obs.description}</p>
                          </div>

                          {obs.recommendedArticleTitle && (
                            <div className="sm:text-right">
                              <span className="text-[11px] text-slate-500 block">Attached Guide:</span>
                              <button
                                onClick={() => setActiveTab('library')}
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                              >
                                {obs.recommendedArticleTitle} <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FARM ADVISORY FEED */}
        {activeTab === 'advisories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    Targeted Farm Advisories & Real-Time Weather Alerts
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Geo-targeted and stage-specific agronomy advisories issued by university agronomists and IMD
                    Agri-Met.
                  </p>
                </div>
              </div>
            </div>

            {/* Advisories List */}
            <div className="space-y-4">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                    adv.urgency === 'CRITICAL'
                      ? 'border-rose-300 ring-1 ring-rose-300'
                      : adv.urgency === 'WARNING'
                      ? 'border-amber-300'
                      : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                      adv.urgency === 'CRITICAL'
                        ? 'bg-rose-50/60'
                        : adv.urgency === 'WARNING'
                        ? 'bg-amber-50/50'
                        : 'bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            adv.urgency === 'CRITICAL'
                              ? 'bg-rose-600 text-white'
                              : adv.urgency === 'WARNING'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {adv.urgency}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {adv.cropName}
                        </span>
                        <span className="text-xs text-slate-500">Valid Until: {adv.validUntil}</span>
                        <span className="text-xs text-slate-500">• Issued by {adv.issuedByName}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{adv.title}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{adv.summary}</p>

                      {/* Action Items */}
                      <div className="mt-3 pt-3 border-t border-slate-200/70">
                        <span className="text-xs font-bold text-slate-800 block mb-1.5">Mandatory Action Items:</span>
                        <ul className="space-y-1">
                          {adv.actionItems.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col items-end gap-2 shrink-0">
                      {adv.isAcknowledged ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" /> Acknowledged
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcknowledgeAdvisory(adv.id)}
                          className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-sm"
                        >
                          Acknowledge Advisory
                        </button>
                      )}

                      {adv.linkedArticleId && (
                        <button
                          onClick={() => setActiveTab('library')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          View Full POP Guide <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <Link
                        href="/bookings"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Book Machinery / Labor <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AI AGRONOMY ASSISTANT & RAG QUERY */}
        {activeTab === 'ai-assistant' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Zero-Hallucination AI Agronomy Assistant</h2>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Grounded strictly in PJTSAU, ICAR, and CIBRC university packages of practices with verified source
                    citations.
                  </p>
                </div>
              </div>

              {/* Safety Banner */}
              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 flex items-center gap-2 text-xs text-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  Safety Guardrail Active: Unverified chemical dosages are rejected. Unanswered questions automatically
                  log as Knowledge Gaps for our agronomy research team.
                </span>
              </div>
            </div>

            {/* Chat History Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 min-h-[360px]">
              {aiChatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="font-medium whitespace-pre-wrap">{msg.content}</p>

                    {/* Citations if available */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200">
                        <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Verified University Sources:
                        </span>
                        <ul className="space-y-1 text-slate-600">
                          {msg.sources.map((s, sIdx) => (
                            <li key={sIdx}>
                              • <span className="font-semibold text-slate-800">{s.sourceName}</span>: {s.citationText}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safety Note */}
                    {msg.safetyNote && (
                      <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{msg.safetyNote}</span>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      You
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic p-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Searching verified ICAR/PJTSAU Package of Practices...</span>
                </div>
              )}
            </div>

            {/* Prompt Input Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask any agricultural question (e.g. 'What is the spray pressure and PPE required for cotton?')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <button
                  onClick={handleAskAi}
                  disabled={!aiPrompt.trim()}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-400">Try asking:</span>
                {[
                  'What is the recommended spray pressure for cotton?',
                  'How does Alternate Wetting and Drying (AWD) work in paddy?',
                  'What PPE is required for agrochemical spraying?',
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setAiPrompt(sample)}
                    className="text-emerald-700 hover:underline"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: KNOWLEDGE GAPS & EDITORIAL GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Editorial Governance & Unmet Knowledge Demand Hub
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Continuous feedback loop tracking zero-result farmer queries to prioritize new university article
                    authoring and multi-tier peer reviews.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-800">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Mandatory Agronomist Peer Approval Workflow</span>
                </div>
              </div>
            </div>

            {/* Knowledge Gaps Demand Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    High-Priority Knowledge Gaps ({knowledgeGaps.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Captured from zero-result search telemetry and unanswered farmer queries.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {knowledgeGaps.map((gap) => (
                  <div key={gap.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                            gap.priority === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : gap.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {gap.priority} PRIORITY
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{gap.cropName || 'General'}</span>
                        <span className="text-xs text-slate-400">• {gap.searchCount} farmer searches</span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 mt-1">"{gap.query}"</p>
                      <p className="text-[11px] text-slate-500">Assigned Agronomist: {gap.assignedAgronomist}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded ${
                          gap.status === 'OPEN'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {gap.status}
                      </span>
                      <button
                        onClick={() => {
                          alert(`Authoring workflow triggered for Knowledge Gap: "${gap.query}"`);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
                      >
                        Author Guide
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Review Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Editorial Review Pipeline & Version Audit Trail
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500">1. Draft Created</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">Author Submission</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-xs text-amber-700">2. Under Review</span>
                  <p className="text-sm font-bold text-amber-900 mt-1">Agronomist Audit</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-xs text-emerald-700">3. Approved</span>
                  <p className="text-sm font-bold text-emerald-900 mt-1">Directorate Signoff</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-xs text-blue-700">4. Published</span>
                  <p className="text-sm font-bold text-blue-900 mt-1">Public & Multilingual</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Article Reader Modal if selected */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {selectedArticle.cropName || selectedArticle.contentType}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Version {selectedArticle.currentVersion}.0 • {selectedArticle.publishedAt}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedLanguage === 'te' && selectedArticle.teluguTitle
                    ? selectedArticle.teluguTitle
                    : selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">Author: {selectedArticle.authorName}</p>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800">
                {selectedLanguage === 'te' && selectedArticle.teluguSummary
                  ? selectedArticle.teluguSummary
                  : selectedArticle.summary}
              </div>

              <div className="whitespace-pre-wrap font-sans text-slate-800 text-xs leading-relaxed">
                {selectedArticle.content}
              </div>

              {/* Citations Box */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-amber-600" /> Official University & Institutional Citations
                </h4>
                <div className="space-y-2">
                  {selectedArticle.sources.map((src, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <div className="font-bold text-slate-800">{src.sourceName}</div>
                      <div className="text-slate-600 text-[11px]">{src.citationText}</div>
                      {src.referenceUrl && (
                        <a
                          href={src.referenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline text-[11px] inline-flex items-center gap-1 mt-1"
                        >
                          View Official Publication <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Peer-reviewed by {selectedArticle.reviewedByName || 'PJTSAU Agronomist'}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/bookings"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                >
                  Book Service for this Practice
                </Link>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
