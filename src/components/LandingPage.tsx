import React from 'react';
import { Button } from './UI';
import { Shield, Sparkles, TrendingUp, Coins, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateToPlan: () => void;
}

export default function LandingPage({ onNavigateToPlan }: LandingPageProps) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Visual background ambient details */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-slate-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
        {/* Modern decorative micro badge */}
        <div 
          id="hero-badge" 
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>India's Premium Child Wealth Planner</span>
        </div>

        {/* Brand Name */}
        <h1 
          id="app-display-title" 
          className="text-5xl sm:text-7xl font-extrabold font-display tracking-tight bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 bg-clip-text text-transparent mb-4 leading-none"
        >
          KidVault
        </h1>

        {/* Tagline */}
        <p 
          id="app-tagline" 
          className="text-lg sm:text-2xl text-slate-600 font-sans font-medium tracking-normal max-w-xl mb-10 leading-relaxed"
        >
          Secure your child's financial future in 2 minutes.
        </p>

        {/* One CTA Button linking to /plan */}
        <div id="cta-button-container" className="mb-14">
          <Button
            id="start-planning-cta"
            variant="primary"
            size="lg"
            onClick={onNavigateToPlan}
            className="group font-display text-base font-semibold px-8 py-4 bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 shadow-sm rounded-full"
          >
            Create Saving Plan
            <ChevronRight className="w-5 h-5 text-blue-200 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Trust & Static Value Indicators (Non-interactive aesthetics) */}
        <div id="feature-highlights" className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pt-10 border-t border-slate-200">
          <div className="flex flex-col items-center p-3 text-center">
            <div className="w-12 h-12 rounded-3xl bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">100% Tax-Free Schemes</h4>
            <p className="text-xs text-slate-400 mt-1 lines-2">Discover government-backed plans tailored for education milestones.</p>
          </div>

          <div className="flex flex-col items-center p-3 text-center">
            <div className="w-12 h-12 rounded-3xl bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">8.2% Guaranteed Yields</h4>
            <p className="text-xs text-slate-400 mt-1 lines-2">Harness maximum compounding compound ratios through secure vehicles.</p>
          </div>

          <div className="flex flex-col items-center p-3 text-center">
            <div className="w-12 h-12 rounded-3xl bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
              <Coins className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Real-Time Estimations</h4>
            <p className="text-xs text-slate-400 mt-1 lines-2">Receive precise monthly systematic investment blueprints.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
