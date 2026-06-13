export type GoalType = 'Education' | 'Medical Buffer' | 'Milestone';

export interface PlanInput {
  childAge: number;
  goalType: GoalType;
  targetAmount: number;
  timelineYears: number;
}

export interface Instrument {
  id: string;
  name: string;
  returnRate: number; // e.g. 12 for 12%
  lockIn: string; // e.g. "None", "15 Years"
  why: string;
  isEstimated?: boolean;
}

export interface PlanOutput {
  monthlySavings: number;
  goalSummary: string;
  recommendations: Instrument[];
}
