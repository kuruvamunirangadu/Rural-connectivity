import { findMatchingTractors, evaluateCandidateTractor } from '../../packages/matching-engine';
import { MatchingCriteria, TractorOwnerProfile, UserRole } from '../../packages/shared-types';

describe('Tractor Work Matching Engine', () => {
  const criteria: MatchingCriteria = {
    farmerLocation: { lat: 17.2500, lng: 77.5800, village: 'Village A' },
    workType: 'rotavator',
    requiredAttachment: 'rotavator',
    acreage: 5,
    date: '2026-09-04',
    time: '7:00 AM',
    targetBudget: 1300,
  };

  const owners: TractorOwnerProfile[] = [
    {
      id: 'owner-a',
      name: 'TRACTOR OWNER A',
      phone: '9848011223',
      role: UserRole.TRACTOR_OWNER,
      location: { village: 'Tangipalli North', mandal: 'Tandur', district: 'Vikarabad', lat: 17.2860, lng: 77.5800 },
      verified: true,
      verificationStatus: 'gold',
      rating: 4.7,
      totalRatingsCount: 87,
      experienceYears: 8,
      languages: ['Telugu'],
      createdAt: new Date(),
      updatedAt: new Date(),
      tractors: [
        {
          id: 'tr-01',
          ownerId: 'owner-a',
          registrationNumber: 'TS34AB1234',
          brand: 'Mahindra',
          model: 'Arjun 550 DI',
          hp: 50,
          category: 'medium',
          purchaseYear: 2021,
          currentCondition: 'excellent',
          serviceStatus: 'active',
          photos: [],
          baseRatePerAcre: 1250,
          attachments: [
            { id: 'att-1', type: 'rotavator', name: 'Rotavator 6ft', condition: 'good', perAcreRate: 1250 },
            { id: 'att-2', type: 'plough', name: 'Plough', condition: 'good', perAcreRate: 1000 },
          ],
          availability: {
            availableToday: true,
            operatingRadiusKm: 15,
            minWorkAcres: 2,
            preferredWorkTypes: ['rotavator', 'ploughing'],
            weeklySchedule: { monday: 'available', tuesday: 'available', wednesday: 'available', thursday: 'available', friday: 'available' },
          },
        },
      ],
    },
    {
      id: 'owner-b',
      name: 'TRACTOR OWNER B',
      phone: '9848055667',
      role: UserRole.TRACTOR_OWNER,
      location: { village: 'Malkapur', mandal: 'Tandur', district: 'Vikarabad', lat: 17.3130, lng: 77.5800 },
      verified: true,
      verificationStatus: 'verified',
      rating: 4.5,
      totalRatingsCount: 56,
      experienceYears: 5,
      languages: ['Telugu'],
      createdAt: new Date(),
      updatedAt: new Date(),
      tractors: [
        {
          id: 'tr-02',
          ownerId: 'owner-b',
          registrationNumber: 'TS34CD5678',
          brand: 'John Deere',
          model: '5045 D',
          hp: 45,
          category: 'medium',
          purchaseYear: 2022,
          currentCondition: 'good',
          serviceStatus: 'active',
          photos: [],
          baseRatePerAcre: 1300,
          attachments: [
            { id: 'att-3', type: 'rotavator', name: 'Rotavator', condition: 'good', perAcreRate: 1300 },
          ],
          availability: {
            availableToday: true,
            operatingRadiusKm: 15,
            minWorkAcres: 2,
            preferredWorkTypes: ['rotavator'],
            weeklySchedule: { monday: 'available', tuesday: 'available', wednesday: 'booked', thursday: 'available', friday: 'available' },
          },
        },
      ],
    },
    {
      id: 'owner-c',
      name: 'TRACTOR OWNER C',
      phone: '9848099887',
      role: UserRole.TRACTOR_OWNER,
      location: { village: 'Kotbaspalli', mandal: 'Tandur', district: 'Vikarabad', lat: 17.2770, lng: 77.5800 },
      verified: true,
      verificationStatus: 'verified',
      rating: 4.6,
      totalRatingsCount: 42,
      experienceYears: 6,
      languages: ['Telugu'],
      createdAt: new Date(),
      updatedAt: new Date(),
      tractors: [
        {
          id: 'tr-03',
          ownerId: 'owner-c',
          registrationNumber: 'TS34EF9012',
          brand: 'Swaraj',
          model: '735 FE',
          hp: 35,
          category: 'compact',
          purchaseYear: 2019,
          currentCondition: 'good',
          serviceStatus: 'active',
          photos: [],
          baseRatePerAcre: 1100,
          attachments: [
            { id: 'att-4', type: 'plough', name: 'Plough', condition: 'good', perAcreRate: 1100 },
            { id: 'att-5', type: 'cultivator', name: 'Cultivator', condition: 'good', perAcreRate: 900 },
            // NO ROTAVATOR!
          ],
          availability: {
            availableToday: true,
            operatingRadiusKm: 15,
            minWorkAcres: 2,
            preferredWorkTypes: ['ploughing'],
            weeklySchedule: { monday: 'available', tuesday: 'available', wednesday: 'available', thursday: 'available', friday: 'available' },
          },
        },
      ],
    },
  ];

  it('strictly excludes Tractor Owner C because they lack a rotavator', () => {
    const response = findMatchingTractors(criteria, owners);
    expect(response.eligibleMatches).toHaveLength(2);
    expect(response.excludedCandidates).toHaveLength(1);
    expect(response.excludedCandidates[0].ownerId).toBe('owner-c');
    expect(response.excludedCandidates[0].exclusionReason).toContain('Missing required attachment: rotavator');
  });

  it('ranks Owner A above Owner B based on distance, HP, and rating scores', () => {
    const response = findMatchingTractors(criteria, owners);
    expect(response.eligibleMatches[0].ownerId).toBe('owner-a');
    expect(response.eligibleMatches[1].ownerId).toBe('owner-b');
    expect(response.eligibleMatches[0].matchScore).toBeGreaterThan(response.eligibleMatches[1].matchScore);
  });
});
