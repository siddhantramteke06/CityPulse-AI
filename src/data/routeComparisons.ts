import { RouteComparisonScenario } from '../types';

export const PUNE_ROUTE_SCENARIOS: RouteComparisonScenario[] = [
  {
    id: 'deccan-to-station',
    title: 'Deccan Gymkhana ➔ Pune Railway Station (Evening Transit)',
    fromLocation: 'Goodluck Chowk / FC Road',
    toLocation: 'Pune Railway Station (Platform 1 Concourse)',
    context: 'Commuter route after 8:00 PM comparing well-lit commercial transit corridors against darker riverfront shortcuts.',
    routeA: {
      id: 'route-metro-fc',
      name: 'Via FC Road & Pune Metro Aqua Line',
      type: 'recommended',
      title: 'Commercial Boulevard + Metro Rail',
      distanceKm: 5.2,
      estimatedTimeMins: 22,
      lightingQuality: 'Well Lit',
      lightingScore: 4.8,
      activeHazardsCount: 0,
      transitOptions: ['Pune Metro (Deccan to Pune Station)', 'Well-lit pedestrian footpaths'],
      pathCoordinates: [
        [18.5205, 73.8430],
        [18.5246, 73.8407],
        [18.5314, 73.8446],
        [18.5289, 73.8744]
      ],
      pros: [
        'Continuous high-lux LED street lighting and open shops along FC Road and JM Road.',
        'Direct Pune Metro ride takes 12 mins, avoiding road signals and traffic crawls.',
        'CCTV coverage and high pedestrian presence until 11:00 PM.'
      ],
      tradeOffs: [
        'Requires walking 500m to Deccan Gymkhana Metro concourse.',
        'Metro fare is ₹20 per passenger (slightly higher than direct PMPML bus).'
      ],
      summary: 'Recommended for late evenings and solo commuters seeking highest visibility, predictable transit time, and illuminated footpaths.'
    },
    routeB: {
      id: 'route-riverbed',
      name: 'Via Mutha Riverbed Road Shortcut',
      type: 'alternative',
      title: 'Riverbed Low-Traffic Bypass',
      distanceKm: 4.1,
      estimatedTimeMins: 25,
      lightingQuality: 'Poorly Lit',
      lightingScore: 2.3,
      activeHazardsCount: 2,
      transitOptions: ['Auto-rickshaw / Two-wheeler only (No direct public bus)'],
      pathCoordinates: [
        [18.5205, 73.8430],
        [18.5185, 73.8440],
        [18.5210, 73.8580],
        [18.5289, 73.8744]
      ],
      pros: [
        'Shorter distance by 1.1 km.',
        'Zero traffic signals during off-peak daytime hours.'
      ],
      tradeOffs: [
        'Multiple streetlamps out along the riverside link road (Citizen Hazard Rep-002).',
        'Minimal pedestrian presence and closed shops after dark.',
        'Can be closed during monsoon dam discharges due to water ingress.'
      ],
      summary: 'Convenient during broad daylight for two-wheelers, but not recommended for late-night solo walking due to inconsistent lighting.'
    }
  },
  {
    id: 'swargate-to-shaniwarwada',
    title: 'Swargate Multimodal Hub ➔ Shaniwar Wada & Old City',
    fromLocation: 'Swargate Bus/Metro Complex',
    toLocation: 'Shaniwar Wada Dilli Darwaza',
    context: 'Navigating heritage core Pune comparing primary arterial Shivaji Road vs pedestrian-dense Bajirao Road.',
    routeA: {
      id: 'route-shivaji-rd',
      name: 'Via Shivaji Road Corridor',
      type: 'recommended',
      title: 'Wide Commercial Artery (PMPML / Auto)',
      distanceKm: 2.8,
      estimatedTimeMins: 14,
      lightingQuality: 'Well Lit',
      lightingScore: 4.5,
      activeHazardsCount: 0,
      transitOptions: ['Direct PMPML Bus every 3 mins', 'Shared Auto-rickshaw', 'Footpaths with guard rails'],
      pathCoordinates: [
        [18.5018, 73.8585],
        [18.5110, 73.8570],
        [18.5164, 73.8561],
        [18.5196, 73.8553]
      ],
      pros: [
        'Passes directly by Dagdusheth Temple with prominent civic police assistance booths.',
        'Wide asphalt road with regular public buses.',
        'Consistently active commercial shopfronts.'
      ],
      tradeOffs: [
        'Moderate vehicular exhaust and horn noise during evening 6–8 PM peak.',
        'Wait time at Mandai Chowk traffic signal.'
      ],
      summary: 'Fastest and most accessible route with reliable public bus frequency and round-the-clock footfall.'
    },
    routeB: {
      id: 'route-bajirao-peths',
      name: 'Via Bajirao Road & Tulshibaug Gallis',
      type: 'alternative',
      title: 'Historic Peth Bazaar Walkway',
      distanceKm: 2.5,
      estimatedTimeMins: 28,
      lightingQuality: 'Moderate',
      lightingScore: 3.4,
      activeHazardsCount: 1,
      transitOptions: ['Walking / Slow two-wheeler only (Too congested for four-wheelers)'],
      pathCoordinates: [
        [18.5018, 73.8585],
        [18.5090, 73.8530],
        [18.5148, 73.8542],
        [18.5196, 73.8553]
      ],
      pros: [
        'Deep immersion in historic Wada architecture, copper utensil shops, and local sweets.',
        '250 meters shorter in absolute walking distance.'
      ],
      tradeOffs: [
        'Reported heavy pedestrian bottleneck near Tulshibaug (Hazard Rep-004).',
        'Pavements heavily occupied by hawkers; wheelchair access severely limited.',
        'Buses cannot navigate through these narrow lanes.'
      ],
      summary: 'Vibrant cultural experience on foot for shoppers, but substantially slower if trying to reach Shaniwar Wada with luggage or tight schedules.'
    }
  }
];
