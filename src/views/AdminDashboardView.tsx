import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  DollarSign,
  FileText,
  UserCheck,
  UserX,
  Lock,
  Sparkles,
  Smartphone,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { users, updateUserProfile } = useAuth();
  const {
    transactions,
    approveTutorVerification,
    rejectTutorVerification,
    suspendUserAccount,
    activateUserAccount
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'financials'>('verifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocsModalUser, setSelectedDocsModalUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete degree documentation');

  const pendingTutors = users.filter(u => u.role === 'tutor' && (u.status === 'pending_verification' || !u.isVerifiedTutor));
  const allTutors = users.filter(u => u.role === 'tutor');
  const allStudents = users.filter(u => u.role === 'student');

  const totalPlatformVolumePula = transactions.reduce((acc, t) => acc + t.amountPula, 0);
  const totalPlatformFeePula = transactions.reduce((acc, t) => acc + t.platformFeePula, 0);

  const filteredUsers = users.filter(u => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phoneNumber.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#022448] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> SYSTEM ADMIN CONTROL PORTAL
          </div>
          <h1 className="text-3xl font-extrabold text-white">LearnLink Governance & Auditing</h1>
          <p className="text-xs text-blue-200">
            Tutor verification workflow, user role management, and Mobile Money Escrow financial tracking.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[130px]">
            <span className="text-2xl font-black text-[#feae2c]">{pendingTutors.length}</span>
            <span className="text-[10px] text-blue-100 block">Pending Vetting</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center min-w-[140px]">
            <span className="text-2xl font-black text-emerald-400">P{totalPlatformFeePula.toFixed(0)}</span>
            <span className="text-[10px] text-blue-100 block">15% Revenue (Pula)</span>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 font-bold flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Platform Users</span>
            <span className="text-2xl font-black text-[#022448]">{users.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#feae2c]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified Educators</span>
            <span className="text-2xl font-black text-[#022448]">{allTutors.filter(t => t.isVerifiedTutor).length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#022448] font-bold flex items-center justify-center">
            <Users className="w-6 h-6 text-[#022448]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Students</span>
            <span className="text-2xl font-black text-[#022448]">{allStudents.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-900 font-bold flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Escrow Volume</span>
            <span className="text-2xl font-black text-[#022448]">P{totalPlatformVolumePula.toFixed(0)}</span>
          </div>
        </div>

      </div>

      {/* Main Control Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        
        <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'verifications'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-600" /> Pending Tutor Approvals ({pendingTutors.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> User Account Management ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'financials'
                ? 'border-[#022448] text-[#022448]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" /> Escrow Financial Audit ({transactions.length})
          </button>
        </div>

        {/* Tab 1: Pending Tutor Verifications */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            {pendingTutors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p>All tutor verification applications have been reviewed!</p>
              </div>
            ) : (
              pendingTutors.map(tutor => (
                <div
                  key={tutor.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tutor.avatarUrl}
                      alt={tutor.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#022448]"
                    />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#022448]">{tutor.fullName}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                          Pending Approval
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Institution: {tutor.university} • Qualification: {tutor.qualifications}
                      </p>

                      <p className="text-xs text-slate-500">
                        Email: {tutor.email} • Mobile: {tutor.phoneNumber} • Rate: P{tutor.hourlyRatePula}/hr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedDocsModalUser(tutor)}
                      className="px-3.5 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4 text-[#022448]" /> Review Docs
                    </button>

                    <button
                      onClick={() => approveTutorVerification(tutor.id)}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Tutor
                    </button>

                    <button
                      onClick={() => rejectTutorVerification(tutor.id, rejectionReason)}
                      className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 flex items-center gap-1 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: User Account Management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter users by name, email, or phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                />
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {filteredUsers.length} total user accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#022448] text-white">
                    <th className="p-3 rounded-tl-xl font-bold">User</th>
                    <th className="p-3 font-bold">Role</th>
                    <th className="p-3 font-bold">Contact</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold">Joined Date</th>
                    <th className="p-3 rounded-tr-xl font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-100">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300"
                          />
                          <div>
                            <span className="font-bold text-[#022448] block">{u.fullName}</span>
                            <span className="text-[10px] text-slate-400">{u.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'tutor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-3 font-mono">
                        <div>{u.email}</div>
                        <div className="text-[10px] text-slate-500">{u.phoneNumber}</div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="p-3 text-slate-500">{u.joinedDate}</td>

                      <td className="p-3 text-right">
                        {u.role !== 'admin' && (
                          u.status === 'active' ? (
                            <button
                              onClick={() => suspendUserAccount(u.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 font-bold text-[11px] rounded-lg hover:bg-red-200"
                            >
                              Suspend Account
                            </button>
                          ) : (
                            <button
                              onClick={() => activateUserAccount(u.id)}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-lg hover:bg-emerald-200"
                            >
                              Reactivate
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Escrow Financial Audit */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <span className="text-xs text-orange-900 font-bold uppercase">OrangeMoney Escrow</span>
                <p className="text-xl font-black text-orange-950 mt-1">
                  P{transactions.filter(t => t.paymentMethod === 'OrangeMoney').reduce((acc, t) => acc + t.amountPula, 0)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-xs text-blue-900 font-bold uppercase">Smega Escrow</span>
                <p className="text-xl font-black text-blue-950 mt-1">
                  P{transactions.filter(t => t.paymentMethod === 'Smega').reduce((acc, t) => acc + t.amountPula, 0)}
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs text-emerald-900 font-bold uppercase">MyZaka Escrow</span>
                <p className="text-xl font-black text-emerald-950 mt-1">
                  P{transactions.filter(t => t.paymentMethod === 'MyZaka').reduce((acc, t) => acc + t.amountPula, 0)}
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#022448] text-white">
                  <th className="p-3 rounded-tl-xl font-bold">Transaction Ref</th>
                  <th className="p-3 font-bold">Student</th>
                  <th className="p-3 font-bold">Tutor</th>
                  <th className="p-3 font-bold">Amount (Pula)</th>
                  <th className="p-3 font-bold">Platform Fee (15%)</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 rounded-tr-xl font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-100">
                    <td className="p-3 font-mono font-bold text-[#022448]">{t.transactionRef}</td>
                    <td className="p-3 font-semibold">{t.studentName}</td>
                    <td className="p-3 font-semibold">{t.tutorName}</td>
                    <td className="p-3 font-black text-[#022448]">P{t.amountPula}.00</td>
                    <td className="p-3 font-bold text-emerald-700">P{t.platformFeePula.toFixed(2)}</td>
                    <td className="p-3 font-semibold">{t.status}</td>
                    <td className="p-3 text-slate-400">{t.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Review Qualification Docs Modal */}
      {selectedDocsModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-xl text-[#022448]">Applicant Academic Review</h3>
                <p className="text-xs text-slate-500">
                  Reviewing application documents for <strong>{selectedDocsModalUser.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedDocsModalUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Application Overview Box */}
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Course / Program:</span>
                <span className="font-bold text-[#022448]">{selectedDocsModalUser.courseOrMajor || selectedDocsModalUser.qualifications || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Institution:</span>
                <span className="font-bold text-[#022448]">{selectedDocsModalUser.collegeOrUniversity || selectedDocsModalUser.university || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Experience:</span>
                <span className="font-bold text-[#022448]">{selectedDocsModalUser.yearsOfExperience || 'Specified in CV'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Initial Approval Rating:</span>
                <span className="font-black text-amber-600">⭐ 0.0 (New Tutor)</span>
              </div>
            </div>

            {/* Document Attachments List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Uploaded Vetting Files:</span>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#022448]" />
                  <span className="font-mono font-medium text-slate-800">
                    {selectedDocsModalUser.omangIdDocUrl ? `National ID / Omang: ${selectedDocsModalUser.omangIdDocUrl}` : selectedDocsModalUser.verificationDocs?.[0] || 'National_Omang_ID.pdf'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PDF / Image</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#022448]" />
                  <span className="font-mono font-medium text-slate-800">
                    {selectedDocsModalUser.academicRecordDocUrl ? `Academic Record: ${selectedDocsModalUser.academicRecordDocUrl}` : selectedDocsModalUser.verificationDocs?.[1] || 'Academic_Transcripts.pdf'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PDF / Image</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#022448]" />
                  <span className="font-mono font-medium text-slate-800">
                    {selectedDocsModalUser.resumeDocUrl ? `Resume / CV: ${selectedDocsModalUser.resumeDocUrl}` : selectedDocsModalUser.verificationDocs?.[2] || 'Resume_Curriculum_Vitae.pdf'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PDF / Doc</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  approveTutorVerification(selectedDocsModalUser.id);
                  setSelectedDocsModalUser(null);
                }}
                className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Applicant Credentials
              </button>
              <button
                onClick={() => setSelectedDocsModalUser(null)}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
