import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess }) => {
  const { login, register, isEmailTaken, isPhoneTaken } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+267 71 ');
  const [password, setPassword] = useState('');

  // Tutor Specific Fields
  const [university, setUniversity] = useState('University of Botswana');
  const [qualifications, setQualifications] = useState('B.Sc Pure Physics & Mathematics');
  const [hourlyRate, setHourlyRate] = useState(160);
  const [location, setLocation] = useState('Gaborone');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      const res = login(email, password);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } else if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
        setErrorMessage('Please complete all required fields.');
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

      const res = register({
        fullName,
        email,
        phoneNumber,
        role,
        bio: role === 'tutor' ? `Certified ${selectedSubject} tutor from ${university}.` : undefined,
        subjects: role === 'tutor' ? [selectedSubject] : undefined,
        academicLevels: role === 'tutor' ? ['Secondary (BGCSE/IGCSE)'] : undefined,
        hourlyRatePula: role === 'tutor' ? Number(hourlyRate) : undefined,
        location: role === 'tutor' ? location : undefined,
        qualifications: role === 'tutor' ? qualifications : undefined,
        university: role === 'tutor' ? university : undefined
      });

      if (res.success) {
        if (role === 'tutor') {
          setSuccessMessage('Registration submitted! Your profile is pending verification by LearnLink Admin.');
        } else {
          setSuccessMessage('Account created successfully! Welcome to LearnLink.');
        }
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
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
      <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

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

          {/* Tutor Qualification Details in Register Mode */}
          {mode === 'register' && role === 'tutor' && (
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
              <span className="text-[10px] font-bold uppercase text-[#022448] block">Tutor Application Details</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Primary Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
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
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">University / Institution</label>
                <input
                  type="text"
                  value={university}
                  onChange={e => setUniversity(e.target.value)}
                  placeholder="e.g. University of Botswana / BIUST"
                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                />
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
            {mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Complete Registration' : 'Send Reset Link'}
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

      </div>
    </div>
  );
};
