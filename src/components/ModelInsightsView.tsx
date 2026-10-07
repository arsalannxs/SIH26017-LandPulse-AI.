import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Scale, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { ModelMetrics } from '../types';

interface ModelInsightsViewProps {
  metrics: ModelMetrics;
}

export const ModelInsightsView: React.FC<ModelInsightsViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Predictive Model Architecture & Insights
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              PROTOTYPE PREDICTION MODEL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Machine learning pipeline details, feature attribution methodology, and continuous learning roadmap.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Model Status: Active</span>
        </div>
      </div>

      {/* Top Model KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Model Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.status}</div>
          <div className="text-[11px] text-slate-400 mt-1">Validated inference pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Historical Training Set</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {metrics.trainingRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Closed acquisition projects</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Prediction Features</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.featuresCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Statutory & administrative vectors</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Confidence</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">{metrics.confidenceAverage}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Statistical probability calibration</div>
        </div>
      </div>

      {/* How Prediction Works */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">How LandPulse Prediction Works</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The model learns delay patterns from historical land acquisition projects under the RFCTLARR Act 2013 and National Highways Act 1956. By continuously evaluating current milestone execution times against baseline statutory timelines, the system quantifies delay risk before irreversible administrative bottlenecks occur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-xs">
            <span className="font-bold text-slate-900 block mb-1">1. Milestone Velocity</span>
            <p className="text-slate-600 text-[11px]">
              Measures elapsed days vs planned statutory days across Survey, Section 19 declaration, and Award determination.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-xs">
            <span className="font-bold text-slate-900 block mb-1">2. Dispute Friction Index</span>
            <p className="text-slate-600 text-[11px]">
              Weights high court writ petitions, Section 3G(5) valuation arbitrations, and disputed title partitions.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-xs">
            <span className="font-bold text-slate-900 block mb-1">3. Compensation Disbursement</span>
            <p className="text-slate-600 text-[11px]">
              Analyzes percentage of award funds successfully credited into verified Aadhaar/PFMS beneficiary accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Explainable AI (SHAP Methodology) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Explainable AI (TreeSHAP Feature Attribution)
            </h3>
            <p className="text-xs text-slate-500">
              Translating machine learning decision trees into plain-language risk points
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Shapley Additive Values</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Rather than functioning as a black-box model, LandPulse uses TreeSHAP (Shapley Additive Explanations) to calculate how much each project attribute increases or decreases the baseline risk score:
        </p>

        <div className="space-y-2">
          {[
            { factor: 'Compensation Pending & Escrow Backlog', impact: '+24 risk points', pct: 82, desc: 'Unverified bank accounts and indemnity bond delays in awardee families' },
            { factor: 'Unresolved Legal Disputes (High Court Writs)', impact: '+18 risk points', pct: 64, desc: 'Interim stays and valuation revision references under Sec 64' },
            { factor: 'Administrative & Inter-Departmental Delay', impact: '+12 risk points', pct: 51, desc: 'Competent Authority sanction and forest Stage-II clearance' },
            { factor: 'Incomplete Documentation & Mutation Records', impact: '+9 risk points', pct: 42, desc: 'Undivided ancestral joint shares in revenue extracts' },
            { factor: 'Stakeholder & Gram Sabha Coordination', impact: '+5 risk points', pct: 28, desc: 'R&R package public hearing minutes pending sign-off' },
          ].map((item) => (
            <div key={item.factor} className="p-2.5 rounded-md bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-900">{item.factor}</span>
                <span className="font-bold text-red-600 font-mono">{item.impact}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                <div className="bg-red-500 h-full" style={{ width: `${item.pct}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Learning & Future Scope */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">Continuous Learning & Model Updates</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            FUTURE SCOPE (ROADMAP)
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          As new acquisition projects conclude across states, closed project records can be ingested to continuously re-train and calibrate delay heuristics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Last Model Update</span>
            <div className="text-sm font-bold text-slate-900 mt-1">{metrics.lastUpdated}</div>
          </div>
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">New Records Staged</span>
            <div className="text-sm font-bold text-blue-700 mt-1">142 Completed Corridors</div>
          </div>
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Retraining Frequency</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Quarterly Scheduled Batch</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-amber-50/50 p-3 rounded-md border border-amber-200 italic">
          Transparency Notice: Real automated continuous machine learning retraining is marked as Future Scope. The prototype simulates batch evaluation using verified historical baselines.
        </div>
      </div>
    </div>
  );
};
