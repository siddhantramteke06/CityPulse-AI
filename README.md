# CityPulse AI (Pune Edition) 🏙️

> **"Explore smarter. Move safer. Experience more."**  
> *Problem statement: City Life — Exploring, Experiencing & Navigating the Chaos We Call Home.*

CityPulse AI is an urban intelligence and exploration web application focused on **Pune, Maharashtra, India**. It empowers college students, tourists, daily commuters, and budget-conscious residents to discover iconic landmarks, generate personalized budget itineraries, explore community-reported hazards, and evaluate route trade-offs on an interactive map.

---

## 🚀 Live Web App & Android APK
- 🌐 **Live Web App (Firebase Hosting):** [https://citypulse-ai-pune.web.app](https://citypulse-ai-pune.web.app)
- 📱 **Download Android APK:** [CityPulse-AI.apk (GitHub Direct Download)](https://github.com/siddhantramteke06/CityPulse-AI/raw/main/CityPulse-AI.apk)
- 💻 **Local Development:** `http://127.0.0.1:5173/`

### Installation & Run Commands
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 🌟 Core Modules & Features

### 1. 🧭 City Dashboard
- **Welcome & Identity:** Tailored for Pune ("The Cultural & Tech Capital of Maharashtra").
- **Real-Time Weather Widget:** Pulls live temperature, conditions, and wind speed directly from **Open-Meteo API** (zero API key required).
- **Fast Search:** Instant autocomplete across Pune heritage sites, food hubs, areas, and Marathi local names (`शनिवार वाडा`, `तुळशीबाग`, etc.).
- **Live Pune Pulse Indicators:** Pune Metro status (Aqua & Purple Lines), community hazard counts, and rapid reporting CTA.
- **One-Click Presets:** Instant access to curated itineraries.

### 2. 🗺️ Explore Pune
- **Rich Pune Dataset:** Covers Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, Saras Baug & Talyatla Ganpati, FC Road (Cafe Goodluck & Vaishali), Tulshibaug & Vishrambaug Wada, Dagdusheth Halwai Ganpati Temple, Vetal Tekdi, Pataleshwar Cave Temple, Koregaon Park & Osho Garden, Raja Dinkar Kelkar Museum, and JM Road.
- **Multimodal View:** Split View (Map + Cards), Cards-only Grid, or Map-only view.
- **Interactive Leaflet + OpenStreetMap:** Custom category pins, interactive popups, and zoom controls with offline tile resilience.
- **Filters:** Categories (Heritage, Food, Nature/Forts, Bazaars, Temples, Modern Culture) and Indicative Budgets (Free, ≤ ₹50, ₹50–₹150, > ₹150).
- **Detailed Place Modals:** Comprehensive profiles with overview, highlights, local tips, transit accessibility (Metro distance, PMPML bus, auto availability), and ground safety notes.

### 3. ✨ AI City Planner (Signature Feature)
- **Custom Parameters:** Starting Hub (Swargate, Pune Station, Shivajinagar, Deccan, Kothrud, Viman Nagar, Koregaon Park), Budget slider (₹200 to ₹3,000+), Duration (2h to 8h), Interests, Group Size (Solo, Pair, Friends, Family), and Pace (Relaxed, Balanced, Fast-paced).
- **Intelligent Engine:** Sequences stops dynamically using nearest-neighbor geospatial chaining, computes realistic visit times, estimates itemized costs, and automatically recommends transit legs (Pune Metro, PMPML bus, Auto-rickshaw, or Walking) with fares.
- **Editable Itinerary:** Users can remove individual stops (recalculating the budget and timeline), regenerate alternatives, and save to LocalStorage.
- **3 Signature Presets:**
  1. *Pune in ₹500* (Budget student trail)
  2. *Historical Pune Day Out* (Peshwa heritage & Rashtrakuta rock caves)
  3. *Affordable Food Trail* (Goodluck bun maska, SPDP, Mastani, bakarwadi)

### 4. 🛡️ Safety Explorer & Safer-Route Comparison
- **Hazard Map:** Color-coded markers for reported road hazards, metro construction barricades, poor lighting, monsoon waterlogging, and congestion chokepoints.
- **Community Upvoting:** Corroborate reports directly with real-time score updates.
- **Evidence-Based Safer-Route Comparison:**
  - *Scenario 1:* Deccan Gymkhana ➔ Pune Station (Commercial FC Road & Metro vs Mutha Riverbed road shortcut)
  - *Scenario 2:* Swargate Hub ➔ Shaniwar Wada (Shivaji Road transit corridor vs Bajirao Road narrow bazaar gallis)
  - Displays map polylines, lighting ratings (out of 5), active hazard counts, transit availability, observed pros, and known trade-offs.

### 5. 📢 Citizen Reporting
- **Form:** Category selection, disruption severity (Low, Medium, High), incident title, description, Pune hotspot picker, and map coordinates.
- **Voice Dictation:** Integrated **Web Speech API** for hands-free voice-to-text reporting.
- **Photo Upload:** Local image file attachment or demonstration incident photo picker with preview.
- **Verification Pipeline:** Tracks status (`Submitted`, `Under Review`, `Resolved`) and persists reports to browser `localStorage`.

### 6. ⚖️ Place Comparison
- Side-by-side comparison of any two Pune destinations across:
  - Indicative Affordability & Entry Fees
  - Public Ratings & Review Volume
  - Cleanliness Surveys (with explicit disclaimers when survey data is pending)
  - Accessibility & Mobility ratings
  - Pune Metro Connectivity
  - Recommended visit duration & safety notes

### 7. 🔖 Saved Trips & Vault
- Offline-first storage for user-generated itineraries and bookmarked places.
- Preserved across browser refreshes via `localStorage`.

---

## 🔒 Data Transparency & Trust Policy

CityPulse AI strictly separates verified geospatial data from illustrative demonstration data:
- **Verified / Real:** Real Pune coordinates, authentic monument histories, OpenStreetMap tiles, and live Open-Meteo weather.
- **Indicative / Demonstration:** Entry ticket approximations, sample road hazard alerts, and simulated live traffic pulses are explicitly badged with "DEMO DATA" / "INDICATIVE ESTIMATE" tags to meet competition integrity standards.
