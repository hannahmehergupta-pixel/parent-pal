import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Slider, Select, Progress } from './UI';
import { GoalType } from '../types';
import { ArrowLeft, ArrowRight, Stars, Sparkles, Landmark, Coins, GraduationCap, ShieldAlert, Briefcase, Percent } from 'lucide-react';

interface PlanFormProps {
  onSubmit: (data: {
    childAge: number;
    targetAmount: number;
    targetYear: number;
    goalType: GoalType;
    inflationRate: number;
    motherIncome: number;
    fatherIncome: number;
  }) => void;
  onBackToHome: () => void;
}

export default function PlanForm({ onSubmit, onBackToHome }: PlanFormProps) {
  const currentYear = new Date().getFullYear();

  // Step state representing the 6 focused slides
  const [step, setStep] = useState(1);
  
  // Step 1: Child's age
  const [childAge, setChildAge] = useState(5); 

  // Step 2: Goal selection
  const [goalType, setGoalType] = useState<GoalType>('Education');

  // Step 3: Target amount
  const [targetAmount, setTargetAmount] = useState(1000000); 

  // Step 4: Timeline year
  const [targetYear, setTargetYear] = useState(currentYear + 13);

  // Step 5: Inflation rate slider
  const [inflationRate, setInflationRate] = useState(6); // default to 6% per annum (standard in India)

  // Step 6: Parents' monthly income
  const [motherIncome, setMotherIncome] = useState(80000);
  const [fatherIncome, setFatherIncome] = useState(120000);

  // Compute dynamic dropdown range for Step 4: from (currentYear + 1) to (currentYear + (21 - childAge))
  const minYear = currentYear + 1;
  const maxYear = Math.max(currentYear + 1, currentYear + (21 - childAge));

  const yearsOptions: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    yearsOptions.push(y);
  }

  // Ensure target year stays in bounds if child's age gets changed midway
  const activeYear = targetYear > maxYear || targetYear < minYear ? maxYear : targetYear;
  const timelineYears = activeYear - currentYear;

  // Real-time calculation of future inflation-adjusted target amount
  const adjustedTargetAmount = Math.ceil(targetAmount * Math.pow(1 + inflationRate / 100, timelineYears));

  const handleNext = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      if (targetAmount >= 50000) {
        onSubmit({
          childAge,
          targetAmount,
          targetYear: activeYear,
          goalType,
          inflationRate,
          motherIncome,
          fatherIncome
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onBackToHome();
    }
  };

  // Indian Currency Formatter Helper
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const presets = [100000, 500000, 1000000, 2500000, 5000000];
  const progressPercentage = (step / 6) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-10 md:py-16 text-stone-850">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="step-navigation-back"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          {step === 1 ? 'Home' : `Go to Step ${step - 1}`}
        </button>
        <span className="text-xs text-stone-450 font-mono tracking-wider font-semibold">
          STEP {step} OF 6
        </span>
      </div>

      {/* Progress timeline bar */}
      <Progress id="planning-wizard-progress" value={progressPercentage} className="mb-10 text-primary-600" />

      <div className="min-h-[440px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-age"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Select child's current age
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                Compound growth schedules scale dynamically based on the age of your children, culminating when they achieve adulthood (maturity age 21).
              </p>

              <Card className="p-8 sm:p-10 bg-stone-50/70 border border-stone-200">
                <div className="flex flex-col items-center py-4">
                  {/* Digital Age Indicator */}
                  <div className="bg-primary-600 text-white rounded-3xl px-8 py-3.5 font-mono text-4xl font-bold tracking-tight shadow-md shadow-primary-600/25 mb-8">
                    {childAge} {childAge === 1 ? 'year old' : 'years old'}
                  </div>

                  <Slider
                    id="child-age-slider-input"
                    min={0}
                    max={21}
                    value={childAge}
                    onChange={setChildAge}
                    className="w-full max-w-sm"
                  />

                  <div className="flex items-center justify-between w-full max-w-sm mt-3 px-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-450 font-bold">Newborn (0)</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-450 font-bold">Adult (21)</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-goal-type"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Pick your child's milestones
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                Choose the primary milestone pathway you're supporting. Different goals route resources to tailored risk and diversification frameworks.
              </p>

              {/* Beautiful Goal Selection Blocks */}
              <div className="flex flex-col gap-4">
                {/* Education Card */}
                <button
                  id="goal-type-education"
                  type="button"
                  onClick={() => setGoalType('Education')}
                  className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                    goalType === 'Education'
                      ? 'bg-primary-50/60 border-primary-500 text-primary-950 shadow-sm scale-[1.01]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${goalType === 'Education' ? 'bg-primary-100 text-primary-700' : 'bg-stone-100 text-stone-550'}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-stone-900 mb-1">🎓 Higher Educational Goals</span>
                    <span className="block text-xs text-stone-500 leading-relaxed">
                      Secures high-compounding funds for undergraduate studies, premium international college degrees, coaching classes, and boarding school fees.
                    </span>
                  </div>
                </button>

                {/* Medical Shield Card */}
                <button
                  id="goal-type-medical"
                  type="button"
                  onClick={() => setGoalType('Medical Buffer')}
                  className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                    goalType === 'Medical Buffer'
                      ? 'bg-primary-50/60 border-primary-500 text-primary-950 shadow-sm scale-[1.01]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${goalType === 'Medical Buffer' ? 'bg-primary-100 text-primary-700' : 'bg-stone-100 text-stone-550'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-stone-900 mb-1">🏥 Medical Buffer Shield</span>
                    <span className="block text-xs text-stone-500 leading-relaxed">
                      Builds a rigid safety framework for medical premiums, critical illness protective funds, premium health coverage, and general children's health.
                    </span>
                  </div>
                </button>

                {/* Business Capital Card */}
                <button
                  id="goal-type-business"
                  type="button"
                  onClick={() => setGoalType('Future Business')}
                  className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                    goalType === 'Future Business'
                      ? 'bg-primary-50/60 border-primary-500 text-primary-950 shadow-sm scale-[1.01]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${goalType === 'Future Business' ? 'bg-primary-100 text-primary-700' : 'bg-stone-100 text-stone-550'}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-stone-900 mb-1">💼 Future Business Plans</span>
                    <span className="block text-xs text-stone-500 leading-relaxed">
                      Guarantees startup seed capital, initial business establishment funds, technical tools, or small project allowances once your children achieve adulthood.
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-goal-amount"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Select target amount
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                Acknowledge baseline limits for realistic calculations. State an estimated value in today's rupee standards.
              </p>

              {/* Lumpsum savings input block */}
              <Card className="p-6 bg-white border border-stone-250/70 shadow-sm mb-6">
                <div className="flex flex-col gap-4">
                  <label htmlFor="target-amount-rupee-input" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                    TARGET AMOUNT (TODAY'S VALUE)
                  </label>
                  <div className="relative rounded-xl overflow-hidden shadow-inner bg-stone-50/70 border border-stone-200/80 flex items-center px-4 py-3.5">
                    <span className="text-xl font-bold font-sans text-stone-450 mr-1.5">₹</span>
                    <input
                      id="target-amount-rupee-input"
                      type="number"
                      min={50000}
                      step={5000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      className="w-full bg-transparent border-none text-xl font-mono font-bold focus:outline-none text-stone-900"
                    />
                  </div>

                  {targetAmount < 50000 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700 font-semibold leading-relaxed font-sans">
                      * Enter a baseline target value of at least ₹50,000 for realistic wealth calculations.
                    </div>
                  )}

                  {/* Preset quick selection chips */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold block mb-2.5">QUICK TARGET PRESETS</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {presets.map((preset) => (
                        <button
                          key={preset}
                          id={`preset-cap-${preset}`}
                          type="button"
                          onClick={() => setTargetAmount(preset)}
                          className={`px-3.5 py-2 rounded-full border transition-all duration-150 font-bold ${
                            targetAmount === preset
                              ? 'bg-primary-50 border-primary-300 text-primary-700'
                              : 'bg-[#fcfbf9] border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {formatINR(preset)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Target maturity year
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                Declare the precise financial maturity year. Calculations automatically sync with your child's age to maximize compounding returns.
              </p>

              <Card className="p-6 bg-stone-50/70 border border-stone-200">
                <div className="flex flex-col gap-2">
                  <label htmlFor="target-year-select-dropdown" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    MATURITY TARGET TIMELINE
                  </label>
                  <Select
                    id="target-year-select-dropdown"
                    value={activeYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="bg-white border border-stone-200 text-stone-850 font-medium py-3 rounded-xl"
                  >
                    {yearsOptions.map((yearOpt) => {
                      const diffYears = yearOpt - currentYear;
                      return (
                        <option key={yearOpt} value={yearOpt}>
                          Year {yearOpt} ({diffYears} {diffYears === 1 ? 'year' : 'years'} away)
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </Card>

              <div className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100/50 text-xs text-primary-850 leading-relaxed flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  Your child is currently <strong className="font-extrabold">{childAge}</strong>. This target allows for a wealth accumulation horizon of <strong className="font-extrabold">{timelineYears} years</strong>.
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-inflation-adjustment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Adjust expected inflation
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                Annual inflation dilutes real money value. Set expected lifestyle inflation levels to protect your child's future purchasing power.
              </p>

              <Card className="p-6 bg-stone-50/70 border border-stone-200 flex flex-col gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="inflation-rate-slider" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                      EXPECTED INFLATION RATE
                    </label>
                    <span className="text-sm font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 border border-primary-200 rounded-lg">
                      {inflationRate}% p.a.
                    </span>
                  </div>

                  <Slider
                    id="inflation-rate-slider"
                    min={0}
                    max={12}
                    value={inflationRate}
                    onChange={setInflationRate}
                    className="w-full"
                  />

                  <div className="flex items-center justify-between mt-2.5 px-0.5 text-[9px] uppercase font-mono font-bold tracking-wider text-stone-400">
                    <span>No Inflation (0%)</span>
                    <span>Standard (6% - India)</span>
                    <span>Hyper (12%)</span>
                  </div>
                </div>
              </Card>

              {/* Dynamic Real-Value Compound Impact Card */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                <Stars className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-bounce" />
                <div className="text-xs leading-relaxed text-indigo-950 font-sans">
                  <span className="font-extrabold text-indigo-900 block mb-0.5">Inflation Safeguard Protection</span>
                  To maintain original purchasing capacity, your <span className="font-bold">{formatINR(targetAmount)}</span> milestone adjusts to an adjusted requirement compounding target of <strong className="text-indigo-800 font-extrabold">{formatINR(adjustedTargetAmount)}</strong> in {timelineYears} years at <strong>{inflationRate}%</strong> inflation.
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step-parents-income"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-primary-600 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Parents' monthly income
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed font-sans">
                State your approximate household incomes. We will map your respective contributions proportionally so investment installments are split fairly.
              </p>

              {/* Two Column Layout for parents' income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {/* Mother's Column */}
                <Card className="p-5 bg-white border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                  <div>
                    <label htmlFor="mother-income-input" className="text-[10px] font-mono font-bold tracking-wider text-stone-400 block mb-2">
                      MOTHER'S MONTHLY INCOME
                    </label>
                    <div className="relative rounded-xl overflow-hidden shadow-inner bg-stone-50/70 border border-stone-200/80 flex items-center px-3 py-2.5 mb-3">
                      <span className="text-sm font-bold text-stone-400 mr-1">₹</span>
                      <input
                        id="mother-income-input"
                        type="number"
                        min={0}
                        step={10000}
                        value={motherIncome}
                        onChange={(e) => setMotherIncome(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-transparent border-none text-base font-mono font-bold focus:outline-none text-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <Slider
                      id="mother-income-slider"
                      min={0}
                      max={500000}
                      step={5000}
                      value={motherIncome}
                      onChange={setMotherIncome}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-stone-450 mt-1 font-bold">
                      <span>₹0</span>
                      <span>₹5L+</span>
                    </div>
                  </div>
                </Card>

                {/* Father's Column */}
                <Card className="p-5 bg-white border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                  <div>
                    <label htmlFor="father-income-input" className="text-[10px] font-mono font-bold tracking-wider text-stone-400 block mb-2">
                      FATHER'S MONTHLY INCOME
                    </label>
                    <div className="relative rounded-xl overflow-hidden shadow-inner bg-stone-50/70 border border-stone-200/80 flex items-center px-3 py-2.5 mb-3">
                      <span className="text-sm font-bold text-stone-400 mr-1">₹</span>
                      <input
                        id="father-income-input"
                        type="number"
                        min={0}
                        step={10000}
                        value={fatherIncome}
                        onChange={(e) => setFatherIncome(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-transparent border-none text-base font-mono font-bold focus:outline-none text-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <Slider
                      id="father-income-slider"
                      min={0}
                      max={500000}
                      step={5000}
                      value={fatherIncome}
                      onChange={setFatherIncome}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-stone-450 mt-1 font-bold">
                      <span>₹0</span>
                      <span>₹5L+</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Real-time Dynamic Installment split breakdown preview */}
              {(() => {
                const annualRate = 0.08;
                const r = annualRate / 12;
                const n = Math.round(timelineYears * 12);
                const power = n > 0 ? Math.pow(1 + r, n) : 1;
                const calculatedMonthly = n > 0 ? Math.ceil((adjustedTargetAmount * r) / (power - 1)) : adjustedTargetAmount;
                const monthlyInstallment = Math.max(1, calculatedMonthly);

                const totalParentIncome = motherIncome + fatherIncome;
                let mPct = 50;
                let fPct = 50;
                if (totalParentIncome > 0) {
                  mPct = Math.round((motherIncome / totalParentIncome) * 100);
                  fPct = 100 - mPct;
                }
                const mShare = Math.round((monthlyInstallment * mPct) / 100);
                const fShare = monthlyInstallment - mShare;

                return (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-sans shadow-sm">
                    <span className="text-[10px] font-mono tracking-widest text-stone-450 uppercase font-bold block mb-2">
                      ESTIMATED MONTHLY INSTALLMENT SPLIT
                    </span>
                    <div className="text-xs font-medium text-stone-605 leading-relaxed">
                      With your custom split of combined household incomes, the dynamic installment burden maps as follows based on a total required of <strong className="text-stone-900 font-extrabold">{formatINR(monthlyInstallment)}</strong>:
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-stone-200 text-stone-800">
                        <div>
                          <p className="text-[10px] font-mono text-primary-600 font-bold uppercase tracking-wider">Mother's installment ({mPct}%)</p>
                          <p className="text-base font-extrabold text-stone-900 font-mono mt-0.5">{formatINR(mShare)} <span className="text-[11px] font-normal text-stone-500">/mo</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider">Father's installment ({fPct}%)</p>
                          <p className="text-base font-extrabold text-stone-900 font-mono mt-0.5">{formatINR(fShare)} <span className="text-[11px] font-normal text-stone-500">/mo</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation triggers */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-stone-200/60 font-sans">
        {step > 1 ? (
          <Button
            id="step-prev-cta"
            variant="outline"
            size="md"
            onClick={handleBack}
            className="border-stone-200 hover:bg-stone-100/50 text-stone-650"
          >
            Back
          </Button>
        ) : (
          <div /> /* spacer */
        )}

        <Button
          id="step-next-cta"
          variant="primary"
          size="md"
          onClick={handleNext}
          disabled={step === 3 && targetAmount < 50000}
          className="bg-primary-600 hover:bg-primary-700 hover:shadow-md text-white transition-all font-bold px-7"
        >
          {step === 6 ? 'Generate Strategy Plan' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
