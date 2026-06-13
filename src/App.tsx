import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PlanForm from './components/PlanForm';
import ResultsPage from './components/ResultsPage';
import { GoalType } from './types';
import { ShieldCheck, Calendar, HelpCircle } from 'lucide-react';

export default function App() {
  const [path, setPath] = useState(() => {
    // Read route on initial frame page load
    const currentPath = window.location.pathname;
    if (window.location.hash) {
      return window.location.hash.replace('#', '');
    }
    return currentPath || '/';
  });

  // Track window hash or state history
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (window.location.hash) {
        setPath(window.location.hash.replace('#', ''));
      } else {
        setPath(currentPath || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState(null, '', newPath);
    setPath(newPath);
    // Scroll to top on navigation block change
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Extract router query params if path starts with or contains "/results"
  const isResultsPage = path.startsWith('/results');
  let childAge = 5;
  let goalType: GoalType = 'Education';
  let targetAmount = 1000000;
  let timelineYears = 13;

  if (isResultsPage) {
    const searchParams = new URLSearchParams(window.location.search);
    childAge = Number(searchParams.get('age')) || 5;
    const goalParam = searchParams.get('goal') as GoalType;
    if (goalParam === 'Education' || goalParam === 'Medical Buffer' || goalParam === 'Milestone') {
      goalType = goalParam;
    }
    targetAmount = Math.max(50000, Number(searchParams.get('target')) || 1000000);
    timelineYears = Number(searchParams.get('timeline')) || Math.max(1, 18 - childAge);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa]">
      {/* Sticky Premium Navigation Rail Header */}
      <header id="main-app-header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            id="brand-navigation-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/15 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display tracking-tight text-neutral-900 leading-none">
                KidVault
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide mt-0.5 uppercase">
                Secure Family Planning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="nav-help-cta"
              onClick={() => navigate('/plan')}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Start Plan
            </button>
            <span className="h-4 w-[1px] bg-neutral-200" />
            <div id="badge-clock" className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-500 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>India FY26-27</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single-View Router Display Frame */}
      <main className="flex-grow flex flex-col relative w-full">
        {path === '/' && (
          <LandingPage onNavigateToPlan={() => navigate('/plan')} />
        )}

        {path === '/plan' && (
          <PlanForm
            onSubmit={(data) => {
              const query = `?age=${data.childAge}&goal=${encodeURIComponent(data.goalType)}&target=${data.targetAmount}&timeline=${data.timelineYears}`;
              navigate(`/results${query}`);
            }}
            onBackToHome={() => navigate('/')}
          />
        )}

        {isResultsPage && (
          <ResultsPage
            childAge={childAge}
            goalType={goalType}
            targetAmount={targetAmount}
            timelineYears={timelineYears}
            onStartOver={() => navigate('/plan')}
          />
        )}

        {/* Fallback routing */}
        {path !== '/' && path !== '/plan' && !isResultsPage && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <h2 className="text-xl font-bold font-display text-neutral-800">Page Not Found</h2>
            <p className="text-sm text-neutral-500 mt-2 mb-6">The requested pathway does not exist.</p>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              Return to KidVault Home
            </button>
          </div>
        )}
      </main>

      {/* Aesthetic simple footer copyright zone */}
      <footer id="main-app-footer" className="bg-white border-t border-neutral-100 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 font-sans tracking-tight">
            © {new Date().getFullYear()} KidVault Wealth Technologies. All compounding calculations modeled on standard regular interval structures.
          </p>
          <div className="flex items-center gap-4 text-neutral-400 text-xs">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-neutral-600 transition-colors">Home</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/plan'); }} className="hover:text-neutral-600 transition-colors">Plan Builder</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
