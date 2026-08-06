import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2, FileText, Upload, AlertCircle } from 'lucide-react';
import { PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface PaymentModalProps {
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  subject: string;
  academicLevel: string;
  hourlyRatePula: number;
  onSuccess: () => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  tutorId,
  tutorName,
  tutorAvatar,
  subject,
  academicLevel,
  hourlyRatePula,
  onSuccess,
  onClose
}) => {
  const { createBooking } = useApp();
  const { currentUser, updateUserProfile } = useAuth();

  const [sessionType, setSessionType] = useState<'single' | 'package'>('single');
  const [hours, setHours] = useState(1.5);
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; count: number; price: number } | null>(null);

  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [timeStr, setTimeStr] = useState('15:00 - 16:30');
  const [meetingMode, setMeetingMode] = useState<'Online' | 'In-person'>('Online');
  const [notes, setNotes] = useState('');

  // Student Prerequisites States
  const [studentIdDocName, setStudentIdDocName] = useState(currentUser?.studentIdDocUrl || '');
  const [prefPaymentMethod, setPrefPaymentMethod] = useState<PaymentMethod>(
    currentUser?.preferredPaymentMethod || 'OrangeMoney'
  );

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    currentUser?.preferredPaymentMethod || 'OrangeMoney'
  );
  const [mobileNumber, setMobileNumber] = useState(currentUser?.phoneNumber || '+267 71 234 567');
  const [pinCode, setPinCode] = useState('');
  
  // States: 'details' -> 'confirm_pin' -> 'processing' -> 'success'
  const [step, setStep] = useState<'details' | 'confirm_pin' | 'processing' | 'success'>('details');
  const [errorMessage, setErrorMessage] = useState('');

  const totalPricePula = sessionType === 'single' ? Math.round(hourlyRatePula * hours) : selectedPackage ? selectedPackage.price : hourlyRatePula * 4;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Check Student Prerequisites: Student ID PDF & Preferred Payment Method
    if (currentUser?.role === 'student') {
      if (!studentIdDocName.trim()) {
        setErrorMessage('Mandatory Requirement: Please upload your Student ID or National Omang (PDF / Image) before making a booking.');
        return;
      }
      if (!prefPaymentMethod) {
        setErrorMessage('Mandatory Requirement: Please select your preferred payment method before booking.');
        return;
      }

      // Save student prerequisites to profile
      updateUserProfile(currentUser.id, {
        studentIdDocUrl: studentIdDocName.trim(),
        preferredPaymentMethod: prefPaymentMethod
      });
    }

    if (!mobileNumber || mobileNumber.length < 8) {
      setErrorMessage('Please enter a valid Botswana mobile phone number (+267 ...).');
      return;
    }
    setErrorMessage('');
    setStep('confirm_pin');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 4) {
      setErrorMessage('Please enter your 4-digit Mobile Money PIN.');
      return;
    }

    setErrorMessage('');
    setStep('processing');

    setTimeout(() => {
      const res = createBooking({
        tutorId,
        tutorName,
        tutorAvatar,
        subject,
        academicLevel,
        date: dateStr,
        time: timeStr,
        durationHours: hours,
        pricePula: totalPricePula,
        paymentMethod,
        mobileNumber,
        meetingMode,
        notes
      });

      if (res.success) {
        setStep('success');
      } else {
        setErrorMessage(res.error || 'Failed to process escrow payment.');
        setStep('details');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#022448] text-[#feae2c] flex items-center justify-center font-bold text-xl shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#022448]">Secure Escrow Payment</h3>
            <p className="text-xs text-slate-500">Book session with {tutorName}</p>
          </div>
        </div>

        {/* Escrow Banner */}
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <strong className="font-bold">100% Escrow Guarantee:</strong> Your payment is held safely by LearnLink. Funds are only released to {tutorName} after your session is completed.
          </div>
        </div>

        {step === 'details' && (
          <form onSubmit={handleStartPayment} className="space-y-5">
            
            {/* Student Mandatory Booking Prerequisites Box */}
            {currentUser?.role === 'student' && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs border-b border-amber-200/80 pb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Mandatory Student Verification Prerequisites</span>
                </div>

                {/* Upload Student ID PDF */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span>Student National Omang or Student ID (PDF/Image) <span className="text-red-500">*</span></span>
                    {studentIdDocName && <span className="text-[10px] font-bold text-emerald-700">✓ Attached</span>}
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const fname = e.target.files?.[0]?.name || 'Student_Omang_ID.pdf';
                      setStudentIdDocName(fname);
                    }}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#022448] file:text-white cursor-pointer"
                  />
                  {studentIdDocName && (
                    <p className="text-[10px] font-mono text-slate-600 mt-1">Current File: {studentIdDocName}</p>
                  )}
                </div>

                {/* Preferred Payment Method */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">
                    Preferred Mobile Money Gateway <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={prefPaymentMethod}
                    onChange={(e) => {
                      const val = e.target.value as PaymentMethod;
                      setPrefPaymentMethod(val);
                      setPaymentMethod(val);
                    }}
                    className="w-full p-2 text-xs border border-amber-200 rounded-xl bg-white font-bold text-[#022448]"
                  >
                    <option value="OrangeMoney">OrangeMoney (Orange Botswana)</option>
                    <option value="Smega">Smega (BTC Mobile)</option>
                    <option value="MyZaka">MyZaka (Mascom Wireless)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Booking Options */}
            <div>
              <label className="block text-xs font-bold text-[#022448] uppercase tracking-wider mb-2">
                Subject & Topic
              </label>
              <div className="p-3 bg-slate-50 rounded-xl font-semibold text-sm text-[#022448] border border-slate-200 flex justify-between items-center">
                <span>{subject} ({academicLevel})</span>
                <span className="text-xs text-[#022448]/80 font-normal">P{hourlyRatePula}/hr</span>
              </div>
            </div>

            {/* Date, Time & Meeting Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={e => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time</label>
                <select
                  value={timeStr}
                  onChange={e => setTimeStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none bg-white"
                >
                  <option value="09:00 - 10:30">09:00 - 10:30 AM</option>
                  <option value="11:00 - 12:30">11:00 - 12:30 PM</option>
                  <option value="15:00 - 16:30">15:00 - 16:30 PM</option>
                  <option value="17:00 - 18:30">17:00 - 18:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingMode('Online')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    meetingMode === 'Online'
                      ? 'bg-[#022448] text-white border-[#022448]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  💻 Online (Daily.co Video)
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingMode('In-person')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    meetingMode === 'In-person'
                      ? 'bg-[#022448] text-white border-[#022448]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📍 In-person (Gaborone)
                </button>
              </div>
            </div>

            {/* Mobile Money Provider */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Mobile Money Gateway
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('OrangeMoney')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'OrangeMoney'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-900 font-bold ring-2 ring-orange-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <span className="text-xs">OrangeMoney</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Smega')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'Smega'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Smega (BTC)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MyZaka')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'MyZaka'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">MyZaka (Mascom)</span>
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {paymentMethod} Registered Phone Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                placeholder="+267 71 000 000"
                className="w-full px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#022448] outline-none"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            {/* Total Price & Proceed */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Escrow Amount:</span>
                <span className="text-2xl font-black text-[#022448]">P{totalPricePula}.00</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#feae2c] text-[#022448] font-bold text-sm rounded-xl shadow-md hover:bg-[#f09c13] transition-all flex items-center gap-2"
              >
                Pay via {paymentMethod} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {step === 'confirm_pin' && (
          <form onSubmit={handleConfirmPin} className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center font-bold">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-bold text-lg text-[#022448]">Authorize {paymentMethod} Transaction</h4>
              <p className="text-xs text-slate-500 mt-1">
                A prompt will be sent to <strong>{mobileNumber}</strong> to authorize <strong>P{totalPricePula}.00</strong>.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <label className="block text-xs font-bold text-slate-700 mb-2">Enter 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#022448] outline-none"
                autoFocus
                required
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] shadow-md"
              >
                Authorize Escrow
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="text-center py-10 space-y-4">
            <Loader2 className="w-12 h-12 text-[#feae2c] animate-spin mx-auto" />
            <h4 className="font-bold text-lg text-[#022448]">Verifying Escrow Transaction...</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Communicating with {paymentMethod} gateway servers. Securing funds in LearnLink Escrow vault.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-bold text-2xl text-[#022448]">Escrow Payment Secured!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your session request with <strong>{tutorName}</strong> is submitted. P{totalPricePula}.00 is now held safely in LearnLink Escrow.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-bold text-slate-800">{subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-800">{dateStr} ({timeStr})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-slate-800">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Escrow Status:</span>
                <span className="font-bold text-emerald-600">Held in Protection Vault</span>
              </div>
            </div>

            <button
              onClick={() => { onSuccess(); onClose(); }}
              className="w-full py-3 bg-[#022448] text-white font-bold text-sm rounded-xl hover:bg-[#1e3a5f] shadow-lg"
            >
              Go to My Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
