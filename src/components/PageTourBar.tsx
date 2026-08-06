import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  User,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Compass,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PageTourBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSelectTutor?: (tutorId: string) => void;
}

export const PageTourBar: React.FC<PageTourBarProps> = ({ currentTab, setCurrentTab, onSelectTutor }) => {
  const { switchDemoUser } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  const steps = [
    {
      id: 'landing',
      number: 1,
      title: 'Landing Page',
      subtitle: 'Homepage & Hero',
      icon: Home,
      roleNeeded: 'student' as const,
      color: 'bg-blue-600',
    },
    {
      id: 'tutors',
      number: 2,
      title: 'Tutor Directory',
      subtitle: 'Search & Filters',
      icon: Search,
      roleNeeded: 'student' as const,
      color: 'bg-emerald-600',
    },
    {
      id: 'tutor_profile',
      number: 3,
      title: 'Tutor Profile',
      subtitle: 'Bookings & Packages',
      icon: User,
      roleNeeded: 'student' as const,
      color: 'bg-amber-600',
    },
    {
      id: 'student_dashboard',
      number: 4,
      title: 'Student Portal',
      subtitle: 'My Lessons & Payments',
      icon: GraduationCap,
      roleNeeded: 'student' as const,
      color: 'bg-indigo-600',
    },
    {
      id: 'tutor_dashboard',
      number: 5,
      title: 'Tutor Portal',
      subtitle: 'Schedule & Earnings',
      icon: Briefcase,
      roleNeeded: 'tutor' as const,
      color: 'bg-teal-600',
    },
    {
      id: 'admin_dashboard',
      number: 6,
      title: 'Admin Backend',
      subtitle: 'Governance & Auditing',
      icon: ShieldCheck,
      roleNeeded: 'admin' as const,
      color: 'bg-purple-600',
    },
  ];

  // Map active tab to current step index
  const getCurrentStepIndex = () => {
    switch (currentTab) {
      case 'landing': return 0;
      case 'tutors': return 1;
      case 'tutor_profile': return 2;
      case 'student_dashboard': return 3;
      case 'tutor_dashboard': return 4;
      case 'admin_dashboard': return 5;
      default: return 0;
    }
  };

  const currentIndex = getCurrentStepIndex();

  const handleStepClick = (stepIndex: number) => {
    const targetStep = steps[stepIndex];
    if (targetStep.roleNeeded) {
      switchDemoUser(targetStep.roleNeeded);
    }
    if (targetStep.id === 'tutor_profile' && onSelectTutor) {
      onSelectTutor('usr_tutor_1');
    }
    setCurrentTab(targetStep.id);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleStepClick(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      handleStepClick(currentIndex + 1);
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300">
      <div className="bg-[#022448]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 p-2 sm:p-3 space-y-2">
        
        {/* Top Header Row in Tour Bar */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#feae2c] animate-pulse"></span>
            <span className="font-bold text-white flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#feae2c]" /> Interactive App Tour
            </span>
            <span className="text-[10px] bg-white/10 text-blue-200 px-2 py-0.5 rounded-full font-mono">
              Step {currentIndex + 1} of {steps.length}: <strong className="text-amber-300">{steps[currentIndex].title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold rounded-lg transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === steps.length - 1}
              className="px-3 py-1 bg-[#feae2c] text-[#022448] hover:bg-[#f09c13] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 shadow-md"
            >
              Next Page <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-blue-200 hover:text-white rounded-md"
              title={isMinimized ? "Expand Page Tour" : "Minimize Page Tour"}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Steps Sequence Bar */}
        {!isMinimized && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-1 border-t border-white/10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={`p-2 rounded-xl text-left transition-all flex flex-col justify-between relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#feae2c] to-amber-500 text-[#022448] font-bold shadow-lg ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/15 text-blue-100 hover:text-white border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      isActive ? 'bg-[#022448] text-white' : 'bg-white/10 text-blue-200'
                    }`}>
                      {step.number}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#022448]' : 'text-[#feae2c]'}`} />
                  </div>

                  <div>
                    <p className={`text-xs font-bold leading-tight ${isActive ? 'text-[#022448]' : 'text-white'}`}>
                      {step.title}
                    </p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-[#022448]/80' : 'text-blue-200/70'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
