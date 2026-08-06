import React, { useState } from 'react';
import { ShieldCheck, X, FileText, Lock, Scale, AlertTriangle, CheckCircle, Download, BookOpen, Building2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'general' | 'fee' | 'tutor' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'general'
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'fee' | 'tutor' | 'privacy'>(defaultTab);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#022448] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#feae2c] flex items-center justify-center text-[#022448] font-bold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                LearnLink Legal Terms & Conditions
              </h2>
              <p className="text-xs text-blue-200">
                Official Terms of Service, Escrow Guarantee, 15% Fee Policy & Tutor Agreement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 flex flex-wrap gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'general'
                ? 'bg-[#022448] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> 1. Platform Terms & Liability
          </button>
          <button
            onClick={() => setActiveTab('fee')}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'fee'
                ? 'bg-[#022448] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#feae2c]" /> 2. 15% Fee & Escrow Policy
          </button>
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'tutor'
                ? 'bg-[#022448] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" /> 3. Tutor Code & Non-Circumvention
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'privacy'
                ? 'bg-[#022448] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 4. Privacy & Data Protection
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed flex-1">
          
          {/* TAB 1: GENERAL TERMS & LIMITATION OF LIABILITY */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#022448] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-[#022448] text-sm">LearnLink Botswana Services Agreement</h3>
                  <p className="text-xs text-blue-900 mt-0.5">
                    Effective Date: August 6, 2026. Governed under the Laws of the Republic of Botswana.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  1. Scope of the Platform
                </h4>
                <p>
                  LearnLink operates solely as an independent digital marketplace and technology facilitator connecting students ("Learners") and verified educators ("Tutors") across Botswana. LearnLink provides booking software, high-definition Daily.co WebRTC video classroom infrastructure, and Mobile Money Escrow payment processing.
                </p>
                <p>
                  Tutors registered on LearnLink are independent contractors, not employees, agents, or joint partners of LearnLink. LearnLink does not directly deliver educational instruction or control tutors&apos; teaching methods.
                </p>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base text-red-900 flex items-center gap-2">
                  2. Strict Limitation of Liability & Disclaimers
                </h4>
                <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-2xl space-y-2 text-slate-800">
                  <p className="font-bold text-xs uppercase tracking-wide text-slate-900">
                    TO THE MAXIMUM EXTENT PERMITTED BY THE LAWS OF BOTSWANA:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>
                      <strong>No Guarantee of Academic Outcomes:</strong> LearnLink does not warrant or guarantee specific examination results, grades, BGCSE scores, or university admission outcomes resulting from tutoring sessions.
                    </li>
                    <li>
                      <strong>Third-Party Conduct & In-Person Safety:</strong> LearnLink accepts no liability for actions, misconduct, or disputes occurring off-platform or during in-person sessions arranged between students and tutors.
                    </li>
                    <li>
                      <strong>Indirect & Consequential Damages:</strong> LearnLink, its directors, employees, and software providers shall not be held liable for any indirect, incidental, punitive, or consequential damages, loss of profits, data loss, or network outages from mobile service providers (Mascom, Orange, BTC).
                    </li>
                    <li>
                      <strong>Cap on Liability:</strong> In all circumstances, LearnLink&apos;s total maximum cumulative liability to any user shall not exceed the total platform fees collected by LearnLink for the specific booking in dispute.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">3. Indemnification Clause</h4>
                <p>
                  You agree to fully defend, indemnify, and hold harmless LearnLink, its founders, operators, and tech partners against any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from: (a) your use or misuse of the platform; (b) any breach of these Terms; or (c) any dispute between you and another user.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: 15% FEE & ESCROW GUARANTEE */}
          {activeTab === 'fee' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#feae2c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-amber-950 text-sm">Mandatory 15% Platform Commission & Escrow Terms</h3>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Transparent financial split protecting student payments and securing tutor payouts.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="font-bold text-slate-900 text-base">1. The 15% Platform Commission Model</h4>
                <p>
                  To sustain platform operations, host high-definition Daily.co WebRTC interactive video classrooms, manage SMS notifications, and secure mobile money integrations, <strong>LearnLink automatically charges a 15% platform commission on every booked lesson</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="block text-[11px] text-slate-500 font-bold uppercase">Student Pays</span>
                    <span className="text-lg font-black text-[#022448]">100% Rate</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">e.g., P200.00 / hr</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <span className="block text-[11px] text-amber-800 font-bold uppercase">LearnLink Fee</span>
                    <span className="text-lg font-black text-amber-700">15% Fee</span>
                    <span className="block text-[10px] text-amber-800 mt-0.5">e.g., P30.00 retained</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="block text-[11px] text-emerald-800 font-bold uppercase">Tutor Payout</span>
                    <span className="text-lg font-black text-emerald-700">85% Net</span>
                    <span className="block text-[10px] text-emerald-800 mt-0.5">e.g., P170.00 released</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">2. Mobile Money Escrow Security Mechanism</h4>
                <p>
                  When a student books a session paying via <strong>Orange Money, MyZaka, Smega, or Bank EFT</strong>, the payment is immediately deposited into the <strong>LearnLink Vault Escrow Account</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                  <li>
                    <strong>Escrow Holding:</strong> Funds remain securely locked in Escrow before and during the lesson. Neither the student nor tutor can withdraw locked escrow funds unilaterally.
                  </li>
                  <li>
                    <strong>Automatic Release:</strong> Upon completion of the lesson, either the student confirms satisfaction or the tutor submits completion. The tutor&apos;s 85% net payout is released directly to their designated Mobile Wallet or Bank Account.
                  </li>
                  <li>
                    <strong>Cancellation & Full Refund:</strong> If a lesson is cancelled by the tutor or cancelled by the student at least 12 hours prior to start time, 100% of the funds held in escrow are refunded to the student&apos;s wallet.
                  </li>
                </ul>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">3. Dispute Resolution & Admin Intervention</h4>
                <p>
                  If a session is interrupted, or if a tutor fails to attend, students can trigger an official Escrow Dispute within 24 hours. LearnLink Administrators investigate video room logs, chat records, and teacher attendance. Admin decisions regarding escrow disbursement or refund are final and legally binding.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: TUTOR CODE & NON-CIRCUMVENTION */}
          {activeTab === 'tutor' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Scale className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-emerald-950 text-sm">Tutor Registration Agreement & Code of Conduct</h3>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    Strict identity verification, academic standards, and anti-circumvention rules.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-900 text-base">1. Identity & Credential Verification</h4>
                <p>
                  All prospective tutors must upload a valid <strong>Botswana Omang National ID or Passport</strong> alongside certified copies of degree certificates, transcripts, or teaching credentials. Submitting altered or forged documents is illegal under Botswana penal code and will result in immediate prosecution.
                </p>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  2. Strict Anti-Circumvention Policy (Off-Platform Payment Prohibition)
                </h4>
                <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-2 text-amber-950">
                  <p className="font-bold text-xs">
                    CRITICAL PROTECTION RULE FOR TUTORS AND STUDENTS:
                  </p>
                  <p className="text-xs leading-relaxed">
                    Tutors and students introduced through LearnLink are <strong>STRICTLY FORBIDDEN</strong> from soliciting, offering, accepting, or requesting direct off-platform payments (cash, personal Orange Money transfers, or direct bank deposits) to bypass LearnLink&apos;s 15% commission or Escrow system.
                  </p>
                  <div className="pt-2 border-t border-amber-200 font-bold text-xs text-red-700 flex items-center gap-2">
                    <span>⚠️ Penalty for Violations:</span>
                    <span>Immediate permanent ban, account termination, and forfeiture of pending escrow earnings.</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">3. Professional Educator Code of Conduct</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                  <li><strong>Punctuality:</strong> Tutors must log into the LearnLink Daily.co virtual classroom at least 3 minutes before the scheduled start time.</li>
                  <li><strong>Zero Harassment Tolerance:</strong> Any form of verbal abuse, discrimination, inappropriate messaging, or unprofessional behavior results in instant revocation of tutor status.</li>
                  <li><strong>Academic Integrity:</strong> Tutors must assist students in understanding core concepts and must NOT complete graded assignments, tests, or university exams on behalf of students.</li>
                </ul>
              </section>
            </div>
          )}

          {/* TAB 4: PRIVACY & DATA PROTECTION */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-purple-950 text-sm">Privacy Policy & Botswana Data Protection Act Compliance</h3>
                  <p className="text-xs text-purple-900 mt-0.5">
                    How LearnLink collects, encrypts, and protects user data across Botswana.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-900 text-base">1. Information We Collect</h4>
                <p>
                  We collect user account information including Full Names, Email Addresses, Mobile Phone Numbers (for Mobile Money transfers), Omang ID numbers, academic qualifications, and lesson transaction records.
                </p>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">2. Encryption & Data Security</h4>
                <p>
                  All personal data and verification documents are encrypted in transit and at rest using AES-256 military-grade encryption. Verification documents are accessible solely by authorized LearnLink compliance officers for identity validation.
                </p>
              </section>

              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">3. No Third-Party Data Selling</h4>
                <p>
                  LearnLink will <strong>never sell, rent, or lease</strong> your personal details or contact information to third-party advertisers. Data is shared exclusively with integrated service providers (Mobile Money networks, SMS gateways, Daily.co WebRTC video engines) required to fulfill your tutoring bookings.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Official Policy Document • LearnLink Botswana (Pty) Ltd</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors w-1/2 sm:w-auto"
            >
              <Download className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#022448] text-white hover:bg-[#1e3a5f] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] w-1/2 sm:w-auto"
            >
              I Understand & Accept
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
