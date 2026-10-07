export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AcquisitionStage =
  | 'Notification'
  | 'Survey'
  | 'Documentation'
  | 'Approval'
  | 'Compensation'
  | 'Possession'
  | 'Closure';

export interface StageRiskItem {
  stage: AcquisitionStage;
  label: string;
  probability: number; // 0 to 100
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  plannedDays: number;
  actualDays: number;
  delayDays: number;
}

export interface RiskFactor {
  id: string;
  factor: string;
  category: 'Legal' | 'Financial' | 'Administrative' | 'Social' | 'Documentation';
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number; // percentage or impact score e.g. 82%
  shapContribution: number; // e.g. +24 risk points
  description: string;
}

export interface RecommendedAction {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  category: string;
  reason: string;
  suggestedAction: string;
  suggestedAuthority: string;
  statutoryReference?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface TimelineDataPoint {
  month: string;
  score: number;
  probability: number;
}

export interface ProjectAlert {
  id: string;
  projectId: string;
  projectName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  previousRisk: number;
  currentRisk: number;
  change: number; // e.g. +18
  reason: string;
  recommendedAction: string;
  date: string;
  reviewed: boolean;
}

export interface LandProject {
  id: string;
  code: string; // e.g. "LA-MH-1024"
  name: string;
  projectType: 'Highways' | 'Railways & DFC' | 'Metro Rail' | 'Industrial Corridor' | 'Renewable Energy' | 'Water Resources';
  state: string;
  district: string;
  landAreaAcres: number;
  affectedFamilies: number;
  currentStage: AcquisitionStage;
  startDate: string;
  expectedCompletion: string;
  progressPercent: number;
  
  // Predictive metrics
  overallRisk: RiskCategory;
  riskScore: number; // 0 to 100
  delayProbability: number; // 0 to 100
  expectedDelayMonths: number;
  modelConfidence: number; // e.g. 87%
  
  // Historical trend
  riskTrend: TimelineDataPoint[];
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  
  // Stage breakdown
  stageRisks: StageRiskItem[];
  highestRiskStage: AcquisitionStage;
  
  // Drivers & Actions
  topDrivers: RiskFactor[];
  explainableSummary: string;
  recommendations: RecommendedAction[];
  
  // GIS coordinates
  lat: number;
  lng: number;
  locationName: string;

  // Recent changes
  riskChangePercent: number;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Government Official' | 'Project Manager' | 'Administrator';
  department: string;
  email: string;
}

export interface ModelMetrics {
  status: 'Active' | 'Calibrating';
  lastUpdated: string;
  trainingRecords: number;
  featuresCount: number;
  confidenceAverage: number;
  algorithm: string;
  aucRoc: number;
  maeMonths: number;
}
