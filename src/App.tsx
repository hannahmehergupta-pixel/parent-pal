import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PlanForm from './components/PlanForm';
import ResultsPage from './components/ResultsPage';
import { GoalType } from './types';
import { Calendar, Heart } from 'lucide-react';

export default function App() {
  const currentYear = new Date().getFullYear();

  // Route state
  const [route, setRoute] = useState<'home' | 'plan' | 'results'>('home');
  
  // Extended form data matching new goal types & inflation parameters
  const [formData, setFormData] = useState<{
    childAge: number;
    targetAmount: number;
    targetYear: number;
    goalType: GoalType;
    inflationRate: number;
    motherIncome: number;
    fatherIncome: number;
  }>({
    childAge: 5,
    targetAmount: 1000000,
    targetYear: currentYear + 13,
    goalType: 'Education',
    inflationRate: 6, // default to 6% standard inflation in India
    motherIncome: 80000,
    fatherIncome: 120000
  });

  // Safe client-side history navigation wrappers supporting the sandboxed iframe environment
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

  const navigateToResults = (data: { 
    childAge: number; 
    targetAmount: number; 
    targetYear: number;
    goalType: GoalType;
    inflationRate: number;
    motherIncome: number;
    fatherIncome: number;
  }) => {
    setFormData(data);
    setRoute('results');
    try {
      const query = `?age=${data.childAge}&amount=${data.targetAmount}&year=${data.targetYear}&goal=${encodeURIComponent(data.goalType)}&inflation=${data.inflationRate}&mother=${data.motherIncome}&father=${data.fatherIncome}`;
      window.history.pushState(null, '', `/results${query}`);
    } catch (e) {
      console.warn('Navigation state sync bypassed due to sandbox constraint:', e);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Synchronise initial query parameters on page load securely
  useEffect(() => {
    try {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (currentPath.startsWith('/results')) {
        const age = Number(searchParams.get('age')) || 5;
        const amount = Number(searchParams.get('amount')) || 1000000;
        const year = Number(searchParams.get('year')) || (currentYear + 13);
        const goalParam = searchParams.get('goal') as GoalType;
        const inflation = Number(searchParams.get('inflation')) ?? 6;
        const mother = Number(searchParams.get('mother')) || 80000;
        const father = Number(searchParams.get('father')) || 120000;

        let parsedGoal: GoalType = 'Education';
        if (goalParam === 'Education' || goalParam === 'Medical Buffer' || goalParam === 'Future Business') {
          parsedGoal = goalParam;
        }

        setFormData({
          childAge: age,
          targetAmount: amount,
          targetYear: year,
          goalType: parsedGoal,
          inflationRate: isNaN(inflation) ? 6 : inflation,
          motherIncome: mother,
          fatherIncome: father
        });
        setRoute('results');
      } else if (currentPath === '/plan') {
         setRoute('plan');
      } else {
         setRoute('home');
      }
    } catch (e) {
      console.warn('Failed to parse load state due to browser sandbox:', e);
      setRoute('home');
    }
  }, [currentYear]);

  // Handle browser back and forward button operations seamlessly
  useEffect(() => {
    const handlePopState = () => {
      try {
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        
        if (currentPath.startsWith('/results')) {
          const age = Number(searchParams.get('age')) || 5;
          const amount = Number(searchParams.get('amount')) || 1000000;
          const year = Number(searchParams.get('year')) || (currentYear + 13);
          const goalParam = searchParams.get('goal') as GoalType;
          const inflation = Number(searchParams.get('inflation')) ?? 6;
          const mother = Number(searchParams.get('mother')) || 80000;
          const father = Number(searchParams.get('father')) || 120000;

          let parsedGoal: GoalType = 'Education';
          if (goalParam === 'Education' || goalParam === 'Medical Buffer' || goalParam === 'Future Business') {
            parsedGoal = goalParam;
          }

          setFormData({
            childAge: age,
            targetAmount: amount,
            targetYear: year,
            goalType: parsedGoal,
            inflationRate: isNaN(inflation) ? 6 : inflation,
            motherIncome: mother,
            fatherIncome: father
          });
          setRoute('results');
        } else if (currentPath === '/plan') {
          setRoute('plan');
        } else {
          setRoute('home');
        }
      } catch (e) {
        console.warn('Failed to handle pop event in iframe:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentYear]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fdfbf9] text-stone-850">
      {/* Sticky Header Nav with Warm Shadows */}
      <header id="main-app-header" className="sticky top-0 z-50 bg-[#fdfbf9]/90 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand Group */}
          <div
            id="brand-navigation-logo"
            onClick={navigateToHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center text-white shadow-md shadow-primary-650/15 group-hover:scale-105 transition-all">
              <Heart className="w-5.5 h-5.5 fill-white/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display tracking-tight text-stone-900 leading-none">
                Parent Pal
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-normal mt-0.5">
                Securing big dreams for little ones, one smart step at a time
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="action-nav-plan"
              onClick={navigateToPlan}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Start Plan
            </button>
            <span className="h-4 w-[1px] bg-stone-200" />
            <div id="badge-clock" className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100/50 border border-stone-200/50 text-stone-500 text-xs font-mono font-semibold">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>India FY26-27</span>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Display Content Container */}
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
            targetAmount={formData.targetAmount}
            targetYear={formData.targetYear}
            goalType={formData.goalType}
            inflationRate={formData.inflationRate}
            motherIncome={formData.motherIncome}
            fatherIncome={formData.fatherIncome}
            onStartOver={navigateToPlan}
          />
        )}
      </main>

      {/* Styled Footer Copyright Bar */}
      <footer id="main-app-footer" className="bg-[#fcfbf9] border-t border-stone-200/60 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400 font-sans tracking-tight font-medium">
            © {new Date().getFullYear()} Parent Pal Financial Technologies. All compounding calculations modeled on standard regular interval structures.
          </p>
          <div className="flex items-center gap-4 text-stone-400 text-xs font-semibold">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToHome(); }} className="hover:text-stone-900 transition-colors">Home</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPlan(); }} className="hover:text-stone-900 transition-colors">Plan Builder</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
