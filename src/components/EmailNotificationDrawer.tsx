import React from 'react';
import { X, Mail, ShieldCheck, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const EmailNotificationDrawer: React.FC = () => {
  const { emails, isEmailDrawerOpen, setIsEmailDrawerOpen } = useApp();
  const { currentUser } = useAuth();

  if (!isEmailDrawerOpen) return null;

  const visibleEmails = !currentUser
    ? []
    : currentUser.role === 'admin'
    ? emails
    : emails.filter(e => e.recipientEmail.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-5 bg-[#022448] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#feae2c] text-[#022448] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Automated Email Notifications</h3>
              <p className="text-xs text-blue-200">
                {currentUser ? `Inbox for ${currentUser.fullName}` : 'System Email Dispatch Logs'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailDrawerOpen(false)}
            className="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200/60 flex items-center gap-2 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>LearnLink automatically sends emails for payment receipts, booking status, and verification updates.</span>
        </div>

        {/* Email Logs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
          {visibleEmails.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-400 space-y-2">
              <Mail className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-xs text-slate-600">Your Mailbox is Empty</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                No automated emails logged yet for {currentUser?.email || 'this account'}. Booking receipts and updates will appear here automatically.
              </p>
            </div>
          ) : (
            visibleEmails.map(email => (
              <div key={email.id} className="pt-4 first:pt-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      To: {email.recipientName} ({email.recipientEmail})
                    </span>
                    <h4 className="font-bold text-sm text-[#022448] mt-1">{email.subject}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {email.sentAt}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line font-mono leading-relaxed">
                  {email.body}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500 flex items-center justify-between">
          <span>{visibleEmails.length} email{visibleEmails.length !== 1 ? 's' : ''} logged</span>
          <button
            onClick={() => setIsEmailDrawerOpen(false)}
            className="px-4 py-1.5 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f]"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
};
