import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { LandProject, RiskCategory } from '../types';

interface ProjectsTableProps {
  projects: LandProject[];
  onSelectProject: (id: string) => void;
  onRunPrediction: (id: string) => void;
  onOpenGisForProject: (id: string) => void;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onSelectProject,
  onRunPrediction,
  onOpenGisForProject,
}) => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'delay' | 'probability' | 'name'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract unique options
  const states = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.state))).sort();
  }, [projects]);

  const stages = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.currentStage))).sort();
  }, [projects]);

  const projectTypes = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.projectType))).sort();
  }, [projects]);

  // Filtering & Sorting
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          search === '' ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.district.toLowerCase().includes(search.toLowerCase()) ||
          p.state.toLowerCase().includes(search.toLowerCase());

        const matchesState = selectedState === 'ALL' || p.state === selectedState;
        const matchesRisk = selectedRisk === 'ALL' || p.overallRisk === selectedRisk;
        const matchesStage = selectedStage === 'ALL' || p.currentStage === selectedStage;
        const matchesType = selectedType === 'ALL' || p.projectType === selectedType;

        return matchesSearch && matchesState && matchesRisk && matchesStage && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'risk') {
          comparison = a.riskScore - b.riskScore;
        } else if (sortBy === 'probability') {
          comparison = a.delayProbability - b.delayProbability;
        } else if (sortBy === 'delay') {
          comparison = a.expectedDelayMonths - b.expectedDelayMonths;
        } else if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [projects, search, selectedState, selectedRisk, selectedStage, selectedType, sortBy, sortOrder]);

  const handleToggleSort = (field: 'risk' | 'delay' | 'probability' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRiskBadge = (risk: RiskCategory) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Infrastructure Land Acquisition Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time monitoring across states, districts, and statutory acquisition stages.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium self-start md:self-auto">
          Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> of {projects.length} projects
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project name, code (e.g. LA-MH-1024), district, state..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:bg-white"
            >
              <option value="ALL">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Risk Category</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:bg-white"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Current Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:bg-white"
            >
              <option value="ALL">All Stages</option>
              {stages.map((stg) => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:bg-white"
            >
              <option value="ALL">All Project Types</option>
              {projectTypes.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => handleToggleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Project & Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Stage</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => handleToggleSort('probability')}
                >
                  <div className="flex items-center gap-1">
                    <span>Delay Probability</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => handleToggleSort('risk')}
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => handleToggleSort('delay')}
                >
                  <div className="flex items-center gap-1">
                    <span>Expected Delay</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No matching projects found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectProject(project.id)}
                  >
                    {/* Project & Code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {project.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-slate-500">
                              {project.code}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500">
                              {project.projectType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* State / District */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{project.state}</div>
                      <div className="text-[11px] text-slate-500">{project.district}</div>
                    </td>

                    {/* Current Stage */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{project.currentStage}</div>
                      <div className="text-[10px] text-slate-400">
                        {project.progressPercent}% progress
                      </div>
                    </td>

                    {/* Delay Probability */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{project.delayProbability}%</span>
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              project.delayProbability >= 70 ? 'bg-red-500' :
                              project.delayProbability >= 40 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${project.delayProbability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getRiskBadge(project.overallRisk)}
                    </td>

                    {/* Expected Delay */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`font-semibold ${
                        project.expectedDelayMonths >= 4 ? 'text-red-700' :
                        project.expectedDelayMonths >= 2 ? 'text-amber-700' :
                        'text-emerald-700'
                      }`}>
                        {project.expectedDelayMonths} months
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        project.overallRisk === 'CRITICAL' || project.overallRisk === 'HIGH'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : project.overallRisk === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {project.overallRisk === 'CRITICAL' || project.overallRisk === 'HIGH'
                          ? 'At Risk'
                          : project.overallRisk === 'MEDIUM'
                          ? 'Watch'
                          : 'On Track'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onRunPrediction(project.id)}
                          title="Run AI Risk Prediction Heuristic"
                          className="p-1.5 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-700 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => onOpenGisForProject(project.id)}
                          title="Locate on GIS Map"
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectProject(project.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors"
                        >
                          <span>Analyze</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
