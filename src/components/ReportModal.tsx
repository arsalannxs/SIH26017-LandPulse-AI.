import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { LandProject } from '../types';

interface ReportModalProps {
  project: LandProject;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ project, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Action Bar */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-bold text-slate-800">
              Project Risk Dossier & Statutory Review Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div ref={printRef} className="p-8 overflow-y-auto space-y-6 text-slate-900 text-xs">
          {/* Official DoLR Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <Building2 className="w-4 h-4 text-blue-800" />
              <span>Department of Land Resources (DoLR)</span>
            </div>
            <div className="text-slate-600 text-[11px]">
              Ministry of Rural Development • Government of India
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 uppercase">
              Land Acquisition Delay Risk Dossier
            </h1>
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
              <span>DOSSIER REF: LP-REP-{project.code}</span>
              <span>•</span>
              <span>DATE: {generatedDate}</span>
              <span>•</span>
              <span>SIH 2026 EVALUATION COPY</span>
            </div>
          </div>

          {/* Project Primary Profile */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500">{project.code}</span>
                <h2 className="text-sm font-bold text-slate-900">{project.name}</h2>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-black ${
                project.overallRisk === 'CRITICAL' ? 'bg-red-200 text-red-900' :
                project.overallRisk === 'HIGH' ? 'bg-orange-200 text-orange-900' :
                'bg-amber-100 text-amber-900'
              }`}>
                {project.overallRisk} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">State / District</span>
                <span className="font-semibold text-slate-800">{project.district}, {project.state}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Corridor Type</span>
                <span className="font-semibold text-slate-800">{project.projectType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Total Land Area</span>
                <span className="font-semibold text-slate-800">{project.landAreaAcres} Acres</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Affected Families</span>
                <span className="font-semibold text-slate-800">{project.affectedFamilies} Families</span>
              </div>
            </div>
          </div>

          {/* AI Predictive Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Risk Score</span>
              <div className="text-xl font-black text-red-600 mt-0.5">{project.riskScore} / 100</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Delay Probability</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{project.delayProbability}%</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Projected Overrun</span>
              <div className="text-xl font-black text-amber-600 mt-0.5">{project.expectedDelayMonths} months</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Model Confidence</span>
              <div className="text-xl font-black text-blue-700 mt-0.5">{project.modelConfidence}%</div>
            </div>
          </div>

          {/* Executive Administrative Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Executive Administrative Summary
            </h3>
            <p className="p-3 bg-blue-50/50 rounded-md border border-blue-100 leading-relaxed text-slate-800">
              {project.explainableSummary}
            </p>
          </div>

          {/* Stage Progress & Bottlenecks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Stage-Wise Milestone Breakdown
            </h3>
            <table className="w-full text-left border border-slate-200 rounded-md overflow-hidden">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-2">Stage</th>
                  <th className="p-2">Statutory Reference</th>
                  <th className="p-2">Planned</th>
                  <th className="p-2">Actual</th>
                  <th className="p-2">Variance</th>
                  <th className="p-2">Risk Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {project.stageRisks.map((stg) => (
                  <tr key={stg.stage}>
                    <td className="p-2 font-semibold text-slate-900">{stg.stage}</td>
                    <td className="p-2 text-slate-600">{stg.label}</td>
                    <td className="p-2">{stg.plannedDays}d</td>
                    <td className="p-2">{stg.actualDays > 0 ? `${stg.actualDays}d` : 'Pending'}</td>
                    <td className="p-2 font-semibold">
                      {stg.delayDays > 0 ? (
                        <span className="text-red-600">+{stg.delayDays}d Delay</span>
                      ) : (
                        <span className="text-emerald-700">On Track</span>
                      )}
                    </td>
                    <td className="p-2 font-bold">{stg.probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Delay Drivers (SHAP) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Root Delay Drivers (SHAP Feature Attribution)
            </h3>
            <div className="space-y-1.5">
              {project.topDrivers.map((driver, idx) => (
                <div key={driver.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{idx + 1}. {driver.factor}</span>
                    <span className="text-slate-500">({driver.category}) — {driver.description}</span>
                  </div>
                  <span className="font-mono font-bold text-red-600 shrink-0">
                    +{driver.shapContribution} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Corrective Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              4. AI Suggested Corrective Actions
            </h3>
            <div className="space-y-2">
              {project.recommendations.map((rec) => (
                <div key={rec.id} className="p-2.5 rounded border border-slate-200 bg-white">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                    <span>[{rec.priority} PRIORITY] {rec.title}</span>
                    <span className="text-blue-700 font-mono text-[10px]">{rec.suggestedAuthority}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rec.suggestedAction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="pt-4 border-t-2 border-slate-900/60 text-[10px] text-slate-500 space-y-1 leading-snug">
            <div className="font-bold text-slate-700 uppercase">IMPORTANT STATUTORY DISCLAIMER:</div>
            <p>
              This document is generated by LandPulse AI as part of the Smart India Hackathon 2026 Prototype submission (Problem Statement ID: SIH26017). All delay probabilities, projected months, risk scores, and recommended actions are statistical decision-support estimates derived from demo historical datasets. They do not constitute official government sanction, nor are they legally binding upon the Special Land Acquisition Officer or District Magistrate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
