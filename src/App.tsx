import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { EmailNotificationDrawer } from './components/EmailNotificationDrawer';
import { ChatModal } from './components/ChatModal';
import { DailyClassroomModal } from './components/DailyClassroomModal';
import { TermsModal } from './components/TermsModal';
import { useApp } from './context/AppContext';

import { LandingView } from './views/LandingView';
import { TutorDirectoryView } from './views/TutorDirectoryView';
import { TutorProfileView } from './views/TutorProfileView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { TutorDashboardView } from './views/TutorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AuthModal } from './views/AuthModal';
import { UserRole } from './types';

export const AppContent: React.FC = () => {
  const { activeDailySession, setActiveDailySession, completeSessionAndReleaseEscrow } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>('usr_tutor_1');

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<UserRole>('student');

  // Terms Modal State
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<'general' | 'fee' | 'tutor' | 'privacy'>('general');

  const handleOpenTerms = (tab?: 'general' | 'fee' | 'tutor' | 'privacy') => {
    if (tab) setTermsTab(tab);
    setIsTermsOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register', role: UserRole = 'student') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  const handleSelectTutor = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    setCurrentTab('tutor_profile');
  };

  // Direct Unique Admin Link & Hash Routing
  useEffect(() => {
    const handleRouteFromUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        hash === '#admin_portal' ||
        params.get('portal') === 'admin' ||
        params.get('admin') === 'true' ||
        params.get('tab') === 'admin_dashboard'
      ) {
        setCurrentTab('admin_dashboard');
      }
    };

    handleRouteFromUrl();
    window.addEventListener('hashchange', handleRouteFromUrl);
    window.addEventListener('popstate', handleRouteFromUrl);
    return () => {
      window.removeEventListener('hashchange', handleRouteFromUrl);
      window.removeEventListener('popstate', handleRouteFromUrl);
    };
  }, []);

  // Synchronize browser tab <title> dynamically with current page / view / modal
  useEffect(() => {
    let pageTitle = 'Home';

    if (isAuthOpen) {
      pageTitle = authMode === 'login' ? 'Login' : 'Sign Up';
    } else if (activeDailySession) {
      pageTitle = 'Live Classroom';
    } else if (isTermsOpen) {
      switch (termsTab) {
        case 'privacy':
          pageTitle = 'Privacy Policy';
          break;
        case 'fee':
          pageTitle = 'Terms of Escrow';
          break;
        case 'tutor':
          pageTitle = 'Tutor Agreement';
          break;
        case 'general':
        default:
          pageTitle = 'Terms of Service';
          break;
      }
    } else {
      switch (currentTab) {
        case 'landing':
          pageTitle = 'Home';
          break;
        case 'tutors':
        case 'courses':
          pageTitle = 'Courses';
          break;
        case 'tutor_profile':
          pageTitle = 'Profile';
          break;
        case 'student_dashboard':
          pageTitle = 'Student Dashboard';
          break;
        case 'tutor_dashboard':
          pageTitle = 'Teacher Dashboard';
          break;
        case 'admin_dashboard':
          pageTitle = 'Admin Portal';
          break;
        case 'about':
        case 'about_us':
          pageTitle = 'About Us';
          break;
        case 'contact':
        case 'contact_us':
          pageTitle = 'Contact Us';
          break;
        default: {
          const formatted = currentTab
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
          pageTitle = formatted || 'Home';
          break;
        }
      }
    }

    document.title = `LearnLink - ${pageTitle}`;
  }, [currentTab, isAuthOpen, authMode, isTermsOpen, termsTab, activeDailySession]);

  return (
    <div className="min-h-screen bg-[#fcf8fb] text-slate-800 flex flex-col font-sans selection:bg-[#feae2c] selection:text-[#022448]">
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Main View Routing */}
      <main className="flex-1">
        {(currentTab === 'landing' || currentTab === 'about' || currentTab === 'about_us' || currentTab === 'contact' || currentTab === 'contact_us') && (
          <LandingView
            onNavigate={setCurrentTab}
            onSelectTutor={handleSelectTutor}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {(currentTab === 'tutors' || currentTab === 'courses') && (
          <TutorDirectoryView
            onSelectTutor={handleSelectTutor}
          />
        )}

        {currentTab === 'tutor_profile' && selectedTutorId && (
          <TutorProfileView
            tutorId={selectedTutorId}
            onBack={() => setCurrentTab('tutors')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'student_dashboard' && (
          <StudentDashboardView
            onNavigate={setCurrentTab}
            onSelectTutor={handleSelectTutor}
          />
        )}

        {currentTab === 'tutor_dashboard' && (
          <TutorDashboardView />
        )}

        {currentTab === 'admin_dashboard' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentTab}
        onOpenAuthModal={handleOpenAuth}
        onOpenTermsModal={handleOpenTerms}
      />

      {/* Overlays & Drawers */}
      <KeyboardShortcutsModal onNavigate={setCurrentTab} />
      <EmailNotificationDrawer />
      <ChatModal />

      {/* Daily.co Embedded Virtual Classroom Modal */}
      {activeDailySession && (
        <DailyClassroomModal
          isOpen={!!activeDailySession}
          onClose={() => setActiveDailySession(null)}
          sessionData={activeDailySession}
          onCompleteSession={completeSessionAndReleaseEscrow}
        />
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          initialRole={authRole}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {}}
          onOpenTermsModal={handleOpenTerms}
        />
      )}

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        defaultTab={termsTab}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
