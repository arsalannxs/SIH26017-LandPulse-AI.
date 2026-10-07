import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  MapPin, 
  Activity, 
  Building2, 
  ChevronRight, 
  FileText, 
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LandProject, ProjectAlert } from '../types';

interface DashboardViewProps {
  projects: LandProject[];
  alerts: ProjectAlert[];
  onSelectProject: (projectId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onRunPrediction: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  alerts,
  onSelectProject,
  onNavigateToTab,
  onRunPrediction,
}) => {
  // Focus project requested in specifications: Mumbai-Pune Corridor (LA-MH-1024)
  const focusProject = projects.find((p) => p.code === 'LA-MH-1024') || projects[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Land Acquisition Risk Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor projects and identify potential delays before they become critical.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('gis')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-2xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Open GIS Map</span>
          </button>
          <button
            onClick={() => onNavigateToTab('projects')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <span>View All Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Projects</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">128</span>
            <span className="text-[11px] text-slate-500">Active Corridors</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>National Infrastructure Pipeline</span>
            <span className="font-semibold text-slate-700">100% Tracked</span>
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-white rounded-lg border border-red-200 p-4 shadow-2xs bg-red-50/20 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-700">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-red-600">14</span>
            <span className="text-[11px] font-semibold text-red-700">10.9% of Total</span>
          </div>
          <div className="mt-2 text-[11px] text-red-600/90 flex items-center justify-between">
            <span>Requires Executive Action</span>
            <span className="font-bold underline cursor-pointer" onClick={() => onNavigateToTab('alerts')}>
              Review &rarr;
            </span>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="bg-white rounded-lg border border-amber-200 p-4 shadow-2xs bg-amber-50/20 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700">Medium Risk</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">27</span>
            <span className="text-[11px] font-semibold text-amber-700">21.1% of Total</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700/90 flex items-center justify-between">
            <span>Watchlist / Approvals Pending</span>
            <span className="font-medium">Active SLAO Watch</span>
          </div>
        </div>

        {/* On Track */}
        <div className="bg-white rounded-lg border border-emerald-200 p-4 shadow-2xs bg-emerald-50/20 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700">On Track</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">87</span>
            <span className="text-[11px] font-semibold text-emerald-700">68.0% of Total</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700/90 flex items-center justify-between">
            <span>Milestones within Planned Days</span>
            <span className="font-medium">Healthy</span>
          </div>
        </div>
      </div>

      {/* Featured Project Risk Overview (as per specification) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                {focusProject.code}
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {focusProject.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{focusProject.state} • {focusProject.district}</span>
              <span>•</span>
              <span>Linear Area: {focusProject.landAreaAcres} Acres</span>
              <span>•</span>
              <span>Affected Families: {focusProject.affectedFamilies}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRunPrediction(focusProject.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Run AI Risk Analysis</span>
            </button>
            <button
              onClick={() => onSelectProject(focusProject.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
            >
              <span>Deep-Dive Analysis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big Visual Risk Metric Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
              Overall Risk Category
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-black text-red-600">HIGH</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900">
                Score {focusProject.riskScore}/100
              </span>
            </div>
            <p className="text-[11px] text-red-700 mt-1">
              Risk increased (+{focusProject.riskChangePercent}%) in current cycle
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Delay Probability
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {focusProject.delayProbability}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Likelihood</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full"
                style={{ width: `${focusProject.delayProbability}%` }}
              ></div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Expected Delay
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-600">
                {focusProject.expectedDelayMonths}
              </span>
              <span className="text-sm font-semibold text-slate-700">months</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Statutory timeline overrun estimate
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Current Stage
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {focusProject.currentStage}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Delayed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Sec 23/31 Award Disbursement
            </p>
          </div>
        </div>

        {/* Explainable summary snippet */}
        <div className="mt-4 p-3 rounded-md bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Why is this project at high risk? </span>
            {focusProject.explainableSummary}
          </div>
        </div>
      </div>

      {/* Two Column Layout: State-wise Risk & Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Analytics */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Projects by State</h3>
              <p className="text-xs text-slate-500">Distribution of monitored acquisition corridors</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">DoLR Analytics</span>
          </div>

          <div className="space-y-3">
            {[
              { state: 'Maharashtra', highRisk: 8, total: 24, percent: 33 },
              { state: 'Uttar Pradesh', highRisk: 5, total: 31, percent: 16 },
              { state: 'Karnataka', highRisk: 4, total: 19, percent: 21 },
              { state: 'Bihar', highRisk: 3, total: 16, percent: 19 },
              { state: 'Odisha', highRisk: 3, total: 14, percent: 21 },
              { state: 'Rajasthan', highRisk: 1, total: 24, percent: 4 },
            ].map((item) => (
              <div key={item.state} className="p-2.5 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-slate-50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">{item.state}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{item.total} total</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                      {item.highRisk} High Risk
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(item.highRisk / item.total) * 100}%` }}
                  ></div>
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${100 - (item.highRisk / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage-wise Risk Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Highest Risk Stages</h3>
              <p className="text-xs text-slate-500">Statutory phase bottleneck concentration</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
              Compensation Peak
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { stage: 'Compensation & Award', highRisk: 12, total: 23, riskLevel: 'CRITICAL', desc: 'Disbursement & KYC verification backlogs' },
              { stage: 'Documentation & RoR', highRisk: 7, total: 32, riskLevel: 'HIGH', desc: 'Mutations, ancestral partitions & title disputes' },
              { stage: 'Administrative Approval', highRisk: 4, total: 21, riskLevel: 'HIGH', desc: 'Forest / Railway / Multi-departmental clearances' },
              { stage: 'Joint Survey & SIA', highRisk: 3, total: 24, riskLevel: 'MEDIUM', desc: 'Gram Sabha hearings & contour validations' },
              { stage: 'Physical Possession', highRisk: 2, total: 8, riskLevel: 'MEDIUM', desc: 'Encroachments & police protection scheduling' },
              { stage: 'Preliminary Notification', highRisk: 1, total: 18, riskLevel: 'LOW', desc: 'Section 11 Gazette publications' },
            ].map((stg) => (
              <div key={stg.stage} className="p-2.5 rounded-md border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{stg.stage}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    stg.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    stg.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {stg.highRisk} Projects Delayed
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{stg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Early Warning Alert Highlight banner */}
      {alerts.length > 0 && (
        <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-800">
                  CRITICAL EARLY WARNING: {alerts[0].projectName}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-200 text-red-900">
                  +{alerts[0].change}% Risk Spike
                </span>
              </div>
              <p className="text-xs text-red-700 mt-0.5">{alerts[0].reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('alerts')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
            >
              Open Alert Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
