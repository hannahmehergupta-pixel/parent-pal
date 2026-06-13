export interface PlanInput {
  childAge: number;
  targetAmount: number;
  targetYear: number;
  timelineYears: number;
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
  targetYear: number;
  timelineYears: number;
  recommendations: Recommendation[];
}
