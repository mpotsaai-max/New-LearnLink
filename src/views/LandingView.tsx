import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Search,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Smartphone,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SUBJECT_CATEGORIES } from '../data/initialData';

interface LandingViewProps {
  onNavigate: (tab: string) => void;
  onSelectTutor: (tutorId: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onSelectTutor, onOpenAuth }) => {
  const { users } = useAuth();
  const { setSearchQuery, setSelectedSubject } = useApp();

  const tutors = users.filter(u => u.role === 'tutor' && u.isVerifiedTutor);

  const handleSubjectClick = (subjName: string) => {
    setSelectedSubject(subjName);
    onNavigate('tutors');
  };

  return (
    <div className="space-y-16 pb-16 bg-[#fcf8fb]">
      
      {/* Hero Section */}
      <section className="relative bg-[#022448] text-white overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#feae2c] border border-white/15 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#feae2c]" />
                <span>BOTSWANA PREMIER TUTORING NETWORK</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Connect. Learn. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feae2c] to-[#f09c13]">
                  Grow with Confidence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connecting primary, BGCSE, and university students across Botswana with top verified tutors. Book 1-on-1 sessions with 100% Mobile Money Escrow security.
              </p>

              {/* Quick Search Input */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-800 w-full">
                    <Search className="w-5 h-5 text-[#022448]" />
                    <input
                      type="text"
                      placeholder="Search subject (e.g. Pure Mathematics, Physics)..."
                      className="w-full text-xs sm:text-sm font-medium bg-transparent outline-none placeholder:text-slate-400"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSearchQuery((e.target as HTMLInputElement).value);
                          onNavigate('tutors');
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onNavigate('tutors')}
                    className="w-full sm:w-auto px-6 py-3 bg-[#feae2c] text-[#022448] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#f09c13] transition-all shadow-md shrink-0"
                  >
                    Find Tutors
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Escrow Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#feae2c]" />
                  <span>OrangeMoney, Smega, MyZaka</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-300" />
                  <span>Verified Tutors</span>
                </div>
              </div>

            </div>

            {/* Right Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#1e3a5f] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#feae2c] text-[#022448] flex items-center justify-center font-bold text-xl">
                      98%
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Pass Improvement Rate</h3>
                      <p className="text-xs text-blue-200">BGCSE & Tertiary Exam Success</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold">
                    Verified Stats
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Award className="w-8 h-8 text-[#feae2c] shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-white">Vetted Educator Credentials</h4>
                      <p className="text-[11px] text-blue-200">All tutor degrees & Omang IDs verified by Admin before approval.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Lock className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-white">Safe Mobile Escrow</h4>
                      <p className="text-[11px] text-blue-200">Pay safely using your local mobile wallet. Tutor is paid upon session completion.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-3 bg-[#feae2c] text-[#022448] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#f09c13] transition-all text-center flex items-center justify-center gap-2"
                  >
                    Join LearnLink Today <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#022448] uppercase tracking-wider">Curriculum Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#022448] mt-1">Explore Subjects</h2>
          </div>
          <button
            onClick={() => onNavigate('tutors')}
            className="mt-3 md:mt-0 text-xs font-bold text-[#022448] hover:underline flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {SUBJECT_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleSubjectClick(cat.name)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#022448]/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#022448] flex items-center justify-center font-bold mb-3 group-hover:bg-[#022448] group-hover:text-[#feae2c] transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#022448] group-hover:text-blue-900">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Tutors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#022448] uppercase tracking-wider">Top Rated Educators</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#022448] mt-1">Featured Botswana Tutors</h2>
          </div>
          <button
            onClick={() => onNavigate('tutors')}
            className="mt-3 md:mt-0 px-4 py-2 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f]"
          >
            Browse Directory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutors.slice(0, 3).map(tutor => (
            <div
              key={tutor.id}
              onClick={() => onSelectTutor(tutor.id)}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all p-6 cursor-pointer space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatarUrl}
                      alt={tutor.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#022448]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-[#022448]">{tutor.fullName}</h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{tutor.university}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#feae2c] text-[#feae2c]" /> {tutor.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {tutor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-[#022448] text-[10px] font-bold rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hourly Rate</span>
                  <span className="text-lg font-black text-[#022448]">P{tutor.hourlyRatePula}/hr</span>
                </div>

                <button className="px-4 py-2 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl hover:bg-[#f09c13]">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Escrow Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#022448] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="px-3 py-1 bg-white/10 text-[#feae2c] text-xs font-bold rounded-full border border-white/10 uppercase tracking-wider">
              100% Risk Free
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">How LearnLink Escrow Works</h2>
            <p className="text-xs sm:text-sm text-blue-200">
              We eliminate upfront risk for students and guarantee payout security for tutors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#feae2c] text-[#022448] font-bold flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-white">Book & Pay into Escrow</h3>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Choose a verified tutor and authorize payment via OrangeMoney, Smega, or MyZaka. Funds are safely held in LearnLink Escrow.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#feae2c] text-[#022448] font-bold flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-white">Attend 1-on-1 Lesson</h3>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Meet online via secure video call or in-person at an agreed study location in Gaborone, Francistown, or Maun.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#feae2c] text-[#022448] font-bold flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-white">Release Escrow & Review</h3>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Upon session completion, escrow funds are released to the tutor (85% net payout), and you leave a star review.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
