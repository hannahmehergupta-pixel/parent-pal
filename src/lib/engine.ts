import { PlanInput, PlanOutput, Recommendation } from '../types';

/**
 * Calculates monthly required investment using the standard SIP ordinary annuity formula
 * assuming an 8% annual blended return.
 */
export function monthlyRequired(targetAmount: number, years: number): number {
  if (years <= 0) return targetAmount;
  const annualRate = 0.08;
  const r = annualRate / 12; // monthly rate
  const n = Math.round(years * 12); // total months
  
  // ordinary annuity formula: PMT = FV * r / ((1 + r)^n - 1)
  const power = Math.pow(1 + r, n);
  const monthlySavings = (targetAmount * r) / (power - 1);
  return Math.max(1, Math.ceil(monthlySavings));
}

export function generatePlan(input: PlanInput): PlanOutput {
  const years = input.timelineYears;
  
  // Adjusted target amount based on compound inflation rate
  const rate = input.inflationRate / 100;
  const adjustedTargetAmount = Math.ceil(input.targetAmount * Math.pow(1 + rate, years));
  
  const monthly = monthlyRequired(adjustedTargetAmount, years);

  // 1. Allocation split by timeline
  let equityPct = 0;
  let safePct = 0;
  let hedgePct = 0;

  if (years > 10) {
    equityPct = 0.60;
    safePct = 0.25;
    hedgePct = 0.15;
  } else if (years >= 5) {
    equityPct = 0.50;
    safePct = 0.30;
    hedgePct = 0.20;
  } else {
    equityPct = 0.30;
    safePct = 0.40;
    hedgePct = 0.30;
  }

  // 2. Instrument selection based on Goal Type and timeline

  // Let's customize recommendation text and names briefly depending on the GoalType for higher quality!
  const isEducation = input.goalType === 'Education';
  const isMedical = input.goalType === 'Medical Buffer';
  
  // Equity Slot: equity-sip if >5yr, else index-sip
  let equityRec: Recommendation;
  if (years > 5) {
    equityRec = {
      emoji: isEducation ? "🎓" : isMedical ? "🏥" : "💼",
      name: isEducation ? "Education Focused Equity Mutual Fund" : isMedical ? "Healthcare Equity Mutual Fund" : "Business Capital Equity SIP",
      category: "Equity",
      returns: "12% Est. Return",
      lockIn: "None",
      why: `High-conviction diversified equity mutual fund customized for premium long-term compounding toward child's ${input.goalType.toLowerCase()} targets.`,
      monthlyAmount: Math.ceil(monthly * equityPct)
    };
  } else {
    equityRec = {
      emoji: "📊",
      name: "Index Mutual Fund SIP",
      category: "Equity",
      returns: "11% Est. Return",
      lockIn: "None",
      why: `Low-cost benchmark tracker reducing active management friction over shorter investment horizons toward child's ${input.goalType.toLowerCase()} milestones.`,
      monthlyAmount: Math.ceil(monthly * equityPct)
    };
  }

  // Safe Slot: ppf if >5yr, else rd
  let safeRec: Recommendation;
  if (years > 5) {
    safeRec = {
      emoji: "🛡️",
      name: "Public Provident Fund (PPF)",
      category: "Safe",
      returns: "7.1% Fixed Return",
      lockIn: "15 Years",
      why: "100% sovereign safe capital preservation with tax-exempt growth, providing a risk-free baseline cover.",
      monthlyAmount: Math.ceil(monthly * safePct)
    };
  } else {
    safeRec = {
      emoji: "🏦",
      name: "Bank Recurring Deposit (RD)",
      category: "Safe",
      returns: "6.5% Fixed Return",
      lockIn: "1 to 5 Years",
      why: "Sovereign-secured bank-guaranteed returns providing guaranteed payout certainty without stock market exposure.",
      monthlyAmount: Math.ceil(monthly * safePct)
    };
  }

  // Hedge Slot: sgb if timeline >8yr, else rd
  let hedgeRec: Recommendation;
  if (years > 8) {
    hedgeRec = {
      emoji: "🪙",
      name: "Sovereign Gold Bond (SGB)",
      category: "Hedge",
      returns: "8.0% Est. Return",
      lockIn: "8 Years",
      why: `Outstanding commodity fallback protection with 2.5% simple annual interest payouts plus premium domestic spot gold price hedge.`,
      monthlyAmount: Math.ceil(monthly * hedgePct)
    };
  } else {
    hedgeRec = {
      emoji: "🏦",
      name: "Bank Recurring Deposit (RD)",
      category: "Hedge",
      returns: "6.5% Fixed Return",
      lockIn: "1 to 5 Years",
      why: "Highly liquid savings buffer shielding capital against short-term market corrections and liquidity locks.",
      monthlyAmount: Math.ceil(monthly * hedgePct)
    };
  }

  const totalIncome = (input.motherIncome || 0) + (input.fatherIncome || 0);
  let motherShare = 0;
  let fatherShare = 0;
  if (totalIncome > 0) {
    motherShare = Math.round((monthly * (input.motherIncome || 0)) / totalIncome);
    fatherShare = monthly - motherShare;
  } else {
    motherShare = Math.round(monthly / 2);
    fatherShare = monthly - motherShare;
  }

  return {
    monthly,
    targetAmount: input.targetAmount,
    adjustedTargetAmount,
    targetYear: input.targetYear,
    timelineYears: years,
    goalType: input.goalType,
    inflationRate: input.inflationRate,
    motherIncome: input.motherIncome || 0,
    fatherIncome: input.fatherIncome || 0,
    motherShare,
    fatherShare,
    recommendations: [equityRec, safeRec, hedgeRec]
  };
}
