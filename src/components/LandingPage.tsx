import React from 'react';
import { Button } from './UI';
import { Sparkles, TrendingUp, ShieldCheck, Milestone, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateToPlan: () => void;
}

export default function LandingPage({ onNavigateToPlan }: LandingPageProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-stone-800">
      {/* Decorative ambient blobs using teal blur effects for warm elegance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary-100/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        {/* Decorative Badge */}
        <div 
          id="brand-badge" 
          className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-primary-50 border border-primary-100/70 text-primary-700 text-xs font-semibold tracking-wide mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-pulse" />
          <span>India's Smarter Compound Advisor</span>
        </div>

        {/* Title: Parent Pal */}
        <h1 
          id="app-display-title" 
          className="text-5xl sm:text-7xl font-extrabold font-display tracking-tight bg-gradient-to-br from-stone-900 via-primary-950 to-stone-950 bg-clip-text text-transparent mb-6 leading-none"
        >
          Parent Pal
        </h1>

        {/* Tagline */}
        <p 
          id="app-tagline" 
          className="text-lg sm:text-2xl text-stone-600 font-sans font-medium tracking-normal max-w-2xl mb-12 leading-relaxed"
        >
          Know exactly how much to invest today for your child's tomorrow.
        </p>

        {/* One CTA Button: Build My Plan → */}
        <div id="cta-button-container" className="mb-16">
          <Button
            id="start-planning-cta"
            variant="primary"
            size="lg"
            onClick={onNavigateToPlan}
            className="group font-display text-base font-bold px-10 py-4.5 bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30 shadow-md rounded-full text-white transition-all transform hover:-translate-y-0.5"
          >
            Build My Plan
            <ArrowRight className="w-5 h-5 ml-2 text-primary-100 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Dynamic Highlight Columns */}
        <div id="feature-highlights" className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pt-12 border-t border-stone-200/60 max-w-4xl">
          <div className="flex flex-col items-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 text-primary-600 shadow-sm border border-primary-100/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">Sovereign Safety First</h4>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">Prioritizing solid sovereign schemes and guaranteed-return public certificates first.</p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 text-primary-600 shadow-sm border border-primary-100/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">Algorithmic Splitting</h4>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">Diversifying into equities, hedging models, and fixed savings relative to your calendar countdown.</p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 text-primary-600 shadow-sm border border-primary-100/30">
              <Milestone className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">Actionable Portfolios</h4>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">Receive a clean breakdown of exact rupee totals to lock away for maximum yields immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
