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
  Lock,
  Camera,
  Edit3,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const TutorDashboardView: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { sessions, transactions, updateSessionStatus, completeSessionAndReleaseEscrow, setActiveChatUser, setActiveDailySession } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'schedule' | 'earnings' | 'profile'>('requests');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState('');

  if (!currentUser || currentUser.role !== 'tutor') return null;

  const isVerified = currentUser.isVerifiedTutor;
  const mySessions = sessions.filter(s => s.tutorId === currentUser.id);

  const pendingRequests = mySessions.filter(s => s.status === 'pending');
  const acceptedSessions = mySessions.filter(s => s.status === 'accepted');
  const completedSessions = mySessions.filter(s => s.status === 'completed');

  const myTx = transactions.filter(t => t.tutorId === currentUser.id);
  const totalNetEarnings = myTx.reduce((acc, t) => t.status === 'released_to_tutor' ? acc + t.tutorPayoutPula : acc, 0);
  const totalPendingEscrow = myTx.reduce((acc, t) => t.status === 'escrow_held' ? acc + t.tutorPayoutPula : acc, 0);

  const handleSaveAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return;
    if (newAvatarUrl.trim()) {
      updateUserProfile(currentUser.id, { avatarUrl: newAvatarUrl.trim() });
      setAvatarSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => {
        setShowAvatarModal(false);
        setAvatarSuccessMsg('');
      }, 1500);
    }
  };

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
                Your credentials and uploaded documents are under review by LearnLink Admin. Profile picture editing and session bookings will be enabled upon account approval.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full shrink-0">
            Pending Review
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#022448] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 relative">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#feae2c]"
            />
            {isVerified ? (
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#feae2c] text-[#022448] rounded-xl hover:bg-white transition-all shadow-md"
                title="Change Profile Picture (Approved)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div
                className="absolute -bottom-1 -right-1 p-1 bg-slate-700 text-slate-300 rounded-lg cursor-not-allowed"
                title="Profile picture update locked until approval"
              >
                <Lock className="w-3 h-3" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentUser.fullName}</h1>
              {isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Tutor
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Unverified (Pending)
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {currentUser.collegeOrUniversity || currentUser.university} • {currentUser.courseOrMajor || currentUser.qualifications} • Rate: P{currentUser.hourlyRatePula}/hr
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {isVerified && (
            <button
              onClick={() => setShowAvatarModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-[#feae2c]" /> Edit Profile Picture
            </button>
          )}

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[130px]">
            <span className="text-xl font-black text-[#feae2c]">P{totalNetEarnings.toFixed(0)}</span>
            <span className="text-[10px] text-blue-100 block">Net Paid (85%)</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[130px]">
            <span className="text-xl font-black text-emerald-400">P{totalPendingEscrow.toFixed(0)}</span>
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
                      <button
                        onClick={() => setActiveDailySession({
                          sessionId: session.id,
                          subject: session.subject,
                          tutorName: session.tutorName,
                          studentName: session.studentName,
                          videoCallUrl: session.videoCallUrl,
                          pricePula: session.pricePula
                        })}
                        className="px-3.5 py-2 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] flex items-center gap-1.5 shadow-md transition-transform hover:scale-[1.02]"
                      >
                        <Video className="w-4 h-4 text-[#feae2c]" /> Launch Daily.co Room
                      </button>
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

      {/* Edit Profile Picture Modal (Allowed only for approved tutors) */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#022448] mx-auto flex items-center justify-center">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-[#022448]">Update Profile Picture</h3>
              <p className="text-xs text-slate-500">
                As a verified tutor, you can update your headshot avatar image for student visibility.
              </p>
            </div>

            <form onSubmit={handleSaveAvatar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL / Unsplash Link</label>
                <input
                  type="url"
                  value={newAvatarUrl}
                  onChange={e => setNewAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                  required
                />
              </div>

              {/* Sample Avatar Selection Options */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2">Or Choose a Preset Educator Avatar:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
                  ].map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      onClick={() => setNewAvatarUrl(url)}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                        newAvatarUrl === url ? 'border-[#feae2c] ring-2 ring-[#feae2c]/50 scale-105' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {avatarSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{avatarSuccessMsg}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#033466] shadow-md"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
