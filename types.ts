
export enum MaturityLevel {
  FOUNDATIONAL = 'Foundational',
  GROWTH_STAGE = 'Growth-stage',
  STRATEGIC = 'Strategic',
  MARKET_LEADER = 'Market leader'
}

export interface CategoryScore {
  name: string;
  score: number;
  insight: string;
  reasoning: string;
}

export interface AnalysisResult {
  overallScore: number;
  maturityLevel: MaturityLevel;
  industry: string; // AI now detects this
  categories: {
    hygiene: CategoryScore;
    relevance: CategoryScore;
    salesTool: CategoryScore;
    differentiation: CategoryScore;
    advancedStrategy: CategoryScore;
  };
  executiveSummary: string;
  strengths: string[];
  gaps: string[];
  priorityActions: string[];
  industryContext: {
    buyerPersonas: string;
    decisionMakers: string;
    salesCycle: string;
  };
  groundingSources?: { title: string; uri: string }[];
}

export interface UserInputs {
  websiteUrl: string;
}

export enum AppState {
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}
