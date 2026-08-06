import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  MessageSquare,
  Lock,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { PaymentModal } from '../components/PaymentModal';

interface TutorProfileViewProps {
  tutorId: string;
  onBack: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const TutorProfileView: React.FC<TutorProfileViewProps> = ({ tutorId, onBack, onOpenAuth }) => {
  const { users, currentUser } = useAuth();
  const { reviews, setActiveChatUser } = useApp();

  const tutor = users.find(u => u.id === tutorId) || users.find(u => u.role === 'tutor');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(tutor?.subjects?.[0] || 'Mathematics');

  if (!tutor) return null;

  const tutorReviews = reviews.filter(r => r.tutorId === tutor.id);

  // 7-day interactive schedule slots
  const scheduleDays = [
    { day: 'Mon, 10 Aug', slots: ['09:00 AM', '11:00 AM', '15:00 PM', '17:00 PM'] },
    { day: 'Tue, 11 Aug', slots: ['10:00 AM', '14:00 PM', '16:00 PM'] },
    { day: 'Wed, 12 Aug', slots: ['09:00 AM', '11:00 AM', '15:00 PM'] },
    { day: 'Thu, 13 Aug', slots: ['10:00 AM', '13:00 PM', '17:00 PM'] },
    { day: 'Fri, 14 Aug', slots: ['09:00 AM', '15:00 PM'] },
    { day: 'Sat, 15 Aug', slots: ['08:00 AM', '10:00 AM', '14:00 PM', '16:00 PM'] }
  ];

  const handleBookClick = () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleChatClick = () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    setActiveChatUser({ id: tutor.id, name: tutor.fullName, avatar: tutor.avatarUrl });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#022448] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tutor Directory
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={tutor.avatarUrl}
              alt={tutor.fullName}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-[#022448] shadow-lg"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#022448]">{tutor.fullName}</h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Educator
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#022448]" /> {tutor.qualifications}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {tutor.location}
                </span>
                <span className="flex items-center gap-1 text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-[#feae2c] text-[#feae2c]" /> {tutor.rating} ({tutor.reviewCount} Reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center w-full md:w-auto min-w-[220px] space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hourly Rate</span>
              <span className="text-3xl font-black text-[#022448]">P{tutor.hourlyRatePula}.00</span>
              <span className="text-[10px] text-emerald-600 font-bold block">100% Escrow Protected</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleBookClick}
                className="w-full py-3 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl shadow-md hover:bg-[#f09c13] transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Book Session with Escrow
              </button>

              <button
                onClick={handleChatClick}
                className="w-full py-2.5 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#feae2c]" /> Direct Message Tutor
              </button>
            </div>
          </div>

        </div>

        {/* Bio */}
        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h3 className="font-bold text-sm text-[#022448]">About {tutor.fullName}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {tutor.bio}
          </p>
        </div>

        {/* Subjects & Credentials Badges */}
        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-xs text-[#022448] uppercase tracking-wider mb-2">Teaching Subjects</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects?.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubject === s
                      ? 'bg-[#022448] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#022448] uppercase tracking-wider mb-2">Verified Documents</h4>
            <div className="space-y-1.5">
              {tutor.verificationDocs?.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Monthly Packages Comparison */}
      {tutor.packages && tutor.packages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#022448]">Discounted Session Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutor.packages.map(pkg => (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm relative flex flex-col justify-between space-y-4 ${
                  pkg.isBestValue ? 'border-[#feae2c] ring-2 ring-[#feae2c]/30' : 'border-slate-200'
                }`}
              >
                {pkg.isBestValue && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 bg-[#feae2c] text-[#022448] text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[#022448]">{pkg.name}</h3>
                  <p className="text-xs text-slate-500">{pkg.sessionCount} 1-on-1 Sessions ({pkg.sessionCount * 1.5} total hours)</p>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-[#022448]">P{pkg.pricePula}.00</span>
                    {pkg.savingsPula && (
                      <span className="ml-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        Save P{pkg.savingsPula}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleBookClick}
                  className="w-full py-2.5 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f]"
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Interactive Availability Calendar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#022448]">Upcoming Availability Schedule</h2>
            <p className="text-xs text-slate-500">Select a slot to request a 1-on-1 session</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#022448] text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#feae2c]" /> 7-Day View
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {scheduleDays.map((dayObj, i) => (
            <div key={i} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-center">
              <span className="text-xs font-bold text-[#022448] block">{dayObj.day}</span>
              <div className="space-y-1.5 pt-1">
                {dayObj.slots.map((slot, j) => (
                  <button
                    key={j}
                    onClick={handleBookClick}
                    className="w-full py-1.5 px-2 bg-white text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-[#022448] hover:text-white transition-all shadow-xs"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-[#022448]">Student Reviews & Ratings</h2>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#feae2c] text-[#feae2c]" /> {tutor.rating} average rating
          </span>
        </div>

        <div className="space-y-4">
          {tutorReviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No reviews submitted yet for this tutor.</p>
          ) : (
            tutorReviews.map(rev => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={rev.studentName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#022448]">{rev.studentName}</span>
                      <span className="text-[10px] text-slate-400 block">{rev.subject} student • {rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#feae2c] text-[#feae2c]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          tutorId={tutor.id}
          tutorName={tutor.fullName}
          tutorAvatar={tutor.avatarUrl}
          subject={selectedSubject}
          academicLevel="Secondary (BGCSE/IGCSE)"
          hourlyRatePula={tutor.hourlyRatePula || 180}
          onSuccess={() => {}}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}

    </div>
  );
};
