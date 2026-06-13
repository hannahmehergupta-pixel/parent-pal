import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Slider, Select, Progress } from './UI';
import { ArrowLeft, ArrowRight, Stars, Sparkles, Landmark, Coins } from 'lucide-react';

interface PlanFormProps {
  onSubmit: (data: {
    childAge: number;
    targetAmount: number;
    targetYear: number;
  }) => void;
  onBackToHome: () => void;
}

export default function PlanForm({ onSubmit, onBackToHome }: PlanFormProps) {
  const currentYear = new Date().getFullYear();

  // 3-step state variables
  const [step, setStep] = useState(1);
  const [childAge, setChildAge] = useState(5); // Step 1: Slider 0 to 21
  const [targetAmount, setTargetAmount] = useState(1000000); // Step 2: ₹ number input, min 50000
  
  // Step 3 Dropdown state initialized to currentYear + 10 as default, clamped below
  const [targetYear, setTargetYear] = useState(currentYear + 13); 

  // Compute dynamic dropdown range for Step 3: from (currentYear + 1) to (currentYear + (21 - childAge))
  const minYear = currentYear + 1;
  const maxYear = Math.max(currentYear + 1, currentYear + (21 - childAge));

  // Generate continuous years array
  const yearsOptions: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    yearsOptions.push(y);
  }

  // Ensure current targetYear selection stays within bounds if childAge is updated
  const activeYear = targetYear > maxYear || targetYear < minYear ? maxYear : targetYear;

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      if (targetAmount >= 50000) {
        onSubmit({
          childAge,
          targetAmount,
          targetYear: activeYear
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

  // Human-friendly currency format in Indian style
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const presets = [100000, 500000, 1000000, 2500000, 5000000];
  const progressPercentage = (step / 3) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-10 md:py-16 text-stone-800">
      {/* Top Header Indicators */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="step-navigation-back"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          {step === 1 ? 'Home' : 'Previous Step'}
        </button>
        <span className="text-xs text-stone-400 font-mono tracking-wider font-semibold">
          QUESTION {step} OF 3
        </span>
      </div>

      {/* Modern Progress Line */}
      <Progress id="planning-wizard-progress" value={progressPercentage} className="mb-10" />

      <div className="min-h-[380px] flex flex-col">
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
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  Select child's current age
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                We use this to customize maximum tax exemptions and compute compound timeline durations up to adulthood (age 21).
              </p>

              <Card className="p-8 sm:p-10 bg-stone-50/70 border border-stone-200">
                <div className="flex flex-col items-center py-4">
                  {/* Digital Age Badge */}
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

                  <div className="flex items-center justify-between w-full max-w-sm mt-2 px-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Newborn (0)</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Adult (21)</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-savings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-primary-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-stone-900">
                  How much do you want to save?
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                Set your desired final lumpsum corpus. A minimum threshold of ₹50,000 ensures maximum compound benefits.
              </p>

              <Card className="p-8 bg-white border border-stone-200 shadow-sm mb-6">
                <div className="flex flex-col gap-5">
                  <label htmlFor="target-amount-rupee-input" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                    TARGET AMOUNT (INR)
                  </label>
                  <div className="relative rounded-2xl overflow-hidden shadow-inner bg-stone-50 border border-stone-200 flex items-center px-5 py-4">
                    <span className="text-2xl font-bold font-sans text-stone-400 mr-2">₹</span>
                    <input
                      id="target-amount-rupee-input"
                      type="number"
                      min={50000}
                      step={5000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      className="w-full bg-transparent border-none text-2xl font-mono font-bold focus:outline-none text-stone-850"
                    />
                  </div>

                  {targetAmount < 50000 && (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700 leading-normal font-semibold">
                      * Please enter a target savings amount of at least ₹50,000.
                    </div>
                  )}

                  {/* Quick Select Presets */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase block mb-3 font-semibold">PRESETS</span>
                    <div className="flex flex-wrap gap-2.5">
                      {presets.map((preset) => (
                        <button
                          key={preset}
                          id={`preset-cap-${preset}`}
                          type="button"
                          onClick={() => setTargetAmount(preset)}
                          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-bold ${
                            targetAmount === preset
                              ? 'bg-primary-50 border-primary-300 text-primary-700'
                              : 'bg-stone-50 border-stone-250 text-stone-600 hover:bg-stone-100'
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

          {step === 3 && (
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
                  By which year?
                </h2>
              </div>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                Choose the target future calendar year when your child reaches maturity. Capped up to age 21 ({21 - childAge} years max timeline remaining).
              </p>

              <Card className="p-8 bg-stone-50 border border-stone-200 mb-8">
                <div className="flex flex-col gap-4">
                  <label htmlFor="target-year-select-dropdown" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                    TARGET SAVINGS YEAR
                  </label>
                  
                  <Select
                    id="target-year-select-dropdown"
                    value={activeYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
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

                  <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200/60 text-xs text-stone-500 flex items-start gap-2.5">
                    <Stars className="w-4.5 h-4.5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-700 block mb-0.5">Calculated Target Horizon</span>
                      This sets your investment timeline to exactly <strong className="text-stone-800 font-semibold">{activeYear - currentYear} {activeYear - currentYear === 1 ? 'year' : 'years'}</strong>, aligning asset allocation percentages under automated compounding metrics.
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lower Navigation Controls */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-stone-200/60 font-sans">
        {step > 1 ? (
          <Button
            id="step-prev-cta"
            variant="outline"
            size="md"
            onClick={handleBack}
            className="border-stone-200 hover:bg-stone-50 text-stone-650"
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
          disabled={step === 2 && targetAmount < 50000}
          className="bg-primary-600 hover:bg-primary-700 hover:shadow-md text-white transition-all font-bold px-7"
        >
          {step === 3 ? 'Generate Strategy Plan' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
