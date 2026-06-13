import React from 'react';
import { generatePlan } from '../lib/engine';
import { Card, Button } from './UI';
import { ArrowRight, ArrowLeft, ShieldCheck, Heart, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface ResultsPageProps {
  childAge: number;
  targetAmount: number;
  targetYear: number;
  onStartOver: () => void;
}

export default function ResultsPage({
  childAge,
  targetAmount,
  targetYear,
  onStartOver
}: ResultsPageProps) {
  const currentYear = new Date().getFullYear();
  const timelineYears = Math.max(1, targetYear - currentYear);

  // Call engine to generate strategic recommendations
  const plan = generatePlan({
    childAge,
    targetAmount,
    targetYear,
    timelineYears
  });

  // Human-friendly Indian Currency Formatter
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 text-stone-850">
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/60">
        <button
          id="results-back-btn"
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          Refine Input Params
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-primary-50 border border-primary-100 px-3.5 py-1 rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-pulse" />
          Strategic Wealth Recommendation
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="mb-10 text-center sm:text-left">
        <div className="p-8 sm:p-10 bg-primary-50/50 border border-primary-100/70 rounded-3xl shadow-sm relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 w-48 h-48 rounded-full bg-primary-100/30 blur-2xl pointer-events-none -z-10" />
          <div className="absolute left-1/3 top-0 -translate-y-6 w-32 h-32 rounded-full bg-primary-500/5 blur-xl pointer-events-none -z-10" />

          <span className="text-[10px] uppercase font-mono tracking-widest text-primary-700 font-bold bg-primary-100 px-3 py-1 rounded-full inline-block mb-4">
            Custom Blueprint Formulation
          </span>

          {/* Hero line requested precisely: "To have ₹[amount] by [year] ([N] years away), invest ₹[monthly] / month" */}
          <h2 id="results-hero-line" className="text-2xl sm:text-4xl font-extrabold font-display leading-tight text-stone-900 tracking-tight mb-4">
            To have <span className="text-primary-700">{formatINR(plan.targetAmount)}</span> by <span className="text-primary-700">{plan.targetYear}</span> ({plan.timelineYears} {plan.timelineYears === 1 ? 'year' : 'years'} away), invest <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">{formatINR(plan.monthly)}</span> / month
          </h2>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6 text-xs text-stone-500 font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-400">Child's Age:</span>
              <span className="text-stone-800 font-bold">{childAge} yrs old</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-400">Total Accumulation Horizon:</span>
              <span className="text-stone-800 font-bold">{plan.timelineYears} years</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-400">Target Year Goal:</span>
              <span className="text-stone-800 font-bold">Maturity {plan.targetYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold font-display text-stone-800">
          Smart Diversification Allocation Breakdown
        </h3>
      </div>

      {/* 3 InstrumentCards shown dynamically */}
      <div id="instrument-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plan.recommendations.map((inst, index) => (
          <div key={inst.name} className="h-full">
            <Card
              id={`instrument-card-${index}`}
              className="flex flex-col h-full bg-white border border-stone-205 shadow-sm rounded-3xl hover:border-primary-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
            {/* Visual Indicator of rank order */}
            <div className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-stone-400">
              0{index + 1}
            </div>

            <div className="p-6.5 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Emoji Representation & Category Badge */}
                <div className="flex items-center gap-2 mb-4 pt-1">
                  <span className="text-2xl" role="img" aria-label={inst.name}>
                    {inst.emoji}
                  </span>
                  <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md font-bold border ${
                    inst.category === 'Equity'
                      ? 'text-primary-700 bg-primary-50 border-primary-150'
                      : inst.category === 'Safe'
                      ? 'text-sky-700 bg-sky-50 border-sky-150'
                      : 'text-amber-700 bg-amber-50 border-amber-150'
                  }`}>
                    {inst.category} Segment
                  </span>
                </div>

                {/* Instrument title */}
                <h4 className="text-base font-bold text-stone-800 tracking-tight leading-snug mb-2 pr-6">
                  {inst.name}
                </h4>

                {/* Monthly Rupee Allocation display */}
                <div className="mb-4">
                  <p className="text-[10px] font-mono tracking-wider text-stone-400 font-bold uppercase">ALLOCATION</p>
                  <p className="text-lg font-mono font-extrabold text-stone-800 mt-0.5">
                    {formatINR(inst.monthlyAmount)} <span className="text-xs font-sans font-normal text-stone-500">/ month</span>
                  </p>
                </div>

                {/* Core descriptive text */}
                <p className="text-xs text-stone-500 leading-relaxed mb-6 font-medium">
                  {inst.why}
                </p>
              </div>

              {/* Technical features split by horizontal divider */}
              <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">PROJECTED YIELD</span>
                  <span className="font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100 font-mono text-[11px]">
                    {inst.returns}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">LOCK-IN PERIOD</span>
                  <span className="font-bold text-stone-700 bg-stone-50 px-2.5 py-0.5 rounded-full border border-stone-200 text-[11px]">
                    {inst.lockIn}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {/* Disclaimer Box */}
      <div id="statutory-disclaimers" className="p-5.5 bg-stone-50 border border-stone-200 rounded-2xl mb-12 flex items-start gap-3">
        <div className="p-1 rounded-lg bg-stone-200 shrink-0 text-stone-600 mt-0.5">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div className="text-[11px] leading-relaxed text-stone-500 font-sans">
          <p className="font-extrabold text-stone-800 mb-1">Interactive Advisor Disclosures</p>
          <p className="mb-1">
            * Market-linked returns are estimates, not guaranteed. Not financial advice.
          </p>
          Sovereign limits, maximum monthly investment ceilings (e.g. PPF caps of ₹1.5L per annum), and real dynamic mutual fund indices fluctuates year-over-year. Please consult a qualified registered investment counselor before locking away actual funds. All formula variables are calculated on continuous interval investment math at 8% compound yield estimates.
        </div>
      </div>

      {/* Reset CTA linking back to form */}
      <div className="flex justify-center pt-2">
        <Button
          id="action-plan-again"
          variant="primary"
          size="lg"
          onClick={onStartOver}
          className="group shadow-md font-display font-semibold transition-all duration-300 scale-102 hover:scale-105 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
        >
          Plan Again
          <ArrowRight className="w-5 h-5 ml-2 text-primary-100 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
