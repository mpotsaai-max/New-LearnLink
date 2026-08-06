import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Video,
  MessageSquare,
  Award,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const TutorDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const { sessions, transactions, updateSessionStatus, completeSessionAndReleaseEscrow, setActiveChatUser } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'schedule' | 'earnings'>('requests');

  if (!currentUser || currentUser.role !== 'tutor') return null;

  const isVerified = currentUser.isVerifiedTutor;
  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);

  const pendingRequests = mySessions.filter(s => s.status === 'pending');
  const acceptedSessions = mySessions.filter(s => s.status === 'accepted');
  const completedSessions = mySessions.filter(s => s.status === 'completed');

  const myTx = transactions.filter(t => t.tutorId === currentUser.id);
  const totalNetEarnings = myTx.reduce((acc, t) => t.status === 'released_to_tutor' ? acc + t.tutorPayoutPula : acc, 0);
  const totalPendingEscrow = myTx.reduce((acc, t) => t.status === 'escrow_held' ? acc + t.tutorPayoutPula : acc, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Verification Alert Banner if unverified */}
      {!isVerified && (
        <div className="p-5 bg-amber-500/10 border-2 border-amber-500 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base text-amber-950">Tutor Profile Pending Admin Verification</h3>
              <p className="text-xs text-amber-900 mt-0.5">
                Your credentials are under review by LearnLink Admin. Once approved, your Verified Badge will be activated and you can accept booking requests.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full shrink-0">
            Pending Review
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#022448] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#feae2c]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentUser.fullName}</h1>
              {isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Tutor
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {currentUser.university} • {currentUser.qualifications} • Rate: P{currentUser.hourlyRatePula}/hr
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[140px]">
            <span className="text-2xl font-black text-[#feae2c]">P{totalNetEarnings.toFixed(0)}</span>
            <span className="text-[10px] text-blue-100 block">Net Paid (85%)</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[140px]">
            <span className="text-2xl font-black text-emerald-400">P{totalPendingEscrow.toFixed(0)}</span>
            <span className="text-[10px] text-blue-100 block">Held in Escrow</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#feae2c]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Requests</span>
            <span className="text-2xl font-black text-[#022448]">{pendingRequests.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#022448] font-bold flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#022448]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Confirmed Sessions</span>
            <span className="text-2xl font-black text-[#022448]">{acceptedSessions.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-900 font-bold flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Sessions</span>
            <span className="text-2xl font-black text-[#022448]">{completedSessions.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 font-bold flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating Score</span>
            <span className="text-2xl font-black text-[#022448]">⭐ {currentUser.rating || 5.0}</span>
          </div>
        </div>

      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        
        <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" /> Pending Requests ({pendingRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" /> Confirmed Sessions ({acceptedSessions.length})
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'earnings'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" /> Earnings & Escrow Payouts
          </button>
        </div>

        {/* Tab 1: Pending Booking Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No pending student booking requests.</p>
            ) : (
              pendingRequests.map(req => (
                <div
                  key={req.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#022448]">{req.subject}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 uppercase">
                        Escrow P{req.pricePula} Held
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Student: <strong>{req.studentName}</strong> ({req.studentEmail} • {req.studentPhone})
                    </p>

                    <p className="text-xs text-slate-500">
                      Date & Time: <strong>{req.date} at {req.time}</strong> • Mode: {req.meetingMode}
                    </p>

                    {req.notes && (
                      <p className="text-xs text-slate-500 bg-white p-2 rounded-xl border border-slate-200 italic mt-1">
                        &quot;{req.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {isVerified ? (
                      <>
                        <button
                          onClick={() => updateSessionStatus(req.id, 'accepted')}
                          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Accept Request
                        </button>
                        <button
                          onClick={() => updateSessionStatus(req.id, 'declined')}
                          className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 flex items-center gap-1 shadow-sm"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 font-bold">
                        Verification Required
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Confirmed Sessions Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {acceptedSessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No active confirmed sessions scheduled.</p>
            ) : (
              acceptedSessions.map(session => (
                <div
                  key={session.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#022448]">{session.subject}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 uppercase">
                        Confirmed Lesson
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Student: <strong>{session.studentName}</strong> • Scheduled: <strong>{session.date} ({session.time})</strong>
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Escrow Vault: P{session.pricePula} held • Your Payout (85%): P{(session.pricePula * 0.85).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {session.videoCallUrl && (
                      <a
                        href={session.videoCallUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4 text-[#feae2c]" /> Open Video Room
                      </a>
                    )}

                    <button
                      onClick={() => completeSessionAndReleaseEscrow(session.id)}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Completed & Release Escrow
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Earnings & Escrow Breakdown */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
              <div>
                <strong className="font-bold">Platform Fee Structure:</strong> LearnLink charges a standard 15% platform commission on completed sessions for software infrastructure, video hosting, and mobile money gateway processing. Tutors receive 85% net payout.
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#022448] text-white">
                  <th className="p-3 rounded-tl-xl font-bold">Transaction Ref</th>
                  <th className="p-3 font-bold">Student Name</th>
                  <th className="p-3 font-bold">Total Session Price</th>
                  <th className="p-3 font-bold">Platform Fee (15%)</th>
                  <th className="p-3 font-bold">Your Net Payout (85%)</th>
                  <th className="p-3 rounded-tr-xl font-bold">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-slate-50">
                {myTx.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">No earnings logged yet.</td>
                  </tr>
                ) : (
                  myTx.map(t => (
                    <tr key={t.id} className="hover:bg-slate-100">
                      <td className="p-3 font-mono font-bold text-[#022448]">{t.transactionRef}</td>
                      <td className="p-3 font-semibold">{t.studentName}</td>
                      <td className="p-3 font-semibold">P{t.amountPula}.00</td>
                      <td className="p-3 text-red-600 font-semibold">-P{t.platformFeePula.toFixed(2)}</td>
                      <td className="p-3 font-black text-emerald-700">P{t.tutorPayoutPula.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'released_to_tutor'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {t.status === 'released_to_tutor' ? 'Paid Out' : 'Held in Escrow'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
