import { PlanInput, PlanOutput, Instrument, GoalType } from '../types';

function getSeededRandom(seedStr: string): () => number {
  // Simple deterministic Fowler-Noll-Vo hash algorithm for strings
  let hval = 0x811c9dc5;
  for (let i = 0, l = seedStr.length; i < l; i++) {
    hval ^= seedStr.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  let hash = hval >>> 0;
  
  // LCG step
  return () => {
    hash = (hash * 1664525 + 1013904223) % 4294967296;
    return hash / 4294967296;
  };
}

export function monthlyRequired(targetAmount: number, years: number): number {
  if (years <= 0) return targetAmount;
  const annualRate = 0.08;
  const r = annualRate / 12; // monthly rate
  const n = Math.round(years * 12); // total months
  
  // PMT = FV * r / ((1 + r)^n - 1)
  const power = Math.pow(1 + r, n);
  const monthlySavings = (targetAmount * r) / (power - 1);
  return Math.max(1, Math.round(monthlySavings));
}

export function getRecommendations(seedStr: string): Instrument[] {
  const instruments: Instrument[] = [
    {
      id: 'ssy',
      name: 'Sukanya Samriddhi Yojana (SSY)',
      returnRate: 8.2,
      lockIn: 'Till age 21',
      why: 'Sovereign-backed tax-free secure scheme offering guaranteed high interest rates for a girl child.',
      isEstimated: false
    },
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      returnRate: 7.1,
      lockIn: '15 Years',
      why: '100% credit-risk-free government savings scheme with tax-exempt growth and maturity.',
      isEstimated: false
    },
    {
      id: 'equity_sip',
      name: 'Equity Mutual Fund SIP',
      returnRate: 12.0,
      lockIn: 'None',
      why: 'Compounding power of premium equity mutual funds designed for long-term visual growth.',
      isEstimated: true
    },
    {
      id: 'sgb',
      name: 'Sovereign Gold Bond (SGB)',
      returnRate: 8.0,
      lockIn: '8 Years',
      why: 'Combines underlying physical gold appreciation with a guaranteed 2.5% fixed annual coupon back.',
      isEstimated: true
    },
    {
      id: 'rd',
      name: 'Bank Recurring Deposit (RD)',
      returnRate: 6.5,
      lockIn: '1 to 5 Years',
      why: 'Rock-solid safety of bank-contracted earnings, perfect for near-term milestones.',
      isEstimated: false
    },
    {
      id: 'index_sip',
      name: 'Index Mutual Fund SIP',
      returnRate: 11.0,
      lockIn: 'None',
      why: 'Low-expense passive index investment covering blue-chip benchmark indices.',
      isEstimated: true
    }
  ];

  const rand = getSeededRandom(seedStr);
  const shuffled = [...instruments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

function getGoalText(goalType: GoalType): string {
  switch (goalType) {
    case 'Education':
      return 'higher education and college goals';
    case 'Medical Buffer':
      return 'emergency medical safeguards';
    case 'Milestone':
      return 'major milestone celebrations';
    default:
      return 'lifetime financial security';
  }
}

export function generatePlan(input: PlanInput): PlanOutput {
  const seed = `${input.childAge}-${input.goalType}-${input.targetAmount}-${input.timelineYears}`;
  const monthlySavings = monthlyRequired(input.targetAmount, input.timelineYears);
  const recommendations = getRecommendations(seed);
  
  const textGoal = getGoalText(input.goalType);
  const formattedAmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(input.targetAmount);

  const futureAge = input.childAge + input.timelineYears;

  const goalSummary = `To build a corpus of ${formattedAmt} for your child's ${textGoal} within the next ${input.timelineYears} ${input.timelineYears === 1 ? 'year' : 'years'} (by the time they reach age ${futureAge}), here is your custom investment blueprint.`;

  return {
    monthlySavings,
    goalSummary,
    recommendations
  };
}
