import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Scale, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  FileWarning
} from 'lucide-react';
import { LandProject } from '../types';

interface EarlyWarningViewProps {
  projects: LandProject[];
  onSelectProject: (id: string) => void;
  onOpenReport: (id: string) => void;
}

export const EarlyWarningView: React.FC<EarlyWarningViewProps> = ({
  projects,
  onSelectProject,
  onOpenReport,
}) => {
  // Filter for projects requiring early intervention
  const warningProjects = projects.filter(
    (p) => p.overallRisk === 'CRITICAL' || p.overallRisk === 'HIGH' || p.delayProbability >= 60
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Early Warning Radar System
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
              Proactive Pre-Breach Alert
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Detecting acquisition corridors projected to exceed statutory completion milestones before delays compound.
          </p>
        </div>

        <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
          {warningProjects.length} Projects in Critical Overrun Window
        </div>
      </div>

      {/* Value Proposition Callout */}
      <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent p-4 rounded-lg border border-red-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-800 leading-relaxed">
          <span className="font-bold text-slate-900">Core Value Proposition: </span>
          Traditional land acquisition monitoring flags projects only after deadlines lapse and contractors file idle machinery claims. LandPulse AI identifies risk trajectories 3 to 6 months in advance, giving District Magistrates and SLAOs time to convene dispute camps and unblock statutory procedures.
        </div>
      </div>

      {/* Warning Cards List */}
      <div className="space-y-4">
        {warningProjects.map((proj) => {
          const topDriver = proj.topDrivers[0];
          const topAction = proj.recommendations[0];

          return (
            <div
              key={proj.id}
              className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-100 text-slate-700">
                      {proj.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proj.overallRisk === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {proj.overallRisk} RISK
                    </span>
                    <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {proj.district}, {proj.state} • Stage: <span className="font-semibold text-slate-800">{proj.currentStage}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenReport(proj.id)}
                    className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                  >
                    Generate Dossier
                  </button>
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Analyze</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Warning Banner Text */}
              <div className="p-3 bg-amber-50/70 rounded-md border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 leading-snug">
                  <span className="font-bold">Early Warning: </span>
                  Project {proj.code} is projected to exceed its planned acquisition timeline by{' '}
                  <span className="font-extrabold text-red-700">{proj.expectedDelayMonths} months</span>.
                  Current delay probability is <span className="font-extrabold text-red-700">{proj.delayProbability}%</span>.
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delay Probability</span>
                  <div className="text-lg font-black text-red-600 mt-0.5">{proj.delayProbability}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High confidence threshold</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estimated Overrun</span>
                  <div className="text-lg font-black text-amber-600 mt-0.5">{proj.expectedDelayMonths} months</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Statutory completion variance</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Primary Risk Driver</span>
                  <div className="text-xs font-bold text-slate-900 truncate mt-1" title={topDriver?.factor}>
                    {topDriver?.factor || 'Pending verification'}
                  </div>
                  <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                    +{topDriver?.shapContribution || 20} risk points (SHAP)
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              {topAction && (
                <div className="p-3 rounded-md bg-blue-50/40 border border-blue-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">Immediate Recommended Action: </span>
                    <span className="text-slate-700">{topAction.suggestedAction}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0 font-mono">
                    {topAction.suggestedAuthority}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
