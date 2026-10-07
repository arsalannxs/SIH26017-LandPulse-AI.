import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  FolderKanban, 
  Activity, 
  MapPin, 
  Bell, 
  FileText, 
  Bot, 
  Sparkles, 
  User, 
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile;
  onChangeUserRole: (role: UserProfile['role']) => void;
  unreviewedAlertsCount: number;
  onOpenAssistant: () => void;
  onRunDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onChangeUserRole,
  unreviewedAlertsCount,
  onOpenAssistant,
  onRunDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Ministry / SIH Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Department of Land Resources (DoLR)
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Rural Development, Govt. of India</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              SIH26017 Prototype
            </span>
            <span className="text-amber-400 font-medium text-[11px] hidden md:inline">
              DEMO DATA • Non-Binding Decision Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-800 transition-colors">
            LP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                LandPulse AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                v1.4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              Predict Delays. Act Early. Deliver Projects Faster.
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Prominent RUN SIH DEMO Button */}
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition-all active:scale-95"
            title="Start automated 6-step prototype walkthrough"
          >
            <PlayCircle className="w-4 h-4 text-blue-100" />
            <span>RUN SIH DEMO</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md border border-slate-200 transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentUser.role}
              onChange={(e) => onChangeUserRole(e.target.value as UserProfile['role'])}
              className="bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer"
              title="Switch demo user role"
            >
              <option value="Government Official">Govt Official</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="border-t border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1">
          <NavTab
            active={currentTab === 'dashboard'}
            onClick={() => setCurrentTab('dashboard')}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
          />
          <NavTab
            active={currentTab === 'projects'}
            onClick={() => setCurrentTab('projects')}
            icon={<FolderKanban className="w-4 h-4" />}
            label="Projects"
          />
          <NavTab
            active={currentTab === 'analysis'}
            onClick={() => setCurrentTab('analysis')}
            icon={<Activity className="w-4 h-4" />}
            label="Risk Analysis"
          />
          <NavTab
            active={currentTab === 'gis'}
            onClick={() => setCurrentTab('gis')}
            icon={<MapPin className="w-4 h-4" />}
            label="GIS Map"
          />
          <NavTab
            active={currentTab === 'alerts'}
            onClick={() => setCurrentTab('alerts')}
            icon={<Bell className="w-4 h-4" />}
            label="Alerts"
            badge={unreviewedAlertsCount > 0 ? unreviewedAlertsCount : undefined}
          />
          <NavTab
            active={currentTab === 'early-warning'}
            onClick={() => setCurrentTab('early-warning')}
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Early Warning"
          />
          <NavTab
            active={currentTab === 'model'}
            onClick={() => setCurrentTab('model')}
            icon={<Sparkles className="w-4 h-4" />}
            label="Model Insights"
          />
          <NavTab
            active={currentTab === 'reports'}
            onClick={() => setCurrentTab('reports')}
            icon={<FileText className="w-4 h-4" />}
            label="Reports"
          />
        </div>
      </nav>
    </header>
  );
};

interface NavTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavTab: React.FC<NavTabProps> = ({ active, onClick, icon, label, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80 font-semibold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
      }`}
    >
      <span className={active ? 'text-blue-700' : 'text-slate-500'}>{icon}</span>
      <span>{label}</span>
      {typeof badge === 'number' && (
        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-bold border border-red-200">
          {badge}
        </span>
      )}
    </button>
  );
};
