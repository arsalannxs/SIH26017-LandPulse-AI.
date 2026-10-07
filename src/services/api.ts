import { LandProject, ProjectAlert, ModelMetrics, UserProfile } from '../types';

export interface RiskSummaryResponse {
  metrics: {
    totalProjects: number;
    highRisk: number;
    mediumRisk: number;
    onTrack: number;
    avgDelayMonths: number;
    disclaimer: string;
  };
  sampleCount: number;
  stateBreakdown: { state: string; highRisk: number; total: number; avgDelay: number }[];
  stageDistribution: { stage: string; count: number; highRisk: number }[];
}

export const api = {
  async getRiskSummary(): Promise<RiskSummaryResponse> {
    const res = await fetch('/api/projects/risk-summary');
    if (!res.ok) throw new Error('Failed to fetch risk summary');
    return res.json();
  },

  async getProjects(params?: {
    search?: string;
    state?: string;
    district?: string;
    risk?: string;
    stage?: string;
    projectType?: string;
  }): Promise<LandProject[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.state && params.state !== 'ALL') query.append('state', params.state);
    if (params?.district && params.district !== 'ALL') query.append('district', params.district);
    if (params?.risk && params.risk !== 'ALL') query.append('risk', params.risk);
    if (params?.stage && params.stage !== 'ALL') query.append('stage', params.stage);
    if (params?.projectType && params.projectType !== 'ALL') query.append('projectType', params.projectType);

    const res = await fetch(`/api/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.projects;
  },

  async getProject(id: string): Promise<LandProject> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project details');
    const data = await res.json();
    return data.project;
  },

  async runPrediction(id: string): Promise<{ success: boolean; project: LandProject; prediction: any }> {
    const res = await fetch(`/api/projects/${id}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to run AI prediction');
    return res.json();
  },

  async getAlerts(): Promise<{ alerts: ProjectAlert[]; unreviewedCount: number }> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async reviewAlert(id: string): Promise<void> {
    await fetch(`/api/alerts/${id}/review`, { method: 'POST' });
  },

  async getModelInfo(): Promise<{ metrics: ModelMetrics; featuresList: string[]; continuousLearning: any }> {
    const res = await fetch('/api/model/info');
    if (!res.ok) throw new Error('Failed to fetch model info');
    return res.json();
  },

  async askAssistant(question: string, projectId: string): Promise<{ reply: string; source: string }> {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, projectId }),
    });
    if (!res.ok) throw new Error('Failed to get assistant response');
    return res.json();
  },

  async explainPrediction(projectId: string): Promise<{ explanation: string }> {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
    if (!res.ok) throw new Error('Failed to generate briefing');
    return res.json();
  },

  async getReport(projectId: string): Promise<any> {
    const res = await fetch(`/api/reports/${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  async login(role: string, name?: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, name }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    return data.user;
  },
};
