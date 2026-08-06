import React, { useEffect } from 'react';
import { X, Command, Search, LayoutDashboard, MessageSquare, Mail, Users, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface KeyboardShortcutsModalProps {
  onNavigate: (tab: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onNavigate }) => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen, setIsEmailDrawerOpen, setActiveChatUser } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen(!isShortcutsModalOpen);
      } else if (e.key === '/') {
        e.preventDefault();
        onNavigate('tutors');
      } else if (e.key.toLowerCase() === 'd') {
        onNavigate('student_dashboard');
      } else if (e.key.toLowerCase() === 't') {
        onNavigate('tutors');
      } else if (e.key.toLowerCase() === 'm') {
        setActiveChatUser({ id: 'usr_tutor_1', name: 'Neo Modise', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' });
      } else if (e.key.toLowerCase() === 'e') {
        setIsEmailDrawerOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsModalOpen, onNavigate, setIsShortcutsModalOpen, setIsEmailDrawerOpen, setActiveChatUser]);

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={() => setIsShortcutsModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#022448] text-[#feae2c] flex items-center justify-center">
            <Command className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#022448]">Power User Keyboard Shortcuts</h3>
            <p className="text-xs text-slate-500">Press hotkeys anytime to navigate fast</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <Search className="w-4 h-4 text-[#022448]" /> Search Tutors Directory
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              /
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-[#022448]" /> Open My Dashboard
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              D
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-[#022448]" /> Browse All Tutors
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              T
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#022448]" /> Open Direct Messages
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              M
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#022448]" /> Automated Email Logs
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              E
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#022448]" /> Toggle Shortcuts Help
            </span>
            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-slate-800 rounded border border-slate-200 shadow-sm">
              ?
            </kbd>
          </div>
        </div>

        <button
          onClick={() => setIsShortcutsModalOpen(false)}
          className="w-full mt-6 py-2.5 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
