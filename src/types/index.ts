export type PlaceCategory = 
  | 'heritage'
  | 'food'
  | 'nature_fort'
  | 'shopping'
  | 'temple'
  | 'parks'
  | 'modern_culture';

export interface Place {
  id: string;
  name: string;
  localName?: string;
  category: PlaceCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  area: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  indicativeCostPerPerson: number; // INR
  costTier: 'Free' | '₹ (Budget)' | '₹₹ (Moderate)' | '₹₹₹ (Premium)';
  entryFeeINR: number;
  bestTimeToVisit: string;
  avgDurationMinutes: number;
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  cleanlinessRating?: number; // 1-5 or null if unverified
  accessibilityRating?: number; // 1-5 or null if unverified
  accessibilityNotes: string;
  transitAccess: {
    metroStation?: string;
    metroDistanceKm?: number;
    busStop?: string;
    autoAvailability: 'High' | 'Moderate' | 'Limited';
  };
  safetyNotes: string;
  highlights: string[];
  tips: string[];
  imageUrl: string;
  isVerifiedPlace: boolean;
}

export type HazardCategory = 
  | 'road_hazard'
  | 'poor_lighting'
  | 'waterlogging'
  | 'crowding'
  | 'cleanliness'
  | 'metro_work'
  | 'other';

export type VerificationStatus = 'Verified' | 'Under Review' | 'Resolved';

export interface HazardReport {
  id: string;
  title: string;
  category: HazardCategory;
  categoryLabel: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  locationName: string;
  coordinates: [number, number];
  timestamp: string;
  reportedBy: string;
  verificationStatus: VerificationStatus;
  upvotes: number;
  isDemoData: boolean;
  photoUrl?: string;
  userVoted?: boolean;
}

export type GroupSize = 'solo' | 'couple' | 'friends' | 'family';
export type Pace = 'relaxed' | 'balanced' | 'fast_paced';

export interface PlannerInput {
  startingLocation: string;
  budgetINR: number;
  durationHours: number;
  interests: PlaceCategory[];
  groupSize: GroupSize;
  pace: Pace;
}

export interface ItineraryStop {
  stopNumber: number;
  placeId: string;
  place: Place;
  arrivalTime: string;
  departureTime: string;
  durationMinutes: number;
  estimatedCostINR: number;
  recommendedActivity: string;
  transitToNext?: {
    mode: 'Pune Metro' | 'PMPML Bus' | 'Auto-rickshaw' | 'Walking' | 'Cab';
    durationMins: number;
    estimatedCostINR: number;
    distanceKm: number;
    transitTip: string;
  };
}

export interface GeneratedPlan {
  id: string;
  title: string;
  startingLocation: string;
  totalDurationHours: number;
  totalEstimatedCostINR: number;
  budgetINR: number;
  budgetRemainingINR: number;
  stops: ItineraryStop[];
  highlights: string[];
  localSmartTips: string[];
  generatedAt: string;
  savedAt?: string;
  isPreset?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'recommended' | 'alternative';
  title: string;
  distanceKm: number;
  estimatedTimeMins: number;
  lightingQuality: 'Well Lit' | 'Moderate' | 'Poorly Lit';
  lightingScore: number; // 1-5
  activeHazardsCount: number;
  transitOptions: string[];
  pathCoordinates: [number, number][];
  pros: string[];
  tradeOffs: string[];
  summary: string;
}

export interface RouteComparisonScenario {
  id: string;
  title: string;
  fromLocation: string;
  toLocation: string;
  context: string;
  routeA: RouteOption;
  routeB: RouteOption;
}
