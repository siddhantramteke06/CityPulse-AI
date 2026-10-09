import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place, HazardReport } from '../types';

interface LeafletMapProps {
  places?: Place[];
  hazards?: HazardReport[];
  selectedPlaceId?: string | null;
  selectedHazardId?: string | null;
  onSelectPlace?: (place: Place) => void;
  onSelectHazard?: (hazard: HazardReport) => void;
  center?: [number, number];
  zoom?: number;
  routeCoordinates?: [number, number][];
  routeColor?: string;
  alternativeRouteCoordinates?: [number, number][];
  height?: string;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  places = [],
  hazards = [],
  selectedPlaceId,
  selectedHazardId,
  onSelectPlace,
  onSelectHazard,
  center = [18.5204, 73.8567], // Pune center
  zoom = 13,
  routeCoordinates,
  routeColor = '#0D9488',
  alternativeRouteCoordinates,
  height = '500px',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [tileError, setTileError] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale leaflet ID to prevent "Map container is already initialized"
    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    let map: L.Map | null = null;
    let resizeTimer: any = null;

    try {
      map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });

      // Standard OpenStreetMap Tiles - 100% Free, No API key, No watermarks
      const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      tileLayer.on('tileerror', () => {
        // Fallback to OSM France Humanitarian if main OSM has high latency
        try {
          L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: 'abc'
          }).addTo(map!);
        } catch {}
      });

      tileLayer.addTo(map);

      // Create Layer Groups
      const markersLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);

      markersLayerRef.current = markersLayer;
      routeLayerRef.current = routeLayer;
      mapInstanceRef.current = map;

      // Invalidate size to ensure full container coverage
      resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
          } catch {}
        }
      }, 250);
    } catch (e) {
      console.warn('Leaflet map initialization notice:', e);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Recenter when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      try {
        mapInstanceRef.current.setView(center, zoom, { animate: true });
      } catch {}
    }
  }, [center[0], center[1], zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    try {
      markersLayer.clearLayers();

      // 1. Render Places
      places.forEach(place => {
        const isSelected = place.id === selectedPlaceId;
        const markerHtml = `
          <div class="custom-map-pin ${isSelected ? 'selected' : ''}" style="
            background: ${isSelected ? '#0D9488' : '#0F172A'};
            color: white;
            border: 2px solid ${isSelected ? '#FACC15' : '#14B8A6'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            📍
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        const marker = L.marker(place.coordinates, { icon: customIcon });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 800; color: #0D9488; text-transform: uppercase;">
              ${place.categoryLabel}
            </div>
            <div style="font-weight: 800; font-size: 13px; color: #0F172A; margin: 2px 0;">
              ${place.name}
            </div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 4px;">
              ${place.area}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 4px; border-top: 1px solid #E2E8F0;">
              <span style="font-weight: 700; color: #0D9488;">★ ${place.rating.toFixed(1)}</span>
              <span style="color: #0F172A; font-weight: 700;">₹${place.indicativeCostPerPerson}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectPlace) onSelectPlace(place);
        });

        markersLayer.addLayer(marker);
      });

      // 2. Render Hazard Reports
      hazards.forEach(hazard => {
        const isSelected = hazard.id === selectedHazardId;
        const severityColor = hazard.severity === 'high' ? '#DC2626' : hazard.severity === 'medium' ? '#F59E0B' : '#3B82F6';
        
        const hazardHtml = `
          <div class="custom-hazard-pin ${isSelected ? 'selected' : ''}" style="
            background: ${severityColor};
            color: white;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
          ">
            ⚠️
          </div>
        `;

        const hazardIcon = L.divIcon({
          html: hazardHtml,
          className: 'custom-hazard-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker(hazard.coordinates, { icon: hazardIcon });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 190px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 800; color: ${severityColor}; text-transform: uppercase;">
              ${hazard.categoryLabel}
            </div>
            <div style="font-weight: 800; font-size: 12px; color: #0F172A; margin: 2px 0;">
              ${hazard.title}
            </div>
            <div style="font-size: 11px; color: #64748B;">
              ${hazard.locationName}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectHazard) onSelectHazard(hazard);
        });

        markersLayer.addLayer(marker);
      });
    } catch (err) {
      console.warn('Marker render notice:', err);
    }
  }, [places, hazards, selectedPlaceId, selectedHazardId]);

  // Update Routes Polyline
  useEffect(() => {
    const routeLayer = routeLayerRef.current;
    if (!routeLayer) return;

    try {
      routeLayer.clearLayers();

      if (routeCoordinates && routeCoordinates.length > 1) {
        const polyline = L.polyline(routeCoordinates, {
          color: routeColor,
          weight: 5,
          opacity: 0.85
        });
        routeLayer.addLayer(polyline);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [30, 30] });
        }
      }

      if (alternativeRouteCoordinates && alternativeRouteCoordinates.length > 1) {
        const altPolyline = L.polyline(alternativeRouteCoordinates, {
          color: '#94A3B8',
          weight: 4,
          opacity: 0.7,
          dashArray: '6, 8'
        });
        routeLayer.addLayer(altPolyline);
      }
    } catch {}
  }, [routeCoordinates, alternativeRouteCoordinates, routeColor]);

  return (
    <div 
      className={`relative w-full overflow-hidden bg-slate-100 ${className}`} 
      style={{ height, minHeight: '380px' }}
    >
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] px-2.5 py-1.5 rounded-xl font-bold text-slate-800 shadow-md flex items-center gap-2.5 select-none">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
          <span>Places</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          <span>Alerts</span>
        </div>
      </div>
    </div>
  );
};
