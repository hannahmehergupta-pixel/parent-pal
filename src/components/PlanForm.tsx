import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, CardContent, Slider, Progress } from './UI';
import { ArrowLeft, ArrowRight, Check, GraduationCap, HeartPulse, Trophy, Landmark } from 'lucide-react';
import { GoalType } from '../types';

interface PlanFormProps {
  onSubmit: (data: {
    childAge: number;
    goalType: GoalType;
    targetAmount: number;
    timelineYears: number;
  }) => void;
  onBackToHome: () => void;
}

export default function PlanForm({ onSubmit, onBackToHome }: PlanFormProps) {
  const [step, setStep] = useState(1);
  const [childAge, setChildAge] = useState(5);
  const [goalType, setGoalType] = useState<GoalType | null>(null);
  const [targetAmount, setTargetAmount] = useState(1000000); // Standard ₹10 Lakhs
  const [timelineYears, setTimelineYears] = useState(13); // Default 18 - 5 = 13

  // Clamp timeline if childAge changes
  useEffect(() => {
    const maxTimeline = Math.max(1, 18 - childAge);
    if (timelineYears > maxTimeline) {
      setTimelineYears(maxTimeline);
    }
  }, [childAge, timelineYears]);

  const maxTimelineAllowed = Math.max(1, 18 - childAge);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      if (goalType) {
        onSubmit({
          childAge,
          goalType,
          targetAmount,
          timelineYears
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

  const selectGoal = (type: GoalType) => {
    setGoalType(type);
    // Double advance with subtle timeout for Typeform-like auto-advance
    setTimeout(() => {
      setStep(3);
    }, 250);
  };

  // Helper values for Indian numbering system
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Preset buttons for child target values
  const presets = [100000, 500000, 1000000, 2500000, 5000000];

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Upper Navigation Indicator & Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          id="step-back-button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {step === 1 ? 'Home' : 'Back'}
        </button>
        <span className="text-xs text-neutral-400 font-mono tracking-wider">
          STEP {step} OF 4
        </span>
      </div>

      {/* Progress display */}
      <Progress id="form-progress-bar" value={progressPercentage} className="mb-8" />

      {/* Steps Frame containing Animating Card */}
      <div className="relative overflow-hidden min-h-[360px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 tracking-tight mb-2">
                How old is your child?
              </h2>
              <p className="text-sm text-neutral-500 mb-8">
                This helps us estimate the legal eligibility for tax-free compounding plans like SSY.
              </p>

              <Card className="p-8 bg-slate-50 border border-slate-200">
                <div className="flex flex-col items-center py-6">
                  {/* Age text bubble */}
                  <div className="bg-primary-600 text-white rounded-3xl px-8 py-4 font-mono text-4xl font-bold tracking-tight shadow-lg shadow-primary-600/15 mb-8">
                    {childAge} {childAge === 1 ? 'year old' : 'years old'}
                  </div>

                  <Slider
                    id="child-age-slider"
                    min={0}
                    max={17}
                    value={childAge}
                    onChange={setChildAge}
                    className="w-full max-w-md"
                  />
                  
                  <div className="flex items-center justify-between w-full max-w-md mt-1 px-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Infant</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Teenager</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 tracking-tight mb-2">
                What is your savings goal?
              </h2>
              <p className="text-sm text-neutral-500 mb-8">
                Your investment mix and locking structures personalize based on your strategic priority.
              </p>

              <div className="flex flex-col gap-4">
                {/* Education */}
                <button
                  id="goal-education-btn"
                  onClick={() => selectGoal('Education')}
                  className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer ${
                    goalType === 'Education'
                      ? 'border-primary-600 bg-primary-50/45 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${goalType === 'Education' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">Higher Education</span>
                      {goalType === 'Education' && <Check className="w-4 h-4 text-primary-600 font-bold" />}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">For undergraduate or postgraduate fees, professional certifications, or studying abroad.</p>
                  </div>
                </button>

                {/* Medical Buffer */}
                <button
                  id="goal-medical-btn"
                  onClick={() => selectGoal('Medical Buffer')}
                  className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer ${
                    goalType === 'Medical Buffer'
                      ? 'border-primary-600 bg-primary-50/45 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${goalType === 'Medical Buffer' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">Medical Buffer</span>
                      {goalType === 'Medical Buffer' && <Check className="w-4 h-4 text-primary-600 font-bold" />}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">An emergency medical co-pay shield or general specialized healthcare backup.</p>
                  </div>
                </button>

                {/* Milestone */}
                <button
                  id="goal-milestone-btn"
                  onClick={() => selectGoal('Milestone')}
                  className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer ${
                    goalType === 'Milestone'
                      ? 'border-primary-600 bg-primary-50/45 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${goalType === 'Milestone' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">Milestone Events</span>
                      {goalType === 'Milestone' && <Check className="w-4 h-4 text-primary-600 font-bold" />}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Seed capital for their first business, buying a vehicle, or wedding expenses.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 tracking-tight mb-2">
                What is your target savings corpus?
              </h2>
              <p className="text-sm text-neutral-500 mb-8">
                Enter your desired final amount. Capped at a minimum value of ₹50,000.
              </p>

              <Card className="p-8 bg-white border border-slate-200 mb-6">
                <div className="flex flex-col gap-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-50 border border-slate-200 flex items-center px-5 py-4">
                    <span className="text-xl font-bold font-sans text-slate-400 mr-2">₹</span>
                    <input
                      id="target-amount-input"
                      type="number"
                      min={50000}
                      step={5000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-transparent border-none text-2xl font-mono font-bold focus:outline-none text-slate-800"
                    />
                  </div>

                  {targetAmount < 50000 && (
                    <p className="text-xs text-amber-600 font-medium">
                      * Capped at minimum baseline ₹50,000 for standard Indian plans.
                    </p>
                  )}

                  {/* Preset Quick Selection Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        id={`preset-amt-${preset}`}
                        type="button"
                        onClick={() => setTargetAmount(preset)}
                        className={`text-xs px-4 py-2.5 rounded-full border transition-all duration-150 font-semibold ${
                          targetAmount === preset
                            ? 'bg-primary-50 border-primary-200 text-primary-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {formatINR(preset)}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Compounding Power Tip</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Even saving a conservative target like ₹5 Lakhs over a teen's timeline can yield surprising safety cushions due to compounding interest.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-900 tracking-tight mb-2">
                What is your timeline?
              </h2>
              <p className="text-sm text-neutral-500 mb-8">
                Capped dynamically until child reaching adult majority target age (18 minus age {childAge}).
              </p>

              <Card className="p-8 bg-slate-50 border border-slate-200">
                <div className="flex flex-col items-center py-6">
                  {/* Timeline years text bubble */}
                  <div className="bg-slate-900 text-white rounded-3xl px-8 py-4 font-mono text-4xl font-bold tracking-tight shadow-lg mb-8">
                    {timelineYears} {timelineYears === 1 ? 'Year' : 'Years'}
                  </div>

                  <Slider
                    id="timeline-years-slider"
                    min={1}
                    max={maxTimelineAllowed}
                    value={timelineYears}
                    onChange={setTimelineYears}
                    className="w-full max-w-md"
                  />

                  <div className="flex items-center justify-between w-full max-w-md mt-1 px-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">1 Year</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Max limit ({maxTimelineAllowed} yrs)</span>
                  </div>
                </div>
              </Card>

              {maxTimelineAllowed <= 1 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700 leading-normal">
                  Child is close to adulthood. Timeline is constrained to 1 year. Try adjusting child age on Step 1 if you wish to see wider compounding metrics.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons Row at bottom */}
      <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-neutral-100">
        {step > 1 && (
          <Button
            id="step-prev-navigation"
            variant="outline"
            size="md"
            onClick={() => setStep(prev => prev - 1)}
          >
            Back
          </Button>
        )}
        
        <Button
          id="step-next-navigation"
          variant="primary"
          size="md"
          onClick={handleNext}
          disabled={step === 2 && !goalType || step === 3 && targetAmount < 50000}
        >
          {step === 4 ? 'Formulate Vault Plan' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
