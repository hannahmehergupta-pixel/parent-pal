export type GoalType = 'Education' | 'Medical Buffer' | 'Future Business';

export interface PlanInput {
  childAge: number;
  targetAmount: number;
  targetYear: number;
  timelineYears: number;
  goalType: GoalType;
  inflationRate: number; // yearly percentage, e.g. 6%
  motherIncome: number;
  fatherIncome: number;
}

export interface Recommendation {
  emoji: string;
  name: string;
  category: "Equity" | "Safe" | "Hedge";
  returns: string;
  lockIn: string;
  why: string;
  monthlyAmount: number;
}

export interface PlanOutput {
  monthly: number;
  targetAmount: number;
  adjustedTargetAmount: number;
  targetYear: number;
  timelineYears: number;
  goalType: GoalType;
  inflationRate: number;
  motherIncome: number;
  fatherIncome: number;
  motherShare: number;
  fatherShare: number;
  recommendations: Recommendation[];
}
