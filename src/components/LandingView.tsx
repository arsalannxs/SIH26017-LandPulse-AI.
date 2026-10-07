import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  PlayCircle, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck2, 
  AlertCircle, 
  Layers, 
  Cpu, 
  MapPin, 
  Clock, 
  Scale, 
  Users 
} from 'lucide-react';
import { UserProfile } from '../types';

interface LandingViewProps {
  onEnterApp: () => void;
  onRunDemo: () => void;
  onSelectRole: (role: UserProfile['role']) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onRunDemo,
  onSelectRole,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              LP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">LandPulse AI</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold">
                  SIH 2026 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Department of Land Resources (DoLR) • Ministry of Rural Development
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRunDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Run Demo</span>
            </button>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Smart Automation Theme • Problem Statement ID: SIH26017
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Predict Land Acquisition Delays <br className="hidden sm:inline" />
            <span className="text-blue-700">Before They Impact Your Project.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            AI-powered decision support for proactive land acquisition monitoring. Identify bottlenecks, quantify delay probabilities, and take corrective action early.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow flex items-center gap-2"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRunDemo}
              className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-2xs transition-all flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-blue-600" />
              <span>Run Guided SIH Demo</span>
            </button>
          </div>
        </div>

        {/* 4-Step Workflow Visual */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Decision Support Lifecycle
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              From Reactive Monitoring to Predictive Action
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <StepCard
              step="1"
              title="Project Data"
              description="Ingest statutory milestones, survey boundaries, compensation records, and legal petitions."
              icon={<Layers className="w-5 h-5 text-blue-600" />}
            />
            <StepCard
              step="2"
              title="AI Prediction"
              description="Model estimates stage-specific delay probability, overall risk score, and expected delay in months."
              icon={<Cpu className="w-5 h-5 text-indigo-600" />}
            />
            <StepCard
              step="3"
              title="Risk Explanation"
              description="Explainable AI (TreeSHAP) isolates root drivers: compensation backlog, court stay, or clearance lapse."
              icon={<Scale className="w-5 h-5 text-amber-600" />}
            />
            <StepCard
              step="4"
              title="Early Action"
              description="Dispatch targeted administrative interventions (camps, arbitrator notifications, fast-track NOCs)."
              icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            />
          </div>
        </div>

        {/* Demo Login / Role Selector */}
        <div className="bg-slate-100/80 rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto w-full">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Quick Prototype Access (Select Role)
            </h3>
            <p className="text-xs text-slate-500">
              No real credentials required. Select your test persona to evaluate role-tailored views.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSelectRole('Government Official');
                onEnterApp();
              }}
              className="p-3.5 bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Government Official
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                  SLAO / Collector
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Review statutory risks, compensation bottlenecks & early warning radar.
              </p>
            </button>

            <button
              onClick={() => {
                onSelectRole('Project Manager');
                onEnterApp();
              }}
              className="p-3.5 bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Project Manager
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">
                  NHAI / DFC / Metro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Track linear handover progress, contractor access & scheduled milestones.
              </p>
            </button>

            <button
              onClick={() => {
                onSelectRole('Administrator');
                onEnterApp();
              }}
              className="p-3.5 bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Administrator
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                  DoLR / MoRD HQ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                National cross-state analytics, model training metrics & policy insights.
              </p>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">LandPulse AI</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 Prototype</span>
            <span>•</span>
            <span className="text-blue-700">Problem ID: SIH26017</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            SIMULATED DATA • Decision-support estimates only. Predictions are non-legally binding.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, description, icon }) => {
  return (
    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 font-mono">0{step}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
};
