# Matching Engine: Algorithmic Architecture

## Overview

The RuralConnect matching engine evaluates incoming demand requests against the supply matrix via a two-stage pipeline: **Strict Hard-Filtering** followed by **Multi-Factor Weighted Scoring**.

```
Request (TRW / SWR / SPR / FIR / CTR)
   │
   ▼
[ Stage 1: Hard Constraints Filter ]
   ├ 1. Attachment Compatibility (Must match requested implement)
   ├ 2. Active Availability (Schedule slot open on requested date)
   ├ 3. Minimum Acreage Threshold (Farmer acres >= Owner minimum)
   └ 4. Radius Boundary (Distance <= Provider max operating radius)
   │
   ▼ (Eligible Candidates Only)
[ Stage 2: Multi-Factor Weighted Scoring ]
   ├ Distance Score (40%)
   ├ Availability Score (20%)
   ├ Trust & Rating Score (15%)
   ├ Price Competitiveness (15%)
   └ Work Type Preference (10%)
   │
   ▼
Sorted Ranked Candidates (Rank 1, Rank 2, ...)
```

## Transparent Multi-Factor Pricing Engine

$$\text{Total Price} = \left(\text{Base Rate} + \text{Attachment Charge} + \text{Mobilization Fee} + \text{Overtime Fee}\right) \times \text{Seasonal Multiplier}$$

- **Base Work Charge**: Base rate per acre $\times$ acreage.
- **Attachment Charge**: Attachment rate per acre $\times$ acreage.
- **Mobilization Fee**: $\max(0, \text{Distance} - 3\text{ km}) \times ₹35/\text{km}$.
- **Overtime Charge**: Extra hours beyond standard (1.5 hr/ac) $\times ₹450/\text{hr}$.
