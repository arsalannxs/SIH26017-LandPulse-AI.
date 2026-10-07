import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LandProject, RiskCategory } from '../types';
import { MapPin, ExternalLink, Activity, AlertTriangle, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

interface GisMapViewProps {
  projects: LandProject[];
  onSelectProject: (id: string) => void;
  selectedProjectId?: string;
}

export const GisMapView: React.FC<GisMapViewProps> = ({
  projects,
  onSelectProject,
  selectedProjectId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [activeProject, setActiveProject] = useState<LandProject>(
    projects.find((p) => p.id === selectedProjectId) || projects[0]
  );
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH_CRITICAL' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredProjects = projects.filter((p) => {
    if (filterRisk === 'HIGH_CRITICAL') return p.overallRisk === 'HIGH' || p.overallRisk === 'CRITICAL';
    if (filterRisk === 'MEDIUM') return p.overallRisk === 'MEDIUM';
    if (filterRisk === 'LOW') return p.overallRisk === 'LOW';
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Central India (approx 21.0, 78.5)
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 79.0],
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | DoLR LandPulse AI',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Marker colors helper
    const getMarkerColor = (risk: RiskCategory) => {
      switch (risk) {
        case 'CRITICAL':
          return '#dc2626'; // Red
        case 'HIGH':
          return '#ea580c'; // Orange
        case 'MEDIUM':
          return '#d97706'; // Amber/Yellow
        case 'LOW':
          return '#16a34a'; // Green
      }
    };

    // Add markers
    filteredProjects.forEach((proj) => {
      const color = getMarkerColor(proj.overallRisk);

      // Custom circular SVG icon with risk pulse for critical/high
      const isCriticalOrHigh = proj.overallRisk === 'CRITICAL' || proj.overallRisk === 'HIGH';
      const customIcon = L.divIcon({
        className: 'custom-gis-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; cursor: pointer;">
            ${isCriticalOrHigh ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${color}; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 800;">
              ${proj.riskScore}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([proj.lat, proj.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveProject(proj);
        map.flyTo([proj.lat, proj.lng], 8, { duration: 1 });
      });

      markersRef.current[proj.id] = marker;
    });

    return () => {
      // Cleanup if needed
    };
  }, [filteredProjects]);

  // Center on selected project if changed externally
  useEffect(() => {
    if (selectedProjectId && mapInstanceRef.current) {
      const target = projects.find((p) => p.id === selectedProjectId);
      if (target) {
        setActiveProject(target);
        mapInstanceRef.current.flyTo([target.lat, target.lng], 8, { duration: 1.2 });
      }
    }
  }, [selectedProjectId, projects]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Geospatial Land Acquisition Risk Map (GIS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Geographical dispersion of infrastructure corridors with color-coded risk markers.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-slate-700">Critical (&gt;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-700">High (60-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700">Medium (35-59)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-slate-700">Low (&lt;35)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterRisk('ALL')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            filterRisk === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilterRisk('HIGH_CRITICAL')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            filterRisk === 'HIGH_CRITICAL'
              ? 'bg-red-600 text-white'
              : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
          }`}
        >
          High & Critical Only
        </button>
        <button
          onClick={() => setFilterRisk('MEDIUM')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            filterRisk === 'MEDIUM'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Medium Watchlist
        </button>
        <button
          onClick={() => setFilterRisk('LOW')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            filterRisk === 'LOW'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          On Track (Low)
        </button>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs h-[520px] relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick Notice Overlay */}
          <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-slate-600 border border-slate-200 shadow-2xs pointer-events-none">
            Click any marker to inspect corridor coordinates and delay attribution.
          </div>
        </div>

        {/* Selected Project Card & Corridor Directory */}
        <div className="space-y-4">
          {/* Active Inspected Project */}
          {activeProject && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-700">
                      {activeProject.code}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      activeProject.overallRisk === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      activeProject.overallRisk === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      activeProject.overallRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeProject.overallRisk} RISK
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {activeProject.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeProject.district}, {activeProject.state}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Delay Prob</span>
                  <div className="text-base font-extrabold text-slate-900">{activeProject.delayProbability}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Expected Delay</span>
                  <div className="text-base font-extrabold text-amber-600">{activeProject.expectedDelayMonths} mo</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Current Stage</span>
                  <div className="text-xs font-bold text-slate-800 truncate">{activeProject.currentStage}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Land Area</span>
                  <div className="text-xs font-bold text-slate-800">{activeProject.landAreaAcres} Acres</div>
                </div>
              </div>

              {/* Top bottleneck */}
              <div className="p-2.5 rounded bg-red-50/50 border border-red-100 text-xs space-y-1">
                <span className="font-bold text-red-800">Primary Bottleneck:</span>
                <p className="text-red-700 text-[11px] leading-snug">
                  {activeProject.topDrivers[0]?.factor || 'Verification in progress'}
                </p>
              </div>

              <button
                onClick={() => onSelectProject(activeProject.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Risk Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick List */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2 max-h-[220px] overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Locate Project on Map
            </span>
            {filteredProjects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([proj.lat, proj.lng], 8, { duration: 0.8 });
                  }
                }}
                className={`w-full text-left p-2 rounded text-xs flex items-center justify-between border transition-colors ${
                  activeProject?.id === proj.id
                    ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="truncate mr-2">
                  <span className="font-mono text-[10px] text-slate-400 mr-1">{proj.code}</span>
                  <span>{proj.name}</span>
                </div>
                <span className={`text-[10px] font-bold shrink-0 ${
                  proj.overallRisk === 'CRITICAL' || proj.overallRisk === 'HIGH' ? 'text-red-600' :
                  proj.overallRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {proj.delayProbability}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
