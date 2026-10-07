import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Filter, 
  Check, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { ProjectAlert } from '../types';

interface AlertCenterViewProps {
  alerts: ProjectAlert[];
  onReviewAlert: (id: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onReviewAlert,
  onSelectProject,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [showReviewed, setShowReviewed] = useState(true);

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (!showReviewed && a.reviewed) return false;
    return true;
  });

  const unreviewedCount = alerts.filter((a) => !a.reviewed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Alert Center & Risk Change Detection
            </h1>
            {unreviewedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                {unreviewedCount} Action Required
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time threshold notifications when acquisition delay risk scores spike.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>

          <button
            onClick={() => setShowReviewed(!showReviewed)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              showReviewed
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            {showReviewed ? 'Showing All' : 'Hiding Reviewed'}
          </button>
        </div>
      </div>

      {/* Proactive Risk Change Concept Explainer */}
      <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Clock className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Proactive Monitoring In Action: </span>
          LandPulse continuously compares previous risk assessments against new revenue camp outputs and judicial updates. When a project experiences a statistically significant risk change (+10% or more), automated early warning triggers alert the responsible Collector.
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">All alerts reviewed!</p>
            <p className="text-xs text-slate-400 mt-0.5">No unresolved critical spikes found matching current filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  alert.reviewed
                    ? 'bg-white border-slate-200 opacity-75'
                    : isCritical
                    ? 'bg-red-50/40 border-red-300 shadow-2xs'
                    : isHigh
                    ? 'bg-orange-50/30 border-orange-200 shadow-2xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical ? 'bg-red-200 text-red-900 border border-red-300' :
                        isHigh ? 'bg-orange-200 text-orange-900 border border-orange-300' :
                        'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {alert.severity} ALERT
                      </span>

                      <span className="text-xs font-mono font-bold text-slate-700">
                        {alert.projectName}
                      </span>

                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">{alert.date}</span>

                      {alert.reviewed && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          <Check className="w-3 h-3" /> Reviewed
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {alert.title}
                    </h3>

                    {/* Risk Change Metrics Box */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-white/80 p-2 rounded border border-slate-200/60 w-fit">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Risk Changed:</span>
                        <span className="font-semibold text-slate-700">{alert.previousRisk}%</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className={`font-bold ${isCritical ? 'text-red-700' : 'text-slate-900'}`}>
                          {alert.currentRisk}%
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Variance:</span>
                        <span className={`font-bold ${alert.change > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {alert.change > 0 ? `+${alert.change}%` : `${alert.change}%`}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-snug">
                      <span className="font-semibold text-slate-900">Reason: </span>
                      {alert.reason}
                    </p>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/60">
                      <span className="font-semibold text-slate-800">Recommended Action: </span>
                      {alert.recommendedAction}
                    </p>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => onSelectProject(alert.projectId)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>View Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {!alert.reviewed ? (
                      <button
                        onClick={() => onReviewAlert(alert.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold border border-slate-300 shadow-2xs transition-colors"
                      >
                        Mark as Reviewed
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 text-center">
                        Reviewed by Official
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
