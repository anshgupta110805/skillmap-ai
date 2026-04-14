export interface UserProfile {
  id: string;
  name: string;
  currentRole: string;
  targetRole?: string;
  skills: Skill[];
  location: string;
  targetCities?: string[];
  timelineMonths?: number;
  gravityScore: number;
}

export type Momentum = 'Rising' | 'Neutral' | 'Decaying';

export interface Skill {
  id: string;
  name: string;
  category: string;
  strength: number; // 0-100
  momentum?: Momentum;
  demandScore?: number;
  salaryImpact?: number;
}

export interface CareerPath {
  id: string;
  type: 'Safe' | 'Accelerated' | 'Bold';
  timeToTransitionMonths: number;
  salaryDeltaPct: number;
  riskScore: number; // 0-100
  missingSkills: string[];
}

export interface MigrationResult {
  currentCity: string;
  targetCity: string;
  role: string;
  salaryAdjustmentPct: number;
  costOfLivingDeltaPct: number;
  topHiringCompanies: string[];
  demandScore: number;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  matchPct: number;
  isLaunchWindow: boolean;
  location: string;
}

export interface WeeklyPlan {
  week: number;
  topic: string;
  resources: {
    type: 'course' | 'project' | 'certification';
    title: string;
    link: string;
  }[];
  completed: boolean;
}

export interface CityData {
  city: string;
  role: string;
  demandScore: number;
  topCompanies: string[];
  avgSalaryMin: number;
  avgSalaryMax: number;
  skillGaps: string[];
}

export interface RiskFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
