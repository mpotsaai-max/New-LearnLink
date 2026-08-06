import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ArrowRight, GraduationCap, Upload, FileText, Award, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
  onOpenTermsModal?: (tab?: 'general' | 'fee' | 'tutor' | 'privacy') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess, onOpenTermsModal }) => {
  const { login, register, verifyStudentEmail, switchDemoUser, isEmailTaken, isPhoneTaken } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+267 71 ');
  const [password, setPassword] = useState('');

  // Tutor Specific Fields - Strictly NOT auto-filled
  const [courseOrMajor, setCourseOrMajor] = useState('');
  const [collegeOrUniversity, setCollegeOrUniversity] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState(160);
  const [location, setLocation] = useState('Gaborone');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // Tutor Document Attachments
  const [omangDocName, setOmangDocName] = useState('');
  const [academicDocName, setAcademicDocName] = useState('');
  const [resumeDocName, setResumeDocName] = useState('');

  // Student Email Verification Flow
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [unverifiedStudentEmail, setUnverifiedStudentEmail] = useState('');
  const [pinCode, setPinCode] = useState('784920'); // Simulated 6-digit PIN

  // Terms & Conditions Acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDemoSignIn = (targetRole: UserRole) => {
    switchDemoUser(targetRole);
    onSuccess();
    onClose();
  };

  const handleVerifyStudentCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!pinCode.trim() || pinCode.trim().length < 4) {
      setErrorMessage('Please enter a valid verification PIN.');
      return;
    }

    const res = verifyStudentEmail(unverifiedStudentEmail);
    if (res.success) {
      setSuccessMessage('Email verified successfully! Logging you in...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Failed to verify email address.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      const res = login(email, password);
      if (res.success) {
        onSuccess();
        onClose();
      } else if (res.requiresEmailVerification && res.unverifiedUser) {
        setUnverifiedStudentEmail(res.unverifiedUser.email);
        setShowVerificationStep(true);
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } else if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
        setErrorMessage('Please complete all required contact fields.');
        return;
      }

      // Mandatory Terms & Conditions Check
      if (!acceptedTerms) {
        setErrorMessage(
          role === 'tutor'
            ? 'You must accept the LearnLink Terms of Service and 15% Platform Fee agreement to register.'
            : 'You must accept LearnLink Terms of Service to complete registration.'
        );
        return;
      }

      // Live validation checks for duplicate email / phone
      if (isEmailTaken(email)) {
        setErrorMessage('This email address is already registered on LearnLink.');
        return;
      }
      if (isPhoneTaken(phoneNumber)) {
        setErrorMessage('This mobile phone number is already registered on LearnLink.');
        return;
      }

      // Tutor Specific Validation
      if (role === 'tutor') {
        if (!courseOrMajor.trim()) {
          setErrorMessage('Please type your Course / Major degree program.');
          return;
        }
        if (!collegeOrUniversity.trim()) {
          setErrorMessage('Please type your College / University / Institution name.');
          return;
        }
        if (!yearsOfExperience.trim()) {
          setErrorMessage('Please specify your tutoring or teaching experience.');
          return;
        }
        if (!omangDocName.trim() || !academicDocName.trim() || !resumeDocName.trim()) {
          setErrorMessage('Please upload all 3 required documents (National ID/Omang, Academic Record/Transcript, and Resume/CV).');
          return;
        }
      }

      const res = register({
        fullName,
        email,
        phoneNumber,
        role,
        courseOrMajor: role === 'tutor' ? courseOrMajor : undefined,
        collegeOrUniversity: role === 'tutor' ? collegeOrUniversity : undefined,
        university: role === 'tutor' ? collegeOrUniversity : undefined,
        qualifications: role === 'tutor' ? courseOrMajor : undefined,
        yearsOfExperience: role === 'tutor' ? yearsOfExperience : undefined,
        bio: role === 'tutor' ? `${yearsOfExperience} of experience teaching ${selectedSubject} (${courseOrMajor} graduate from ${collegeOrUniversity}).` : undefined,
        subjects: role === 'tutor' ? [selectedSubject] : undefined,
        academicLevels: role === 'tutor' ? ['Secondary (BGCSE/IGCSE)', 'Tertiary/University'] : undefined,
        hourlyRatePula: role === 'tutor' ? Number(hourlyRate) : undefined,
        location: role === 'tutor' ? location : undefined,
        omangIdDocUrl: omangDocName,
        academicRecordDocUrl: academicDocName,
        resumeDocUrl: resumeDocName
      });

      if (res.success) {
        if (role === 'tutor') {
          setSuccessMessage('Application submitted! Your credentials and uploaded documents are under review by LearnLink Admin. Tutors cannot log in until approved.');
          setTimeout(() => {
            setMode('login');
            setSuccessMessage('');
          }, 4000);
        } else {
          // Student requires email verification code step
          setUnverifiedStudentEmail(email);
          setShowVerificationStep(true);
        }
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else if (mode === 'forgot') {
      setSuccessMessage(`Password reset link sent to ${email}`);
      setTimeout(() => setMode('login'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Email Verification Step Screen */}
        {showVerificationStep ? (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center font-bold">
              <Mail className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-2xl text-[#022448]">Verify Student Email</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Enter the 6-digit activation code sent to <strong className="text-slate-800">{unverifiedStudentEmail}</strong> to activate your student account.
              </p>
            </div>

            <form onSubmit={handleVerifyStudentCode} className="space-y-4 max-w-xs mx-auto">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">6-Digit Verification PIN</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value)}
                  placeholder="784920"
                  className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2.5 border-2 border-emerald-200 rounded-xl focus:border-[#022448] outline-none"
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 text-left">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#033466] transition-all shadow-md flex items-center justify-center gap-2"
              >
                Verify Email & Log In
                <ArrowRight className="w-4 h-4 text-[#feae2c]" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowVerificationStep(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
            >
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#022448] text-[#feae2c] mx-auto flex items-center justify-center mb-3 font-bold">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-2xl text-[#022448]">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join LearnLink' : 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Enter your credentials to access your portal'
                  : mode === 'register'
                  ? 'Connect with Botswana’s top verified tutors and students'
                  : 'Enter your email to receive recovery instructions'}
              </p>
            </div>

            {/* Quick Demo Credentials Banner in Login Mode */}
            {mode === 'login' && (
              <div className="mb-5 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <span className="text-[11px] font-bold text-[#022448] block mb-2 text-center">
                  ⚡ Instant Demo Sign-In (Select Role):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('student')}
                    className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-xl shadow-xs transition-all text-center"
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('tutor')}
                    className="py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold rounded-xl shadow-xs transition-all text-center"
                  >
                    👨‍🏫 Tutor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('admin')}
                    className="py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold rounded-xl shadow-xs transition-all text-center"
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>
            )}

            {/* Role Toggle for Register Mode */}
            {mode === 'register' && (
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    role === 'student'
                      ? 'bg-[#022448] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎓 I am a Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    role === 'tutor'
                      ? 'bg-[#022448] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  👨‍🏫 I want to Tutor
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Neo Modise"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.co.bw"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number (OrangeMoney/Smega/MyZaka)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+267 71 234 567"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none font-medium"
                      required
                    />
                  </div>
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Tutor Application Details & Document Uploads */}
              {mode === 'register' && role === 'tutor' && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-3 text-left">
                  <span className="text-[11px] font-extrabold uppercase text-[#022448] block border-b border-blue-200 pb-1">
                    📋 Tutor Application & Credentials Vetting
                  </span>
                  
                  {/* Course / Major */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Course / Major Program <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={courseOrMajor}
                        onChange={e => setCourseOrMajor(e.target.value)}
                        placeholder="e.g. BSc Pure Mathematics & Physics, BCom Accounting"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#022448] outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* College / University */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      College / University / Institution <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={collegeOrUniversity}
                        onChange={e => setCollegeOrUniversity(e.target.value)}
                        placeholder="e.g. University of Botswana, BIUST, BAC, Botho"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#022448] outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Tutoring / Teaching Experience <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={yearsOfExperience}
                        onChange={e => setYearsOfExperience(e.target.value)}
                        placeholder="e.g. 3 Years Tutoring Experience"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#022448] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Primary Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="English Literature">English Literature</option>
                        <option value="Financial Accounting">Financial Accounting</option>
                        <option value="Setswana">Setswana</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Hourly Rate (Pula)</label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(Number(e.target.value))}
                        className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* MANDATORY DOCUMENT UPLOADS */}
                  <div className="pt-2 border-t border-blue-200/80 space-y-2">
                    <span className="text-[10.5px] font-bold text-blue-950 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-800" /> Mandatory Credential Attachments (PDF or Image):
                    </span>

                    {/* Doc 1: National Omang ID / Passport */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <label className="block text-[10.5px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                        <span>1. National Omang ID or Passport <span className="text-red-500">*</span></span>
                        {omangDocName && <span className="text-[10px] font-bold text-emerald-600">✓ Attached</span>}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setOmangDocName(e.target.files?.[0]?.name || 'National_Omang_ID.pdf')}
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#022448] file:text-white hover:file:bg-[#033466] cursor-pointer"
                        required
                      />
                    </div>

                    {/* Doc 2: Academic Record / Transcripts */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <label className="block text-[10.5px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                        <span>2. Academic Record / Transcripts / Degree <span className="text-red-500">*</span></span>
                        {academicDocName && <span className="text-[10px] font-bold text-emerald-600">✓ Attached</span>}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setAcademicDocName(e.target.files?.[0]?.name || 'Academic_Record_Transcript.pdf')}
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#022448] file:text-white hover:file:bg-[#033466] cursor-pointer"
                        required
                      />
                    </div>

                    {/* Doc 3: Resume / Curriculum Vitae */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <label className="block text-[10.5px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                        <span>3. Resume / Curriculum Vitae (CV) <span className="text-red-500">*</span></span>
                        {resumeDocName && <span className="text-[10px] font-bold text-emerald-600">✓ Attached</span>}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,image/*,.doc,.docx"
                        onChange={(e) => setResumeDocName(e.target.files?.[0]?.name || 'Resume_Curriculum_Vitae.pdf')}
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#022448] file:text-white hover:file:bg-[#033466] cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* 15% Platform Fee Disclosure Box */}
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1">
                    <div className="font-bold flex items-center justify-between text-[#022448]">
                      <span>💼 LearnLink 15% Platform Commission:</span>
                      <button
                        type="button"
                        onClick={() => onOpenTermsModal?.('fee')}
                        className="text-amber-800 font-extrabold underline hover:text-amber-950 cursor-pointer"
                      >
                        Policy →
                      </button>
                    </div>
                    <div className="pt-1 border-t border-amber-200/80 flex items-center justify-between font-mono font-bold text-[11px]">
                      <span>Net Payout (85%):</span>
                      <span className="text-emerald-700 font-black text-xs">P{(hourlyRate * 0.85).toFixed(2)} / hr</span>
                    </div>
                  </div>

                </div>
              )}

              {/* Terms & Conditions Acceptance Checkbox */}
              {mode === 'register' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#022448] rounded border-slate-300 focus:ring-[#022448] cursor-pointer"
                      required
                    />
                    <span className="text-[11px] text-slate-700 leading-snug">
                      {role === 'tutor' ? (
                        <>
                          I accept LearnLink&apos;s <strong className="text-[#022448]">Tutor Terms of Service & Code of Conduct</strong> and agree to the mandatory <strong className="text-amber-800">15% platform commission</strong> deducted on session payouts.
                        </>
                      ) : (
                        <>
                          I agree to LearnLink&apos;s <strong className="text-[#022448]">Terms of Service</strong>, Privacy Policy, and <strong className="text-emerald-800">Mobile Money Escrow Protection Policy</strong>.
                        </>
                      )}
                    </span>
                  </label>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => onOpenTermsModal?.(role === 'tutor' ? 'tutor' : 'general')}
                      className="text-[10.5px] text-[#022448] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      📖 Read Full Terms & Legal Policy →
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl hover:bg-[#f09c13] transition-all shadow-md flex items-center justify-center gap-2"
              >
                {mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Submit Registration Application' : 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Toggle */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setMode('register')} className="font-bold text-[#022448] hover:underline">
                    Register Now
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button onClick={() => setMode('login')} className="font-bold text-[#022448] hover:underline">
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
