import React, { useState } from 'react';
import { 
  PlayCircle, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  MapPin, 
  Bell, 
  FileText,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { LandProject } from '../types';

interface SihDemoTourModalProps {
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectProject: (id: string) => void;
  onRunPrediction: (id: string) => void;
  onOpenReport: (id: string) => void;
  focusProjectId: string;
}

export const SihDemoTourModal: React.FC<SihDemoTourModalProps> = ({
  onClose,
  onNavigateToTab,
  onSelectProject,
  onRunPrediction,
  onOpenReport,
  focusProjectId,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'National Infrastructure Dashboard Overview',
      subtitle: 'Monitoring 128 projects under DoLR jurisdiction',
      actionLabel: 'Explore Dashboard & Metrics',
      onApply: () => {
        onNavigateToTab('dashboard');
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            The prototype tracks 128 active linear infrastructure corridors across 6 states.
            The dashboard immediately flags that <span className="font-bold text-red-600">14 projects (10.9%)</span> are in the High Risk tier and <span className="font-bold text-amber-600">27 projects</span> are on the Medium Risk watchlist.
          </p>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-600">
            Total Projects: 128 | High Risk: 14 | Medium Risk: 27 | On Track: 87
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Select Critical Project (Mumbai-Pune Corridor)',
      subtitle: 'Corridor LA-MH-1024 at Haveli & Shirur Taluks',
      actionLabel: 'Select Project LA-MH-1024',
      onApply: () => {
        onSelectProject(focusProjectId);
        onNavigateToTab('analysis');
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            We isolate the <strong>Mumbai-Pune Infrastructure Corridor</strong> (840 acres, 620 affected families). The statutory progress timeline immediately reveals that the project is stuck at the <strong>Compensation Award Disbursement</strong> stage.
          </p>
          <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-900 font-medium text-[11px]">
            Statutory Milestone: Sec 23/31 Award Disbursement is 16 days overdue beyond planned timeline.
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Execute AI Risk Prediction Heuristic',
      subtitle: 'Computing delay probability & timeline overrun',
      actionLabel: 'Run AI Prediction Engine',
      onApply: () => {
        onRunPrediction(focusProjectId);
        onNavigateToTab('analysis');
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            Executing the AI risk prediction calculates:
          </p>
          <ul className="list-disc list-inside space-y-1 font-semibold text-slate-800">
            <li>Risk Score: <span className="text-red-600">82 / 100</span> (HIGH Risk)</li>
            <li>Delay Probability: <span className="text-red-600">78%</span></li>
            <li>Estimated Delay: <span className="text-amber-600">4.8 months</span></li>
            <li>Model Confidence: <span className="text-blue-700">87%</span> (statistical fit)</li>
          </ul>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Explainable AI & Top Delay Drivers (SHAP)',
      subtitle: 'Understanding WHY the project is delayed',
      actionLabel: 'Review Root Drivers & Actions',
      onApply: () => {
        onNavigateToTab('analysis');
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            Rather than a black-box score, TreeSHAP isolates exact point attributions:
          </p>
          <div className="space-y-1 text-[11px]">
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span>1. Compensation pending for title holders</span>
              <span className="font-bold text-red-600">+24 risk points</span>
            </div>
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span>2. High Court interim stay petitions (Bombay HC)</span>
              <span className="font-bold text-red-600">+18 risk points</span>
            </div>
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span>3. Administrative approval delay</span>
              <span className="font-bold text-amber-600">+12 risk points</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Geospatial GIS Visualization',
      subtitle: 'Mapping regional risk clusters across India',
      actionLabel: 'Open Interactive GIS Map',
      onApply: () => {
        onNavigateToTab('gis');
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            The interactive Leaflet GIS map plots every project location using standardized color markers:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Red: Critical Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orange: High Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Yellow: Medium Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Green: On Track</span>
          </div>
        </div>
      ),
    },
    {
      step: 6,
      title: 'Proactive Alert & Formal Risk Report',
      subtitle: 'Review threshold spike and generate dossier',
      actionLabel: 'View Alert Center & Generate Dossier',
      onApply: () => {
        onNavigateToTab('alerts');
        onOpenReport(focusProjectId);
      },
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            The Alert Center logged a proactive notification:
          </p>
          <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-900 text-[11px]">
            🔴 <strong>LA-MH-1024</strong>: Risk increased from <strong>64% &rarr; 82% (+18%)</strong> due to overdue compensation verification cases.
          </div>
          <p>
            Click below to generate the formal, printable <strong>Project Risk Dossier</strong> formatted for District Collector review.
          </p>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    currentStepData.onApply();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      steps[prevStep - 1].onApply();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-200" />
            <div>
              <div className="font-bold text-sm">Smart India Hackathon 2026 — Prototype Tour</div>
              <div className="text-[11px] text-blue-200">SIH DEMO • SIMULATED DATA</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-blue-200 hover:text-white hover:bg-blue-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Step {currentStep} of {steps.length}
          </span>
          <div className="flex items-center gap-1">
            {steps.map((s) => (
              <span
                key={s.step}
                className={`w-2.5 h-2.5 rounded-full ${
                  s.step === currentStep
                    ? 'bg-blue-600'
                    : s.step < currentStep
                    ? 'bg-blue-300'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tour Step Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentStepData.subtitle}
            </p>
          </div>

          <div className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-200">
            {currentStepData.content}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>{currentStep === steps.length ? 'Finish & Open Dossier' : currentStepData.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
