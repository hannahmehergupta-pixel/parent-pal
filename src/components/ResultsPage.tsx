import React from 'react';
import { generatePlan } from '../lib/engine';
import { GoalType } from '../types';
import { Card, Button } from './UI';
import { Sparkles, Calendar, Award, ShieldAlert, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

interface ResultsPageProps {
  childAge: number;
  goalType: GoalType;
  targetAmount: number;
  timelineYears: number;
  onStartOver: () => void;
}

export default function ResultsPage({
  childAge,
  goalType,
  targetAmount,
  timelineYears,
  onStartOver
}: ResultsPageProps) {
  // Generate the plan using our specialized mathematical engine
  const plan = generatePlan({
    childAge,
    goalType,
    targetAmount,
    timelineYears
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top action header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          id="results-back-btn"
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          Refine Input Params
        </button>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full font-bold">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Optimal Blueprint Generated
        </span>
      </div>

      {/* Main Grid: Summary & Prominent Target Figure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        {/* Prominent Monthly Savings Display */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <Card id="monthly-savings-card" className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border-none p-8 flex flex-col justify-between h-full relative overflow-hidden rounded-3xl">
            {/* Background design elements */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary-600/15 blur-2xl pointer-events-none" />
            <div className="absolute left-1/2 top-4 w-48 h-48 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

            <div>
              <span className="text-xs font-mono tracking-widest text-blue-200 uppercase font-semibold">
                ESTIMATED MONTHLY SAVINGS
              </span>
              
              {/* Highlight target savings amount */}
              <div id="monthly-aggregate-savings" className="mt-4 mb-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white">
                  {formatCurrency(plan.monthlySavings)}
                </span>
                <span className="text-sm font-sans font-medium text-blue-300 ml-1">
                  / month
                </span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                Derived using a conservative 8% annual compound interest formula, assuming savings are built at the end of each month.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-mono">TARGET TIMELINE</p>
                <p className="text-xs font-bold text-white">{timelineYears} Years ({timelineYears * 12} periods)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Goal Summary Description */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-800 mb-4">
              Your Personalized Plan
            </h2>
            <p id="plan-goal-summary-text" className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-semibold">
              {plan.goalSummary}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-[10px] text-slate-400 font-mono">CHILD CURRENT AGE</p>
                <p className="text-sm font-bold text-slate-800">{childAge} years old</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-mono">GOAL STATED</p>
                <p className="text-sm font-bold text-slate-800">{goalType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruments Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-primary-600 animate-pulse" />
        <h3 className="text-lg font-bold font-display text-slate-800">
          Smart Allocation & Instrument Recommendations
        </h3>
      </div>

      {/* 3 Instrument cards */}
      <div id="allocation-instruments-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plan.recommendations.map((inst, index) => (
          <div key={inst.id} className="h-full">
            <Card
              id={`recommendation-card-${inst.id}`}
              className="flex flex-col relative h-full bg-white border border-slate-200 hover:border-primary-200 shadow-sm rounded-3xl transition-all duration-350"
            >
            {/* Index Badge */}
            <div className="absolute top-5 right-5 flex items-center justify-center w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-400">
              {index + 1}
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Return rate circular/oval tag */}
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full mb-5">
                  {inst.returnRate}% {inst.isEstimated ? 'Est.' : 'Fixed'} Return
                  {inst.isEstimated && <span className="text-[9px] text-primary-500 font-bold">*</span>}
                </span>

                <h4 className="text-lg font-bold text-slate-800 leading-snug pr-6 mb-3">
                  {inst.name}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {inst.why}
                </p>
              </div>

              {/* Lockin description */}
              <div className="mt-4 pt-4 border-t border-slate-150 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 uppercase font-mono font-semibold tracking-wider">Lock-in period:</span>
                <span className="font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  {inst.lockIn}
                </span>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {/* Statutory Disclaimer box */}
      <div id="statutory-disclaimer-container" className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl mb-12 flex gap-3 text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed font-sans text-amber-700">
          <strong className="font-semibold text-amber-900 block mb-1">Important Legal Notice & Terms</strong>
          All estimates are calculated on uniform 8% compound math projections. True market options, PPF ratios, SGB rates, or SSY government interests change periodically. Recommended funds are subject to sovereign limits, underlying indexes, or capital risk rules. Perform self-due diligence or consult a registered financial counselor before initiating real monetary transactions.
        </div>
      </div>

      {/* Action button bar */}
      <div className="flex justify-center pt-2">
        <Button
          id="action-start-over-btn"
          variant="primary"
          size="lg"
          onClick={onStartOver}
          className="group shadow-md font-display font-bold transition-all duration-300 scale-102 hover:scale-105 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
        >
          <RefreshCw className="w-4 h-4 text-blue-200 group-hover:rotate-180 transition-transform duration-500" />
          Create New Plan
        </Button>
      </div>
    </div>
  );
}
