import { Place, PlannerInput, GeneratedPlan, ItineraryStop } from '../types';
import { PUNE_PLACES } from '../data/puneData';

// Distance calculation between coordinates in km
function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Hub coordinates mapping
const HUB_COORDINATES: Record<string, [number, number]> = {
  swargate: [18.5018, 73.8585],
  pune_station: [18.5289, 73.8744],
  shivajinagar: [18.5314, 73.8446],
  deccan: [18.5205, 73.8430],
  kothrud: [18.5074, 73.8077],
  viman_nagar: [18.5679, 73.9143],
  koregaon_park: [18.5362, 73.8940]
};

export function generateSmartItinerary(input: PlannerInput): GeneratedPlan {
  const { startingLocation, budgetINR, durationHours, interests, groupSize, pace } = input;
  const startCoords = HUB_COORDINATES[startingLocation] || [18.5205, 73.8430];

  // Group size multiplier for variable food/entry estimation
  const personsCount = groupSize === 'solo' ? 1 : groupSize === 'couple' ? 2 : groupSize === 'friends' ? 3 : 4;
  const budgetPerPerson = Math.max(100, Math.floor(budgetINR / personsCount));

  // 1. Filter places matching interests or high-rated general anchors
  let eligiblePlaces = PUNE_PLACES.filter(p => {
    // If user has specific interests, prioritize matching
    if (interests.length > 0 && interests.includes(p.category)) {
      return true;
    }
    // Otherwise keep if budget per person covers it
    return p.indicativeCostPerPerson <= budgetPerPerson;
  });

  if (eligiblePlaces.length === 0) {
    eligiblePlaces = [...PUNE_PLACES];
  }

  // Pace factor determines stop duration and number of stops
  const paceFactor = pace === 'relaxed' ? 1.3 : pace === 'fast_paced' ? 0.75 : 1.0;
  const targetStopsCount = Math.min(
    6,
    Math.max(2, Math.floor((durationHours * 60) / (75 * paceFactor + 25)))
  );

  // Score places based on proximity to start, rating, interest match, and budget fit
  const scoredPlaces = eligiblePlaces.map(place => {
    const dist = calculateDistanceKm(startCoords, place.coordinates);
    const interestMatch = interests.includes(place.category) ? 30 : 0;
    const ratingScore = place.rating * 10;
    const budgetScore = place.indicativeCostPerPerson <= budgetPerPerson ? 20 : -20;
    const proximityScore = Math.max(0, 40 - dist * 3);

    // Sinhagad fort is special: only recommend if duration >= 5 hours
    if (place.id === 'sinhagad-fort' && durationHours < 5) {
      return { place, score: -100 };
    }

    const totalScore = interestMatch + ratingScore + budgetScore + proximityScore;
    return { place, score: totalScore, dist };
  });

  // Sort descending by score
  scoredPlaces.sort((a, b) => b.score - a.score);

  // Select top places ensuring variety across categories
  const selectedPlaces: Place[] = [];
  const chosenCategories = new Set<string>();

  for (const item of scoredPlaces) {
    if (selectedPlaces.length >= targetStopsCount) break;
    // Don't duplicate categories unless we run out of unique categories
    if (!chosenCategories.has(item.place.category) || selectedPlaces.length >= 3) {
      selectedPlaces.push(item.place);
      chosenCategories.add(item.place.category);
    }
  }

  // If still below target, fill in remainder
  for (const item of scoredPlaces) {
    if (selectedPlaces.length >= targetStopsCount) break;
    if (!selectedPlaces.find(p => p.id === item.place.id)) {
      selectedPlaces.push(item.place);
    }
  }

  // Sequence stops logically from startCoords using nearest-neighbor route chaining
  const sequenced: Place[] = [];
  const remaining = [...selectedPlaces];
  let currentCoord = startCoords;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = 9999;
    for (let i = 0; i < remaining.length; i++) {
      const d = calculateDistanceKm(currentCoord, remaining[i].coordinates);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    const [picked] = remaining.splice(nearestIdx, 1);
    sequenced.push(picked);
    currentCoord = picked.coordinates;
  }

  // Build timeline starting at 09:30 AM (or 08:30 AM if long duration)
  let currentMinute = durationHours >= 6 ? 8 * 60 + 30 : 9 * 60 + 30; // 8:30 AM or 9:30 AM
  let cumulativeCost = 0;

  const stops: ItineraryStop[] = sequenced.map((place, idx) => {
    const arrivalTimeStr = formatMinutesToTime(currentMinute);
    const duration = Math.round((place.avgDurationMinutes * paceFactor) / 15) * 15;
    const departureMinute = currentMinute + duration;
    const departureTimeStr = formatMinutesToTime(departureMinute);

    // Calculate place cost for group
    const perPersonEstimated = place.entryFeeINR + (place.indicativeCostPerPerson > 0 ? place.indicativeCostPerPerson : 20);
    const stopCost = perPersonEstimated * personsCount;
    cumulativeCost += stopCost;

    // Determine transit to next stop if not last
    let transitToNext = undefined;
    if (idx < sequenced.length - 1) {
      const nextPlace = sequenced[idx + 1];
      const legDist = calculateDistanceKm(place.coordinates, nextPlace.coordinates);
      
      let mode: 'Pune Metro' | 'PMPML Bus' | 'Auto-rickshaw' | 'Walking' | 'Cab' = 'Auto-rickshaw';
      let transitDuration = Math.round(legDist * 4 + 8);
      let transitFare = Math.round(30 + legDist * 16);
      let tip = `Auto-rickshaw fare ~₹${transitFare} by meter or Ola/Uber Auto.`;

      if (legDist <= 0.9) {
        mode = 'Walking';
        transitDuration = Math.round(legDist * 13);
        transitFare = 0;
        tip = `Pleasant ${Math.round(legDist * 1000)}m walk through old Pune streets.`;
      } else if (place.transitAccess.metroStation && nextPlace.transitAccess.metroStation && legDist > 2.0) {
        mode = 'Pune Metro';
        transitDuration = 14;
        transitFare = 20 * personsCount;
        tip = `Catch Pune Metro Aqua/Purple line to bypass street bottlenecks (${legDist} km).`;
      } else if (legDist > 1.0 && legDist < 3.0) {
        mode = 'PMPML Bus';
        transitDuration = 18;
        transitFare = 10 * personsCount;
        tip = `Take regular PMPML arterial bus frequency along Shivaji Rd / JM Rd.`;
      }

      cumulativeCost += transitFare;
      transitToNext = {
        mode,
        durationMins: transitDuration,
        estimatedCostINR: transitFare,
        distanceKm: legDist,
        transitTip: tip
      };

      currentMinute = departureMinute + transitDuration;
    } else {
      currentMinute = departureMinute;
    }

    let activityDesc = `Explore ${place.name}: ${place.highlights.slice(0, 2).join(' & ')}.`;
    if (place.category === 'food') {
      activityDesc = `Enjoy authentic local bites at ${place.name} (${place.highlights[0]}).`;
    } else if (place.category === 'nature_fort') {
      activityDesc = `Scenic viewpoint and exploration at ${place.name}. Carry water and wear comfortable shoes.`;
    }

    return {
      stopNumber: idx + 1,
      placeId: place.id,
      place,
      arrivalTime: arrivalTimeStr,
      departureTime: departureTimeStr,
      durationMinutes: duration,
      estimatedCostINR: stopCost,
      recommendedActivity: activityDesc,
      transitToNext
    };
  });

  const remainingBudget = Math.max(0, budgetINR - cumulativeCost);

  const localSmartTips = [
    `Metro & Public Transit Tip: Pune Metro operates 6:00 AM to 10:00 PM; tickets can be booked via WhatsApp or at concourse kiosks.`,
    `Budget Insight: Total indicative cost is estimated at ~₹${cumulativeCost} for ${groupSize} (${personsCount} person${personsCount > 1 ? 's' : ''}), leaving ₹${remainingBudget} cushion.`,
    `Afternoon Timing: Most Old Pune heritage shops in Tulshibaug and traditional sweetmakers close for afternoon siesta between 1:00 PM and 4:00 PM. Plan shopping stops accordingly.`
  ];

  return {
    id: `plan-${Date.now()}`,
    title: `${durationHours}-Hour ${getHubLabel(startingLocation)} Exploration`,
    startingLocation: getHubLabel(startingLocation),
    totalDurationHours: durationHours,
    totalEstimatedCostINR: cumulativeCost,
    budgetINR,
    budgetRemainingINR: remainingBudget,
    stops,
    highlights: selectedPlaces.map(p => p.name),
    localSmartTips,
    generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  };
}

function formatMinutesToTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${period}`;
}

function getHubLabel(hubId: string): string {
  const map: Record<string, string> = {
    swargate: 'Swargate Hub',
    pune_station: 'Pune Railway Station',
    shivajinagar: 'Shivajinagar Hub',
    deccan: 'Deccan Gymkhana',
    kothrud: 'Kothrud',
    viman_nagar: 'Viman Nagar',
    koregaon_park: 'Koregaon Park'
  };
  return map[hubId] || 'Central Pune';
}

// 3 Preset Scenarios Required by prompt
export const PRESET_SCENARIOS: { id: string; label: string; description: string; input: PlannerInput }[] = [
  {
    id: 'preset-500',
    label: 'Pune in ₹500',
    description: 'Pocket-friendly student trail covering iconic monuments, spiritual lake garden, and legendary street food.',
    input: {
      startingLocation: 'swargate',
      budgetINR: 500,
      durationHours: 5,
      interests: ['heritage', 'food', 'temple', 'shopping'],
      groupSize: 'solo',
      pace: 'balanced'
    }
  },
  {
    id: 'preset-historical',
    label: 'Historical Pune Day Out',
    description: 'Deep dive into Peshwa legacy, 8th-century monolithic rock caves, Maratha artifacts and freedom-struggle monuments.',
    input: {
      startingLocation: 'shivajinagar',
      budgetINR: 800,
      durationHours: 6,
      interests: ['heritage'],
      groupSize: 'pair' as any,
      pace: 'relaxed'
    }
  },
  {
    id: 'preset-food-trail',
    label: 'Affordable Food Trail',
    description: 'A culinary pilgrimage through Bun Maska, SPDP, Mastani shakes, hot sabudana khichdi & Chitale bakarwadi.',
    input: {
      startingLocation: 'deccan',
      budgetINR: 650,
      durationHours: 4,
      interests: ['food', 'shopping'],
      groupSize: 'friends',
      pace: 'balanced'
    }
  }
];
