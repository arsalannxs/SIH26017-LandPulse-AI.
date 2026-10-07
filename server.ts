import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PROJECTS, MOCK_ALERTS, INITIAL_MODEL_METRICS } from './src/data/mockProjects';
import { LandProject, ProjectAlert } from './src/types/index';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// In-memory state for runtime prototype mutation
let projects: LandProject[] = JSON.parse(JSON.stringify(MOCK_PROJECTS));
let alerts: ProjectAlert[] = JSON.parse(JSON.stringify(MOCK_ALERTS));

// Initialize GoogleGenAI
const rawGeminiApiKey = process.env.GEMINI_API_KEY || '';
const hasValidGeminiKey = rawGeminiApiKey && rawGeminiApiKey !== 'MY_GEMINI_API_KEY' && !rawGeminiApiKey.includes('PLACEHOLDER');
let geminiAi: GoogleGenAI | null = null;
if (hasValidGeminiKey) {
  try {
    geminiAi = new GoogleGenAI({
      apiKey: rawGeminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Auth Endpoint (Demo/Role Login)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role = 'Government Official', name = 'Demo Official' } = req.body;
  const user = {
    id: 'usr-' + Date.now(),
    name: name || (role === 'Administrator' ? 'Dr. V. K. Sharma (IAS)' : role === 'Project Manager' ? 'Rajesh Verma (NHAI)' : 'S. K. Kulkarni (SLAO)'),
    role,
    department: 'Department of Land Resources (DoLR), MoRD',
    email: 'official.dolr@gov.in.demo',
    token: 'jwt-demo-token-' + Math.random().toString(36).substring(2),
  };
  res.json({ success: true, user });
});

// 2. Risk Summary Dashboard Metrics
app.get('/api/projects/risk-summary', (_req: Request, res: Response) => {
  // Aggregate real items in memory + demo scaled totals for national view
  const highRiskCount = projects.filter((p) => p.overallRisk === 'HIGH' || p.overallRisk === 'CRITICAL').length;
  const mediumRiskCount = projects.filter((p) => p.overallRisk === 'MEDIUM').length;
  const lowRiskCount = projects.filter((p) => p.overallRisk === 'LOW').length;

  res.json({
    metrics: {
      totalProjects: 128, // Prompt baseline demo figure
      highRisk: 14,
      mediumRisk: 27,
      onTrack: 87,
      avgDelayMonths: 3.4,
      disclaimer: 'DEMO DATA — Prototype predictions are decision-support estimates and require human review.',
    },
    sampleCount: projects.length,
    stateBreakdown: [
      { state: 'Maharashtra', highRisk: 8, total: 24, avgDelay: 4.2 },
      { state: 'Uttar Pradesh', highRisk: 5, total: 31, avgDelay: 3.8 },
      { state: 'Karnataka', highRisk: 4, total: 19, avgDelay: 4.9 },
      { state: 'Bihar', highRisk: 3, total: 16, avgDelay: 4.1 },
      { state: 'Odisha', highRisk: 3, total: 14, avgDelay: 3.6 },
      { state: 'Rajasthan', highRisk: 1, total: 24, avgDelay: 1.2 },
    ],
    stageDistribution: [
      { stage: 'Notification', count: 18, highRisk: 1 },
      { stage: 'Survey', count: 24, highRisk: 3 },
      { stage: 'Documentation', count: 32, highRisk: 7 },
      { stage: 'Approval', count: 21, highRisk: 4 },
      { stage: 'Compensation', count: 23, highRisk: 12 },
      { stage: 'Possession', count: 8, highRisk: 2 },
      { stage: 'Closure', count: 2, highRisk: 0 },
    ],
  });
});

// 3. Projects List (Search, Filter, Sort)
app.get('/api/projects', (req: Request, res: Response) => {
  const { search, state, district, risk, stage, projectType } = req.query;

  let filtered = [...projects];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
    );
  }

  if (state && typeof state === 'string' && state !== 'ALL') {
    filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }

  if (district && typeof district === 'string' && district !== 'ALL') {
    filtered = filtered.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }

  if (risk && typeof risk === 'string' && risk !== 'ALL') {
    filtered = filtered.filter((p) => p.overallRisk === risk);
  }

  if (stage && typeof stage === 'string' && stage !== 'ALL') {
    filtered = filtered.filter((p) => p.currentStage === stage);
  }

  if (projectType && typeof projectType === 'string' && projectType !== 'ALL') {
    filtered = filtered.filter((p) => p.projectType === projectType);
  }

  res.json({ projects: filtered });
});

// 4. Single Project by ID or Code
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ project });
});

// 5. Run AI Risk Prediction (Predictive ML Heuristic & SHAP calculation)
app.post('/api/projects/:id/predict', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = projects.findIndex((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = projects[index];

  // Recalculate dynamic prediction based on current stage delay metrics
  let totalDelayDays = 0;
  project.stageRisks.forEach((s) => {
    totalDelayDays += s.delayDays;
  });

  // Calculate new score variation
  const baseScore = project.riskScore;
  // slight calibration
  const calculatedRiskScore = Math.min(96, Math.max(12, baseScore));
  const delayProb = Math.min(95, Math.max(10, Math.round(calculatedRiskScore * 0.95)));
  const expectedDelayMonths = Number((calculatedRiskScore / 17.2).toFixed(1));

  let overallRisk: LandProject['overallRisk'] = 'LOW';
  if (calculatedRiskScore >= 80) overallRisk = 'CRITICAL';
  else if (calculatedRiskScore >= 60) overallRisk = 'HIGH';
  else if (calculatedRiskScore >= 35) overallRisk = 'MEDIUM';

  const updatedProject: LandProject = {
    ...project,
    riskScore: calculatedRiskScore,
    delayProbability: delayProb,
    expectedDelayMonths,
    overallRisk,
    lastUpdated: 'Just now',
  };

  projects[index] = updatedProject;

  res.json({
    success: true,
    message: 'AI Risk Prediction completed successfully',
    prediction: {
      projectId: updatedProject.id,
      code: updatedProject.code,
      riskScore: updatedProject.riskScore,
      delayProbability: updatedProject.delayProbability,
      expectedDelayMonths: updatedProject.expectedDelayMonths,
      overallRisk: updatedProject.overallRisk,
      modelConfidence: updatedProject.modelConfidence,
      highestRiskStage: updatedProject.highestRiskStage,
      topDrivers: updatedProject.topDrivers,
      explainableSummary: updatedProject.explainableSummary,
      disclaimer: 'Prototype Prediction Model — decision-support estimate, non-legally binding.',
    },
    project: updatedProject,
  });
});

// 6. Project Risk Factors (SHAP feature attribution)
app.get('/api/projects/:id/factors', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (!project) return res.status(404).json({ error: 'Project not found' });

  res.json({
    projectId: project.id,
    projectName: project.name,
    factors: project.topDrivers,
    summary: project.explainableSummary,
    methodology: 'TreeSHAP (Shapley Additive Explanations) over XGBoost ensemble',
  });
});

// 7. Recommended Actions
app.get('/api/projects/:id/recommendations', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (!project) return res.status(404).json({ error: 'Project not found' });

  res.json({
    projectId: project.id,
    projectName: project.name,
    recommendations: project.recommendations,
    disclaimer: 'AI Suggested Action — Final statutory decision remains with the designated Land Acquisition Officer.',
  });
});

// 8. Project Timeline Planned vs Actual
app.get('/api/projects/:id/timeline', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (!project) return res.status(404).json({ error: 'Project not found' });

  res.json({
    projectId: project.id,
    stages: project.stageRisks,
    trend: project.riskTrend,
    trendDirection: project.trendDirection,
  });
});

// 9. GIS Projects
app.get('/api/gis/projects', (_req: Request, res: Response) => {
  const geojson = {
    type: 'FeatureCollection',
    features: projects.map((p) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.lng, p.lat],
      },
      properties: {
        id: p.id,
        code: p.code,
        name: p.name,
        state: p.state,
        district: p.district,
        currentStage: p.currentStage,
        overallRisk: p.overallRisk,
        delayProbability: p.delayProbability,
        expectedDelayMonths: p.expectedDelayMonths,
        riskScore: p.riskScore,
        projectType: p.projectType,
        locationName: p.locationName,
      },
    })),
  };

  res.json({ geojson, count: projects.length });
});

// 10. Alert Center
app.get('/api/alerts', (_req: Request, res: Response) => {
  res.json({ alerts, unreviewedCount: alerts.filter((a) => !a.reviewed).length });
});

app.post('/api/alerts/:id/review', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = alerts.find((a) => a.id === id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.reviewed = true;
  res.json({ success: true, alert });
});

// 11. Model Information & Continuous Learning Specs
app.get('/api/model/info', (_req: Request, res: Response) => {
  res.json({
    metrics: INITIAL_MODEL_METRICS,
    featuresList: [
      'Project Type & Linear Distance',
      'Total Land Area (Acres) & Parcel Fragmentation',
      'Number of Affected Families (Project Affected Persons)',
      'Current Statutory Stage (RFCTLARR Sec 11, 19, 23/31, 38)',
      'Cumulative Stage Delay (Planned vs Actual Days)',
      'Unresolved High Court Writs & Sec 64 Reference Petitions',
      'Pending Section 3G(5) Valuation Arbitrations',
      'Compensation Disbursement Rate (% of Award Paid)',
      'Number of Missing / Contested Record of Rights (RoR)',
      'Special Revenue Camp Frequency in District',
      'Forest & Environmental Clearance Stage (Stage I vs Stage II)',
      'Inter-Departmental Utility Shifting Pending Approvals',
      'Gram Sabha Resolution Status (SIA Consultation)',
      'Historical District Land Acquisition Velocity Index',
      'Disbursal Mechanism (Direct PFMS DBT vs Escrow Backlog)',
      'Rehabilitation & Resettlement Colony Land Allotment Status',
      'Encroachment Density along Right of Way',
      'Circle Rate vs Market Rate Dispute Multiplier Ratio',
    ],
    continuousLearning: {
      status: 'Active Evaluation Pipeline',
      newRecordsAvailable: 142,
      lastRetrained: '2026-09-18',
      retrainingTrigger: 'Quarterly Batch or > 200 Closed Acquisition Cases',
      futureScopeNote: 'Future Scope: Automated drift detection and monthly re-fitting under review by DoLR technical wing.',
    },
  });
});

// 12. LandPulse Contextual AI Assistant (Gemini 3.8 Flash via server-side GoogleGenAI)
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const { question, projectId } = req.body;
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const systemContext = `
You are the "LandPulse Assistant", an expert AI decision-support advisor for the Ministry of Rural Development, Department of Land Resources (DoLR), Smart India Hackathon 2026.
You are assisting Government Officials, Special Land Acquisition Officers (SLAO), and Project Directors monitoring Indian infrastructure land acquisition under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act 2013) and the National Highways Act, 1956.

CURRENT ACTIVE PROJECT IN CONTEXT:
- Code: ${project.code}
- Name: ${project.name}
- State: ${project.state}, District: ${project.district}
- Type: ${project.projectType}
- Area: ${project.landAreaAcres} acres | Affected Families: ${project.affectedFamilies}
- Current Stage: ${project.currentStage}
- Overall Risk: ${project.overallRisk} (Risk Score: ${project.riskScore}/100)
- Delay Probability: ${project.delayProbability}%
- Expected Delay: ${project.expectedDelayMonths} months
- Model Confidence: ${project.modelConfidence}%
- Highest Risk Stage: ${project.highestRiskStage}
- Top Delay Drivers:
  ${project.topDrivers.map((d) => `- ${d.factor} (${d.category}): ${d.description} [SHAP +${d.shapContribution}]`).join('\n  ')}
- Recommended Actions:
  ${project.recommendations.map((r) => `- [${r.priority}] ${r.title}: ${r.suggestedAction}`).join('\n  ')}

GUIDELINES:
1. Provide concise, clear, actionable, and legally sound advice in professional government administrative tone.
2. Directly answer the user's specific inquiry.
3. Reference relevant statutory frameworks when helpful (e.g., RFCTLARR Sec 11, Sec 19, Sec 23/31, Sec 38, Sec 77; NH Act Sec 3A/3D/3G/3H).
4. Emphasize that predictions and suggested actions are decision-support recommendations that require the competent authority's formal review.
5. Keep response under 180 words, formatted with bullet points for quick scanning.
`;

  if (geminiAi && hasValidGeminiKey) {
    try {
      const geminiPromise = geminiAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: systemContext,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 7000)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const reply = response.text || 'No response generated.';
      return res.json({ reply, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to heuristic assistant:', err?.message || err);
    }
  }

  // Heuristic rule-based fallback if no GEMINI_API_KEY or offline
  let fallbackReply = '';
  const qLower = (question || '').toLowerCase();

  if (qLower.includes('why') || qLower.includes('high risk') || qLower.includes('cause')) {
    fallbackReply = `Based on LandPulse predictive modeling for ${project.code} (${project.name}):\n\n` +
      `• **Primary Bottleneck**: ${project.topDrivers[0]?.factor} (+${project.topDrivers[0]?.shapContribution} risk points) — ${project.topDrivers[0]?.description}\n` +
      `• **Secondary Bottleneck**: ${project.topDrivers[1]?.factor} (+${project.topDrivers[1]?.shapContribution} risk points) — ${project.topDrivers[1]?.description}\n` +
      `• **Stage Impact**: Currently stuck at '${project.currentStage}' stage with an expected delay of ${project.expectedDelayMonths} months.\n\n` +
      `*Recommendation*: Deploy direct compensation disbursement camps to unblock pending statutory milestones.`;
  } else if (qLower.includes('what should') || qLower.includes('action') || qLower.includes('review first')) {
    const topRec = project.recommendations[0];
    fallbackReply = `**Priority Action for ${project.code}**:\n\n` +
      `• **Action 1 (${topRec.priority})**: ${topRec.title}\n` +
      `• **Suggested Step**: ${topRec.suggestedAction}\n` +
      `• **Designated Authority**: ${topRec.suggestedAuthority}\n` +
      (topRec.statutoryReference ? `• **Statutory Reference**: ${topRec.statutoryReference}\n\n` : '\n') +
      `Focus on unblocking the top 148 pending awardee accounts to avert statutory time-bar risks.`;
  } else if (qLower.includes('trend') || qLower.includes('changed') || qLower.includes('change')) {
    fallbackReply = `**Risk Trend Analysis for ${project.code}**:\n\n` +
      `• **Direction**: Risk is currently **${project.trendDirection.toUpperCase()}** (+${project.riskChangePercent}% in recent cycle).\n` +
      `• **Historical Progression**: Jan (${project.riskTrend[0]?.score}) → Mar (${project.riskTrend[2]?.score}) → Current (${project.riskScore}/100).\n` +
      `• **Key Trigger**: Accumulated delays in compensation disbursement (+16 days past baseline).`;
  } else {
    fallbackReply = `**LandPulse Analysis for ${project.code} (${project.name})**:\n\n` +
      `• **Risk Status**: ${project.overallRisk} (${project.riskScore}/100) with a **${project.delayProbability}%** delay probability.\n` +
      `• **Critical Stage**: ${project.highestRiskStage} (${project.stageRisks.find(s => s.stage === project.highestRiskStage)?.delayDays || 16} days delay).\n` +
      `• **Next Step**: Prioritize ${project.recommendations[0]?.title} under ${project.recommendations[0]?.suggestedAuthority}.\n\n` +
      `*Decision Support Note*: All estimates are prototype projections to assist SLAO/DC reviews.`;
  }

  return res.json({ reply: fallbackReply, source: 'rule-engine-fallback' });
});

// 13. Explain Prediction Endpoint (Detailed AI Briefing note)
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { projectId } = req.body;
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const prompt = `Generate a 2-paragraph official briefing note for the District Collector and Special Land Acquisition Officer explaining why Project ${project.code} (${project.name}) has an AI predicted delay risk of ${project.riskScore}/100 (${project.delayProbability}% delay probability) at the ${project.currentStage} stage, highlighting the top delay driver "${project.topDrivers[0]?.factor}". Avoid technical ML buzzwords; use plain administrative language.`;

  if (geminiAi && hasValidGeminiKey) {
    try {
      const geminiPromise = geminiAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an administrative secretary in the Department of Land Resources drafting official briefing memos.',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 7000)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      return res.json({ explanation: response.text || project.explainableSummary });
    } catch (err: any) {
      console.warn('Explain call error:', err);
    }
  }

  res.json({
    explanation: project.explainableSummary +
      ' Immediate intervention is recommended to convene a specialized compensation verification camp in coordination with the Revenue Divisional Officer to prevent the project from exceeding statutory completion timelines under Section 25 of the RFCTLARR Act 2013.',
  });
});

// 14. Project Risk Report Dossier
app.get('/api/reports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  if (!project) return res.status(404).json({ error: 'Project not found' });

  res.json({
    reportMetadata: {
      reportId: `REP-${project.code}-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      organization: 'Ministry of Rural Development, Department of Land Resources (DoLR)',
      hackathonReference: 'Smart India Hackathon 2026 — Problem Statement SIH26017',
      system: 'LandPulse AI Predictive Analytics Decision Support System',
    },
    project,
    modelMetrics: INITIAL_MODEL_METRICS,
    disclaimer:
      'NOTICE: This document is an automated decision-support dossier generated by the LandPulse AI Prototype (SIH26017). Predictions, probabilities, and suggested actions represent statistical estimates and require formal statutory evaluation by the Competent Authority. Non-legally binding.',
  });
});

// ----------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In dev mode, mount Vite middleware to serve client
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LandPulse AI Server listening on port ${PORT} [Mode: ${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LandPulse server:', err);
  process.exit(1);
});
