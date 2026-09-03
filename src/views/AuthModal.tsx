import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ArrowRight, GraduationCap, Upload, FileText, Award, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess: () => void;
  onOpenTermsModal?: (tab?: 'general' | 'fee' | 'tutor' | 'privacy') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, initialRole = 'student', onClose, onSuccess, onOpenTermsModal }) => {
  const { login, signInWithGoogle, register, resendVerificationEmail, checkEmailVerified, isPhoneTaken } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [googleConnected, setGoogleConnected] = useState<{
    email: string;
    fullName: string;
    photoURL?: string;
    uid: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);

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

  // Auto-check Firebase verification status when user returns to this browser tab
  React.useEffect(() => {
    if (!showVerificationStep || !unverifiedStudentEmail) return;

    let isMounted = true;
    const checkStatusQuietly = async () => {
      try {
        const result = await checkEmailVerified(unverifiedStudentEmail);
        if (result.verified && isMounted) {
          setSuccessMessage('Email verification confirmed! Logging you in...');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1000);
        }
      } catch {
        // silent check
      }
    };

    const handleFocus = () => {
      checkStatusQuietly();
    };

    // Periodic check every 4 seconds in case user clicked in background/another window
    const interval = setInterval(checkStatusQuietly, 4000);
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [showVerificationStep, unverifiedStudentEmail, checkEmailVerified, onSuccess, onClose]);

  // Terms & Conditions Acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheckEmailVerified = async () => {
    setIsCheckingEmail(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await checkEmailVerified(unverifiedStudentEmail);
      if (result.verified) {
        setSuccessMessage('Email verified successfully! Activating your LearnLink account...');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(
          'Email not yet verified. Please open your email (check your Spam/Junk folder), click the verification link, and then click this button again.'
        );
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to verify email status.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleResendFirebaseEmail = async () => {
    setIsResending(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await resendVerificationEmail(unverifiedStudentEmail);
      if (res.success) {
        setSuccessMessage(res.message || `Verification email re-dispatched to ${unverifiedStudentEmail}! Please check your Spam/Junk folder if not in Inbox.`);
      } else {
        setErrorMessage(res.error || 'Failed to dispatch email.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await signInWithGoogle({
        preferredRole: role,
        mode: mode === 'forgot' ? 'login' : mode
      });

      if (res.success) {
        if (mode === 'login') {
          // Standard Sign In
          setSuccessMessage('Successfully authenticated with Google! Logging you in...');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        } else {
          // Register Mode
          if (role === 'student') {
            setSuccessMessage('Student account created with Google! Welcome to LearnLink.');
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 800);
          } else {
            // Tutor Registration: Google identity verified, now tutor must fill out qualifications & uploads
            if (res.googleProfile) {
              setGoogleConnected(res.googleProfile);
              if (res.googleProfile.fullName && !fullName) {
                setFullName(res.googleProfile.fullName);
              }
              setEmail(res.googleProfile.email);
              if (res.googleProfile.phoneNumber && phoneNumber === '+267 71 ') {
                setPhoneNumber(res.googleProfile.phoneNumber);
              }
              setSuccessMessage(
                `Google profile verified (${res.googleProfile.email})! Please complete your credentials and upload your 3 required documents below to submit your tutor application.`
              );
            }
          }
        }
      } else {
        setErrorMessage(res.error || 'Failed to authenticate with Google.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to authenticate with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onSuccess();
          onClose();
        } else if (res.requiresEmailVerification && res.unverifiedUser) {
          setUnverifiedStudentEmail(res.unverifiedUser.email);
          setShowVerificationStep(true);
        } else {
          setErrorMessage(res.error || 'Invalid email address or password.');
        }
      } else if (mode === 'register') {
        if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
          setErrorMessage('Please complete all required contact fields.');
          setIsSubmitting(false);
          return;
        }

        // Only require password if not already connected via Google
        if (!googleConnected && (!password || password.length < 6)) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        // Mandatory Terms & Conditions Check
        if (!acceptedTerms) {
          setErrorMessage(
            role === 'tutor'
              ? 'You must accept the LearnLink Terms of Service and 15% Platform Fee agreement to register.'
              : 'You must accept LearnLink Terms of Service to complete registration.'
          );
          setIsSubmitting(false);
          return;
        }

        // Live validation check for phone uniqueness
        if (isPhoneTaken(phoneNumber, email)) {
          setErrorMessage('This mobile phone number is already registered to another account.');
          setIsSubmitting(false);
          return;
        }

        // Tutor Specific Validation
        if (role === 'tutor') {
          if (!courseOrMajor.trim()) {
            setErrorMessage('Please type your Course / Major degree program.');
            setIsSubmitting(false);
            return;
          }
          if (!collegeOrUniversity.trim()) {
            setErrorMessage('Please type your College / University / Institution name.');
            setIsSubmitting(false);
            return;
          }
          if (!yearsOfExperience.trim()) {
            setErrorMessage('Please specify your tutoring or teaching experience.');
            setIsSubmitting(false);
            return;
          }
          if (!omangDocName.trim() || !academicDocName.trim() || !resumeDocName.trim()) {
            setErrorMessage('Please upload all 3 required documents (National ID/Omang, Academic Record/Transcript, and Resume/CV).');
            setIsSubmitting(false);
            return;
          }
        }

        const res = await register({
          fullName,
          email,
          password: password || (googleConnected ? `GoogleAuth_${googleConnected.uid}` : undefined),
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
            setGoogleConnected(null);
            setTimeout(() => {
              setMode('login');
              setSuccessMessage('');
            }, 4500);
          } else {
            // Student requires email verification code step if not Google
            if (googleConnected) {
              setSuccessMessage('Student registration successful! Logging you in...');
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 800);
            } else {
              setUnverifiedStudentEmail(email);
              setShowVerificationStep(true);
            }
          }
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      } else if (mode === 'forgot') {
        setSuccessMessage(`Password reset link sent to ${email}`);
        setTimeout(() => setMode('login'), 2000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <div className="relative w-16 h-16 rounded-2xl bg-blue-50 text-[#022448] border border-blue-200 mx-auto flex items-center justify-center shadow-xs">
              <Mail className="w-8 h-8 text-[#022448]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                Firebase Email Verification
              </div>
              <h3 className="font-bold text-2xl text-[#022448]">Verify Your Email</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                A verification link has been dispatched to <strong className="text-slate-800">{unverifiedStudentEmail}</strong>. Please check your inbox and click the verification link.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleCheckEmailVerified}
                disabled={isCheckingEmail}
                className="w-full py-3 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl hover:bg-[#f09c13] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingEmail ? 'animate-spin' : ''}`} />
                <span>{isCheckingEmail ? 'Checking Firebase Status...' : "I've Clicked the Verification Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleResendFirebaseEmail}
                disabled={isResending}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left max-w-sm mx-auto space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Next Steps to Activate:
              </h4>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Check your email inbox or <strong>Spam / Junk folder</strong>.</li>
                <li>Click the official <strong>verification link</strong> in the email.</li>
                <li>Return to this page — LearnLink will automatically detect your confirmation, or click the yellow button above.</li>
              </ol>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-500 text-left max-w-sm mx-auto">
              💡 <strong>Spam Folder Check:</strong> Verification emails arrive from Firebase (<code className="text-slate-700">noreply@learnlink-firebase.firebaseapp.com</code>). If not in your inbox within 1–2 minutes, please inspect your Spam/Junk folder.
            </div>

            <button
              type="button"
              onClick={() => setShowVerificationStep(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium underline cursor-pointer"
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

            {/* Role Toggle for Register Mode */}
            {mode === 'register' && (
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setGoogleConnected(null);
                    setErrorMessage('');
                  }}
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
                  onClick={() => {
                    setRole('tutor');
                    setGoogleConnected(null);
                    setErrorMessage('');
                  }}
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

            {/* Google Authentication Option */}
            {mode !== 'forgot' && (
              <div className="mb-4">
                <button
                  type="button"
                  id="google-auth-btn"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.35 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>
                    {isGoogleLoading
                      ? 'Connecting with Google...'
                      : mode === 'login'
                      ? 'Sign in with Google'
                      : role === 'tutor'
                      ? (googleConnected ? `✓ Google Connected (${googleConnected.email.split('@')[0]})` : 'Step 1: Connect with Google (Tutor)')
                      : 'Sign up with Google (Student)'}
                  </span>
                </button>

                {/* Google Connected Badge for Tutor Application */}
                {googleConnected && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-emerald-950 block truncate">
                          {googleConnected.fullName || 'Google Account Verified'}
                        </span>
                        <span className="text-[10px] text-emerald-700 block truncate">
                          {googleConnected.email}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">
                      Identity Verified
                    </span>
                  </div>
                )}

                {mode === 'register' && role === 'tutor' && !googleConnected && (
                  <p className="mt-2 text-[10.5px] text-slate-500 text-center">
                    💡 Connecting your Google account verifies your email. You will then complete your qualifications and upload your Omang & transcripts below for admin review.
                  </p>
                )}

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-2.5 text-slate-400 font-bold tracking-wider">
                      {mode === 'login' ? 'Or sign in with email' : 'Or register with email'}
                    </span>
                  </div>
                </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    {googleConnected && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ✓ Connected with Google
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={googleConnected ? "Optional (Google Auth active)" : "••••••••"}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                      required={!googleConnected}
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
                disabled={isSubmitting}
                className="w-full py-3 bg-[#feae2c] text-[#022448] font-bold text-xs rounded-xl hover:bg-[#f09c13] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#022448] border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Submit Registration Application' : 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
