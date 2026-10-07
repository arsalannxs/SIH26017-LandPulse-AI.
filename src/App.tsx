import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { ProjectsTable } from './components/ProjectsTable';
import { ProjectDetailView } from './components/ProjectDetailView';
import { GisMapView } from './components/GisMapView';
import { AlertCenterView } from './components/AlertCenterView';
import { EarlyWarningView } from './components/EarlyWarningView';
import { ModelInsightsView } from './components/ModelInsightsView';
import { ReportModal } from './components/ReportModal';
import { AssistantModal } from './components/AssistantModal';
import { SihDemoTourModal } from './components/SihDemoTourModal';
import { api } from './services/api';
import { LandProject, ProjectAlert, UserProfile, ModelMetrics } from './types';
import { MOCK_PROJECTS, MOCK_ALERTS, INITIAL_MODEL_METRICS } from './data/mockProjects';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [projects, setProjects] = useState<LandProject[]>(MOCK_PROJECTS);
  const [alerts, setAlerts] = useState<ProjectAlert[]>(MOCK_ALERTS);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>(INITIAL_MODEL_METRICS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('la-mh-1024');
  
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-default',
    name: 'S. K. Kulkarni',
    role: 'Government Official',
    department: 'Department of Land Resources (DoLR)',
    email: 'kulkarni.slao@gov.in.demo',
  });

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  // Fetch initial data from server
  useEffect(() => {
    async function loadData() {
      try {
        const [projData, alertData, modelData] = await Promise.all([
          api.getProjects(),
          api.getAlerts(),
          api.getModelInfo(),
        ]);
        if (projData && projData.length > 0) setProjects(projData);
        if (alertData?.alerts) setAlerts(alertData.alerts);
        if (modelData?.metrics) setModelMetrics(modelData.metrics);
      } catch (err) {
        console.warn('Backend loading error, continuing with cached prototype data:', err);
      }
    }
    loadData();
  }, []);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentTab('analysis');
  };

  const handleOpenGisForProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentTab('gis');
  };

  const handleRunPrediction = async (id: string) => {
    setIsPredicting(true);
    try {
      const res = await api.runPrediction(id);
      if (res.project) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? res.project : p))
        );
      }
    } catch (err) {
      console.warn('Prediction run error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReviewAlert = async (id: string) => {
    try {
      await api.reviewAlert(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, reviewed: true } : a))
      );
    } catch (err) {
      console.warn('Review alert error:', err);
    }
  };

  const handleChangeRole = (role: UserProfile['role']) => {
    let name = 'S. K. Kulkarni (SLAO)';
    if (role === 'Project Manager') name = 'Rajesh Verma (NHAI PIU)';
    if (role === 'Administrator') name = 'Dr. V. K. Sharma (IAS, Joint Secy)';

    setCurrentUser({
      ...currentUser,
      role,
      name,
    });
  };

  const handleOpenReport = (id: string) => {
    setSelectedProjectId(id);
    setIsReportModalOpen(true);
  };

  const handleOpenAssistant = (id?: string) => {
    if (id) setSelectedProjectId(id);
    setIsAssistantOpen(true);
  };

  const unreviewedAlertsCount = alerts.filter((a) => !a.reviewed).length;

  // If on landing page, show LandingView
  if (currentTab === 'landing') {
    return (
      <LandingView
        onEnterApp={() => setCurrentTab('dashboard')}
        onRunDemo={() => {
          setCurrentTab('dashboard');
          setIsTourModalOpen(true);
        }}
        onSelectRole={handleChangeRole}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Global Government Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onChangeUserRole={handleChangeRole}
        unreviewedAlertsCount={unreviewedAlertsCount}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onRunDemo={() => setIsTourModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            alerts={alerts}
            onSelectProject={handleSelectProject}
            onNavigateToTab={setCurrentTab}
            onRunPrediction={handleRunPrediction}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsTable
            projects={projects}
            onSelectProject={handleSelectProject}
            onRunPrediction={handleRunPrediction}
            onOpenGisForProject={handleOpenGisForProject}
          />
        )}

        {currentTab === 'analysis' && activeProject && (
          <ProjectDetailView
            project={activeProject}
            projectsList={projects}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onBack={() => setCurrentTab('projects')}
            onRunPrediction={handleRunPrediction}
            onOpenGis={handleOpenGisForProject}
            onOpenAssistant={handleOpenAssistant}
            onOpenReport={handleOpenReport}
            isPredicting={isPredicting}
          />
        )}

        {currentTab === 'gis' && (
          <GisMapView
            projects={projects}
            onSelectProject={handleSelectProject}
            selectedProjectId={selectedProjectId}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertCenterView
            alerts={alerts}
            onReviewAlert={handleReviewAlert}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentTab === 'early-warning' && (
          <EarlyWarningView
            projects={projects}
            onSelectProject={handleSelectProject}
            onOpenReport={handleOpenReport}
          />
        )}

        {currentTab === 'model' && (
          <ModelInsightsView metrics={modelMetrics} />
        )}

        {currentTab === 'reports' && activeProject && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Project Risk Report Generator</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate official statutory dossiers formatted for District Collector review.
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
              >
                Open Full Printable Dossier ({activeProject.code})
              </button>
            </div>

            <ProjectDetailView
              project={activeProject}
              projectsList={projects}
              onSelectProject={(id) => setSelectedProjectId(id)}
              onBack={() => setCurrentTab('projects')}
              onRunPrediction={handleRunPrediction}
              onOpenGis={handleOpenGisForProject}
              onOpenAssistant={handleOpenAssistant}
              onOpenReport={handleOpenReport}
              isPredicting={isPredicting}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      {isReportModalOpen && activeProject && (
        <ReportModal
          project={activeProject}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {isAssistantOpen && activeProject && (
        <AssistantModal
          project={activeProject}
          projectsList={projects}
          onClose={() => setIsAssistantOpen(false)}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {isTourModalOpen && (
        <SihDemoTourModal
          onClose={() => setIsTourModalOpen(false)}
          onNavigateToTab={setCurrentTab}
          onSelectProject={setSelectedProjectId}
          onRunPrediction={handleRunPrediction}
          onOpenReport={handleOpenReport}
          focusProjectId="la-mh-1024"
        />
      )}

      {/* Statutory Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800">LandPulse AI</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (SIH26017)</span>
            <span>•</span>
            <span>Department of Land Resources (DoLR), MoRD</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            DEMO DATA & PROTOTYPE PREDICTION MODEL • Decision-support estimates only (Non-legally binding).
          </div>
        </div>
      </footer>
    </div>
  );
}
