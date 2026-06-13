import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PlanForm from './components/PlanForm';
import ResultsPage from './components/ResultsPage';
import { GoalType } from './types';
import { ShieldCheck, Calendar, HelpCircle } from 'lucide-react';

export default function App() {
  const [route, setRoute] = useState<'home' | 'plan' | 'results'>('home');
  const [formData, setFormData] = useState<{
    childAge: number;
    goalType: GoalType;
    targetAmount: number;
    timelineYears: number;
  }>({
    childAge: 5,
    goalType: 'Education',
    targetAmount: 1000000,
    timelineYears: 13,
  });

  // Safe navigation helpers wrapped in try-catch to prevent iframe SecurityError crashes
  const navigateToHome = () => {
    setRoute('home');
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      console.warn('Navigation state sync bypassed due to sandbox constraint:', e);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToPlan = () => {
    setRoute('plan');
    try {
      window.history.pushState(null, '', '/plan');
    } catch (e) {
      console.warn('Navigation state sync bypassed due to sandbox constraint:', e);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToResults = (data: { childAge: number; goalType: GoalType; targetAmount: number; timelineYears: number }) => {
    setFormData(data);
    setRoute('results');
    try {
      const query = `?age=${data.childAge}&goal=${encodeURIComponent(data.goalType)}&target=${data.targetAmount}&timeline=${data.timelineYears}`;
      window.history.pushState(null, '', `/results${query}`);
    } catch (e) {
      console.warn('Navigation state sync bypassed due to sandbox constraint:', e);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Sync initial URL path on load
  useEffect(() => {
    try {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (currentPath.startsWith('/results')) {
        const age = Number(searchParams.get('age')) || 5;
        const goalParam = searchParams.get('goal') as GoalType;
        const target = Number(searchParams.get('target')) || 1000000;
        const timeline = Number(searchParams.get('timeline')) || Math.max(1, 18 - age);
        
        let checkedGoal: GoalType = 'Education';
        if (goalParam === 'Education' || goalParam === 'Medical Buffer' || goalParam === 'Milestone') {
          checkedGoal = goalParam;
        }

        setFormData({
          childAge: age,
          goalType: checkedGoal,
          targetAmount: target,
          timelineYears: timeline
        });
        setRoute('results');
      } else if (currentPath === '/plan') {
        setRoute('plan');
      } else {
        setRoute('home');
      }
    } catch (e) {
      console.warn('Failed to parse initial pathname due to sandbox:', e);
      setRoute('home');
    }
  }, []);

  // Sync route on popstate (browser back/forward button clicks)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        
        if (currentPath.startsWith('/results')) {
          const age = Number(searchParams.get('age')) || 5;
          const goalParam = searchParams.get('goal') as GoalType;
          const target = Number(searchParams.get('target')) || 1000000;
          const timeline = Number(searchParams.get('timeline')) || Math.max(1, 18 - age);
          
          let checkedGoal: GoalType = 'Education';
          if (goalParam === 'Education' || goalParam === 'Medical Buffer' || goalParam === 'Milestone') {
            checkedGoal = goalParam;
          }

          setFormData({
            childAge: age,
            goalType: checkedGoal,
            targetAmount: target,
            timelineYears: timeline
          });
          setRoute('results');
        } else if (currentPath === '/plan') {
          setRoute('plan');
        } else {
          setRoute('home');
        }
      } catch (e) {
        console.warn('Failed to parse state pop due to sandbox:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa]">
      {/* Sticky Premium Navigation Rail Header */}
      <header id="main-app-header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            id="brand-navigation-logo"
            onClick={navigateToHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center text-white shadow-md shadow-primary-600/15 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display tracking-tight text-slate-800 leading-none">
                KidVault
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide mt-0.5 uppercase">
                Secure Family Planning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="nav-help-cta"
              onClick={navigateToPlan}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Start Plan
            </button>
            <span className="h-4 w-[1px] bg-slate-200" />
            <div id="badge-clock" className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>India FY26-27</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single-View Router Display Frame */}
      <main className="flex-grow flex flex-col relative w-full">
        {route === 'home' && (
          <LandingPage onNavigateToPlan={navigateToPlan} />
        )}

        {route === 'plan' && (
          <PlanForm
            onSubmit={navigateToResults}
            onBackToHome={navigateToHome}
          />
        )}

        {route === 'results' && (
          <ResultsPage
            childAge={formData.childAge}
            goalType={formData.goalType}
            targetAmount={formData.targetAmount}
            timelineYears={formData.timelineYears}
            onStartOver={navigateToPlan}
          />
        )}
      </main>

      {/* Aesthetic simple footer copyright zone */}
      <footer id="main-app-footer" className="bg-white border-t border-neutral-100 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 font-sans tracking-tight">
            © {new Date().getFullYear()} KidVault Wealth Technologies. All compounding calculations modeled on standard regular interval structures.
          </p>
          <div className="flex items-center gap-4 text-neutral-400 text-xs">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToHome(); }} className="hover:text-neutral-600 transition-colors">Home</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPlan(); }} className="hover:text-neutral-600 transition-colors">Plan Builder</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
