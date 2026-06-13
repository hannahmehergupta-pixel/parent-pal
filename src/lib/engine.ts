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
  const monthly = monthlyRequired(input.targetAmount, years);

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

  // 2. Instrument selection by timeline

  // Equity Slot: equity-sip if >5yr, else index-sip
  let equityRec: Recommendation;
  if (years > 5) {
    equityRec = {
      emoji: "📈",
      name: "Equity Mutual Fund SIP",
      category: "Equity",
      returns: "12% Est. Return",
      lockIn: "None",
      why: "High growth potential targeting premium diversified equity shares over long-term compounding cycles.",
      monthlyAmount: Math.ceil(monthly * equityPct)
    };
  } else {
    equityRec = {
      emoji: "📊",
      name: "Index Mutual Fund SIP",
      category: "Equity",
      returns: "11% Est. Return",
      lockIn: "None",
      why: "Low-cost passive option shadowing benchmark indices, reducing active fund manager risks in shorter horizons.",
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
      why: "100% sovereign-guaranteed and completely tax-exempt growth, proving a solid anchor for multi-year milestones.",
      monthlyAmount: Math.ceil(monthly * safePct)
    };
  } else {
    safeRec = {
      emoji: "🏦",
      name: "Bank Recurring Deposit (RD)",
      category: "Safe",
      returns: "6.5% Fixed Return",
      lockIn: "1 to 5 Years",
      why: "Sovereign-grade bank stability securing structured monthly interest outputs without index exposures.",
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
      why: "Provides an outstanding hedge buffer with 2.5% guaranteed annually plus historical gold appreciation.",
      monthlyAmount: Math.ceil(monthly * hedgePct)
    };
  } else {
    hedgeRec = {
      emoji: "🏦",
      name: "Bank Recurring Deposit (RD)",
      category: "Hedge",
      returns: "6.5% Fixed Return",
      lockIn: "1 to 5 Years",
      why: "Low-risk reserve deposit buffer safe routing hedge slots away from mid-term liquidity locks.",
      monthlyAmount: Math.ceil(monthly * hedgePct)
    };
  }

  return {
    monthly,
    targetAmount: input.targetAmount,
    targetYear: input.targetYear,
    timelineYears: years,
    recommendations: [equityRec, safeRec, hedgeRec]
  };
}
