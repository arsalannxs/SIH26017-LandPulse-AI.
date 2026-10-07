import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Bot, 
  Scale, 
  Users, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  HelpCircle,
  Calendar,
  Layers,
  Check,
  CircleAlert,
  Loader2
} from 'lucide-react';
import { LandProject, StageRiskItem, AcquisitionStage } from '../types';

interface ProjectDetailViewProps {
  project: LandProject;
  projectsList: LandProject[];
  onSelectProject: (id: string) => void;
  onBack: () => void;
  onRunPrediction: (id: string) => void;
  onOpenGis: (id: string) => void;
  onOpenAssistant: (projectId: string) => void;
  onOpenReport: (projectId: string) => void;
  isPredicting?: boolean;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  projectsList,
  onSelectProject,
  onBack,
  onRunPrediction,
  onOpenGis,
  onOpenAssistant,
  onOpenReport,
  isPredicting = false,
}) => {
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);

  const handleGenerateBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      setBriefingText(data.explanation);
    } catch {
      setBriefingText(project.explainableSummary);
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  const stageOrder: AcquisitionStage[] = [
    'Notification',
    'Survey',
    'Documentation',
    'Approval',
    'Compensation',
    'Possession',
    'Closure',
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                {project.code}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {project.name}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {project.district}, {project.state} • {project.projectType} • Last updated {project.lastUpdated}
            </p>
          </div>
        </div>

        {/* Action Buttons & Project Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Switch Project */}
          <select
            value={project.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:outline-hidden"
          >
            {projectsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name.substring(0, 24)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => onOpenGis(project.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-2xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>GIS Map</span>
          </button>

          <button
            onClick={() => onOpenAssistant(project.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Ask Assistant</span>
          </button>

          <button
            onClick={() => onOpenReport(project.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Risk Dossier</span>
          </button>
        </div>
      </div>

      {/* Project Metadata Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Land Area</span>
          <div className="text-sm font-bold text-slate-900 mt-1">{project.landAreaAcres} Acres</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Demarcated RoW</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Affected Families</span>
          <div className="text-sm font-bold text-slate-900 mt-1">{project.affectedFamilies} PAPs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">R&R Beneficiaries</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Stage</span>
          <div className="text-sm font-bold text-blue-700 mt-1">{project.currentStage}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Statutory milestone</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Start Date</span>
          <div className="text-sm font-bold text-slate-900 mt-1">{project.startDate}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sec 11 gazette</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Completion</span>
          <div className="text-sm font-bold text-slate-900 mt-1">{project.expectedCompletion}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Statutory timeline</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Physical Progress</span>
          <div className="text-sm font-bold text-slate-900 mt-1">{project.progressPercent}%</div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Progress Timeline: WHERE IS THE PROJECT STUCK? */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Statutory Stage Milestone Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Instantly view completed, stalled, and pending acquisition phases
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
            Stuck at: {project.highestRiskStage}
          </span>
        </div>

        {/* 6-Stage Timeline Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {project.stageRisks.map((stg, idx) => {
            const isStuck = stg.status === 'delayed';
            const isCompleted = stg.status === 'completed';
            const isInProgress = stg.status === 'in_progress';
            const isPending = stg.status === 'pending';

            return (
              <div
                key={stg.stage}
                className={`p-3 rounded-lg border transition-all ${
                  isStuck
                    ? 'bg-red-50/70 border-red-300 ring-2 ring-red-100'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-200'
                    : isInProgress
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step 0{idx + 1}
                  </span>
                  {isCompleted && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                  {isStuck && (
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                      ⚠
                    </span>
                  )}
                  {isInProgress && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      ●
                    </span>
                  )}
                  {isPending && (
                    <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
                      ○
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs text-slate-900 truncate" title={stg.stage}>
                  {stg.stage}
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={stg.label}>
                  {stg.label}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Risk Prob:</span>
                  <span className={`font-bold ${
                    stg.probability >= 70 ? 'text-red-700' :
                    stg.probability >= 40 ? 'text-amber-700' :
                    'text-emerald-700'
                  }`}>
                    {stg.probability}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core AI Risk Prediction Box */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AI Risk Prediction Analysis</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                PROTOTYPE ML MODEL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained on 2,450 historical infrastructure land acquisition projects across 18 features.
            </p>
          </div>

          <button
            onClick={() => onRunPrediction(project.id)}
            disabled={isPredicting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            {isPredicting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Recalculating Risk...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Risk Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
          {/* Risk Score */}
          <div className="p-3.5 rounded-lg bg-red-50/40 border border-red-200">
            <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider">
              Risk Score
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-red-600">{project.riskScore}</span>
              <span className="text-xs font-bold text-slate-500">/ 100</span>
            </div>
            <p className="text-[10px] text-red-600 mt-1">Multi-factor composite</p>
          </div>

          {/* Delay Probability */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Delay Probability
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{project.delayProbability}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Overrun likelihood</p>
          </div>

          {/* Risk Category */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Risk Category
            </span>
            <div className="mt-1">
              <span className={`text-2xl font-black ${
                project.overallRisk === 'CRITICAL' || project.overallRisk === 'HIGH' ? 'text-red-600' :
                project.overallRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {project.overallRisk}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Executive escalation tier</p>
          </div>

          {/* Expected Delay */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Expected Delay
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-600">{project.expectedDelayMonths}</span>
              <span className="text-xs font-bold text-slate-600">months</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Estimated timeline overrun</p>
          </div>

          {/* Model Confidence */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Confidence
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-blue-700">{project.modelConfidence}%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Statistical model fit, not statutory certainty.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Stage-wise Risk & Top Delay Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage-wise Delay Probability Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stage-wise Delay Probability</h3>
              <p className="text-xs text-slate-500">Likelihood of delay emerging at each milestone</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
              Highest Risk: {project.highestRiskStage}
            </span>
          </div>

          <div className="space-y-2.5">
            {project.stageRisks.map((stg) => (
              <div key={stg.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${stg.stage === project.highestRiskStage ? 'text-red-700 font-bold' : 'text-slate-700'}`}>
                    {stg.stage}
                    {stg.stage === project.highestRiskStage && ' (Stuck)'}
                  </span>
                  <span className="font-bold text-slate-900 font-mono">{stg.probability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stg.probability >= 70 ? 'bg-red-500' :
                      stg.probability >= 40 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${stg.probability}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Critical Threshold: &gt; 60% probability</span>
            <span className="text-red-600 font-semibold">{project.highestRiskStage} is at {project.stageRisks.find(s => s.stage === project.highestRiskStage)?.probability}%</span>
          </div>
        </div>

        {/* Top Delay Drivers (SHAP / Feature Attribution) */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Delay Drivers (Why is it at risk?)</h3>
              <p className="text-xs text-slate-500">Ranked feature attribution via TreeSHAP explainability</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SHAP Attributions</span>
          </div>

          <div className="space-y-3">
            {project.topDrivers.map((driver, index) => (
              <div key={driver.id} className="p-2.5 rounded-md border border-slate-100 bg-slate-50/70 hover:bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold font-mono">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{driver.factor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      driver.impact === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      driver.impact === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      driver.impact === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {driver.impact}
                    </span>
                    <span className="text-xs font-bold text-red-600 font-mono">
                      +{driver.shapContribution} pts
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${driver.weight}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">{driver.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explainable AI Officer Briefing Memo */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Explainable AI — Officer Briefing Memo
            </h3>
          </div>

          <button
            onClick={handleGenerateBriefing}
            disabled={isGeneratingBriefing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
          >
            {isGeneratingBriefing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                <span>Generating Memo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Generate Official Briefing</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-md bg-blue-50/40 border border-blue-100 text-xs text-slate-800 leading-relaxed space-y-2">
          <p className="font-medium">
            {briefingText || project.explainableSummary}
          </p>
          <p className="text-[11px] text-slate-500 italic">
            * Generated for District Collector & Competent Authority (CALA) decision support. Predictions are advisory and non-legally binding.
          </p>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recommended Corrective Actions</h3>
            <p className="text-xs text-slate-500">Targeted interventions to prevent statutory time-bar breach</p>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            AI Suggested Actions • Official Discretion Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {project.recommendations.map((rec) => (
            <div key={rec.id} className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rec.priority === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                  rec.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {rec.priority} PRIORITY
                </span>
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  {rec.category}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
              <p className="text-xs text-slate-600 leading-snug">{rec.suggestedAction}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">Designated Authority: </span>
                  {rec.suggestedAuthority}
                </div>
                {rec.statutoryReference && (
                  <div>
                    <span className="font-semibold text-slate-700">Statutory Provision: </span>
                    <span className="text-blue-700 font-mono">{rec.statutoryReference}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Risk Trend & Planned vs Actual Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historical Risk Trend</h3>
              <p className="text-xs text-slate-500">Month-on-month risk score progression</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              project.trendDirection === 'increasing' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {project.trendDirection === 'increasing' ? 'Risk is increasing ↗' : 'Risk is stabilizing ↘'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {project.riskTrend.map((pt, idx) => (
              <div key={pt.month} className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-500">{pt.month}</div>
                <div className={`text-base font-black mt-1 ${
                  pt.score >= 70 ? 'text-red-600' :
                  pt.score >= 45 ? 'text-amber-600' : 'text-slate-800'
                }`}>
                  {pt.score}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{pt.probability}% prob</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200/60">
            <span className="font-semibold">Analysis: </span>
            The risk score rose steadily from {project.riskTrend[0].score} in January to {project.riskScore} currently, reflecting accumulated delays in compensation awards.
          </p>
        </div>

        {/* Planned vs Actual Timeline */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Planned vs Actual Timeline</h3>
              <p className="text-xs text-slate-500">Variance in statutory completion days</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Days Variance</span>
          </div>

          <div className="space-y-2">
            {project.stageRisks.slice(0, 5).map((stg) => (
              <div key={stg.stage} className="p-2 rounded-md border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{stg.stage}</div>
                  <div className="text-[10px] text-slate-400">
                    Planned: {stg.plannedDays}d • Actual: {stg.actualDays > 0 ? `${stg.actualDays}d` : 'In progress'}
                  </div>
                </div>

                <div>
                  {stg.delayDays > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">
                      +{stg.delayDays} days delay
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                      On Schedule
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
