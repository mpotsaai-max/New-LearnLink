import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  MapPin,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BOTSWANA_LOCATIONS, ACADEMIC_LEVELS } from '../data/initialData';

interface TutorDirectoryViewProps {
  onSelectTutor: (tutorId: string) => void;
}

export const TutorDirectoryView: React.FC<TutorDirectoryViewProps> = ({ onSelectTutor }) => {
  const { users } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedLevel,
    setSelectedLevel,
    selectedLocation,
    setSelectedLocation,
    priceRange,
    setPriceRange
  } = useApp();

  const [sortOption, setSortOption] = React.useState<'rating' | 'price_low' | 'price_high' | 'reviews'>('rating');

  // Filter tutors
  const tutors = users.filter(u => u.role === 'tutor' && u.isVerifiedTutor);

  const filteredTutors = tutors.filter(t => {
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.fullName.toLowerCase().includes(q);
      const matchSubj = t.subjects?.some(s => s.toLowerCase().includes(q));
      const matchUni = t.university?.toLowerCase().includes(q);
      if (!matchName && !matchSubj && !matchUni) return false;
    }

    // Subject Filter
    if (selectedSubject !== 'All Subjects') {
      if (!t.subjects?.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()))) {
        return false;
      }
    }

    // Academic Level Filter
    if (selectedLevel !== 'All Academic Levels') {
      if (!t.academicLevels?.some(l => l.toLowerCase().includes(selectedLevel.toLowerCase()))) {
        return false;
      }
    }

    // Location Filter
    if (selectedLocation !== 'All Locations') {
      if (!t.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
    }

    // Price Filter
    if (t.hourlyRatePula && t.hourlyRatePula > priceRange) {
      return false;
    }

    return true;
  });

  // Sort
  filteredTutors.sort((a, b) => {
    if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortOption === 'price_low') return (a.hourlyRatePula || 0) - (b.hourlyRatePula || 0);
    if (sortOption === 'price_high') return (b.hourlyRatePula || 0) - (a.hourlyRatePula || 0);
    if (sortOption === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
    return 0;
  });

  const subjectsList = [
    'All Subjects',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English Literature',
    'Financial Accounting',
    'Setswana'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#022448] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div>
          <span className="px-3 py-1 bg-white/10 text-[#feae2c] text-xs font-bold rounded-full border border-white/10">
            BOTSWANA TUTOR DIRECTORY
          </span>
          <h1 className="text-3xl font-extrabold mt-2">Find Your Perfect Verified Tutor</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Browse top vetted educators across Botswana. Filter by subject, level, location, and rate.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center min-w-[180px]">
          <span className="text-3xl font-black text-[#feae2c]">{filteredTutors.length}</span>
          <span className="text-xs text-blue-100 block">Available Tutors</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#022448] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#feae2c]" /> Filter Tutors
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All Subjects');
                  setSelectedLevel('All Academic Levels');
                  setSelectedLocation('All Locations');
                  setPriceRange(300);
                }}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Keywords</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tutor name or keyword..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                />
              </div>
            </div>

            {/* Subjects Pill List */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Subject Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {subjectsList.map((subj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubject(subj)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedSubject === subj
                        ? 'bg-[#022448] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{subj}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Level</label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white outline-none"
              >
                {ACADEMIC_LEVELS.map((lvl, idx) => (
                  <option key={idx} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white outline-none"
              >
                {BOTSWANA_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Max Hourly Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Max Hourly Rate</label>
                <span className="text-xs font-black text-[#022448]">P{priceRange}/hr</span>
              </div>
              <input
                type="range"
                min={80}
                max={300}
                step={10}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#022448]"
              />
            </div>

          </div>
        </div>

        {/* Right Directory Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#022448]">{filteredTutors.length}</strong> verified tutors
            </span>

            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-700">Sort by:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                className="p-2 border border-slate-200 rounded-xl bg-white font-semibold outline-none text-xs"
              >
                <option value="rating">Highest Rating ⭐</option>
                <option value="reviews">Most Reviews</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Tutors Grid */}
          {filteredTutors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-lg text-[#022448]">No Tutors Match Your Filter Criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query, increasing your price range, or selecting &quot;All Subjects&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All Subjects');
                  setSelectedLevel('All Academic Levels');
                  setSelectedLocation('All Locations');
                  setPriceRange(300);
                }}
                className="px-4 py-2 bg-[#022448] text-white font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTutors.map(tutor => (
                <div
                  key={tutor.id}
                  onClick={() => onSelectTutor(tutor.id)}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all p-6 cursor-pointer space-y-4 flex flex-col justify-between"
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

                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#feae2c] text-[#feae2c]" /> {tutor.rating} ({tutor.reviewCount})
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

                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tutor.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                      <span className="text-lg font-black text-[#022448]">P{tutor.hourlyRatePula}/hr</span>
                    </div>

                    <button className="px-4 py-2 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl hover:bg-[#f09c13] shadow-md">
                      View Profile & Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
