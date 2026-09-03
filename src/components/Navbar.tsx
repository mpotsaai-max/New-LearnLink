import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Bell,
  Mail,
  MessageSquare,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Command,
  Search,
  BookOpen,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register', role?: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuthModal }) => {
  const { currentUser, logout, switchDemoUser } = useAuth();
  const { chats, sessions, notifications, emails, markNotifAsRead, setIsEmailDrawerOpen, setIsShortcutsModalOpen, setActiveChatUser } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userNotifications = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];
  const unreadNotifs = userNotifications.filter(n => !n.isRead);
  const totalEmails = currentUser
    ? (currentUser.role === 'admin'
        ? emails.length
        : emails.filter(e => e.recipientEmail.toLowerCase() === currentUser.email.toLowerCase()).length)
    : 0;

  const handleOpenMessages = () => {
    if (!currentUser) return;
    const myChats = chats.filter(c => c.studentId === currentUser.id || c.tutorId === currentUser.id);
    if (myChats.length > 0) {
      const lastChat = myChats[0];
      const partnerId = lastChat.studentId === currentUser.id ? lastChat.tutorId : lastChat.studentId;
      const partnerName = lastChat.studentId === currentUser.id ? lastChat.tutorName : lastChat.studentName;
      const partnerAvatar = lastChat.studentId === currentUser.id ? lastChat.tutorAvatar : lastChat.studentAvatar;
      setActiveChatUser({ id: partnerId, name: partnerName, avatar: partnerAvatar });
    } else {
      if (currentUser.role === 'admin') {
        setActiveChatUser({ id: 'usr_student_demo', name: 'Thabo Mokgosi (Student Demo)' });
      } else {
        setActiveChatUser({
          id: 'usr_admin_demo',
          name: 'LearnLink Support',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
        });
      }
    }
  };

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#022448] text-white shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#feae2c] to-[#e96645] flex items-center justify-center text-[#022448] font-bold shadow-lg">
              <GraduationCap className="w-7 h-7 text-[#022448]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl tracking-tight text-white font-sans">LearnLink</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#feae2c]/20 text-[#feae2c] border border-[#feae2c]/40 rounded-full">
                  Botswana Premier
                </span>
              </div>
              <p className="text-xs text-blue-200/80 hidden sm:block">Connect. Learn. Grow.</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'landing'
                  ? 'bg-[#feae2c] text-[#022448] font-bold shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Home
            </button>

            <button
              onClick={() => handleNavClick('tutors')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'tutors'
                  ? 'bg-[#feae2c] text-[#022448] font-bold shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" /> Find Tutors
            </button>

            {currentUser && (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin_dashboard' : currentUser.role === 'tutor' ? 'tutor_dashboard' : 'student_dashboard')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  currentTab.includes('dashboard')
                    ? 'bg-[#feae2c] text-[#022448] font-bold shadow-md'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {currentUser.role === 'admin' ? 'Admin Portal' : currentUser.role === 'tutor' ? 'Tutor Dashboard' : 'Student Portal'}
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            
            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:flex items-center gap-1 text-xs"
              title="Keyboard Shortcuts (?)"
            >
              <Command className="w-4 h-4" />
            </button>

            {/* Logged-in User Header Actions: Email, Chat, Notifications */}
            {currentUser && (
              <>
                {/* Email Notification Drawer Icon */}
                <button
                  onClick={() => setIsEmailDrawerOpen(true)}
                  className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                  title="Automated System Email Logs"
                >
                  <Mail className="w-5 h-5" />
                  {totalEmails > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-[#022448] font-bold text-[10px] rounded-full flex items-center justify-center">
                      {totalEmails}
                    </span>
                  )}
                </button>

                {/* Direct Messages Icon */}
                <button
                  onClick={handleOpenMessages}
                  className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                  title="Direct Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-[#e96645] text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 bg-[#022448] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#feae2c]" />
                          <span className="font-bold text-sm">Notifications</span>
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{unreadNotifs.length} unread</span>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {userNotifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-xs">
                            No notifications for your account yet.
                          </div>
                        ) : (
                          userNotifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => markNotifAsRead(n.id)}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/60' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-xs text-[#022448]">{n.title}</span>
                                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Profile Avatar & Auth buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#feae2c]"
                  />
                  <span className="text-xs font-semibold text-white hidden sm:inline-block max-w-[100px] truncate">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-sm text-[#022448]">{currentUser.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-100 text-blue-800">
                          Role: {currentUser.role}
                        </span>
                        {currentUser.role === 'tutor' && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${currentUser.isVerifiedTutor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {currentUser.isVerifiedTutor ? 'Verified' : 'Pending Verification'}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab(
                          currentUser.role === 'admin' ? 'admin_dashboard' : currentUser.role === 'tutor' ? 'tutor_dashboard' : 'student_dashboard'
                        );
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#022448]" /> My Portal
                    </button>

                    <button
                      onClick={() => { logout(); setIsProfileOpen(false); setCurrentTab('landing'); }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2 text-xs font-semibold text-white hover:text-[#feae2c] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2 bg-[#feae2c] text-[#022448] hover:bg-[#f09c13] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" /> Join LearnLink
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-blue-200 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1e3a5f] border-t border-white/10 px-4 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#feae2c]" /> Home
          </button>
          <button
            onClick={() => handleNavClick('tutors')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-[#feae2c]" /> Find Tutors
          </button>
          {currentUser ? (
            <button
              onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin_dashboard' : currentUser.role === 'tutor' ? 'tutor_dashboard' : 'student_dashboard')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-[#feae2c]" /> My Dashboard
            </button>
          ) : (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal('login'); }}
                className="w-full py-2.5 px-3 text-center text-sm font-semibold text-white bg-white/10 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal('register', 'student'); }}
                className="w-full py-2.5 px-3 text-center text-sm font-bold text-[#022448] bg-[#feae2c] rounded-xl"
              >
                Join LearnLink
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
