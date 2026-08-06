import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { EmailNotificationDrawer } from './components/EmailNotificationDrawer';
import { ChatModal } from './components/ChatModal';
import { DailyClassroomModal } from './components/DailyClassroomModal';
import { useApp } from './context/AppContext';

import { LandingView } from './views/LandingView';
import { TutorDirectoryView } from './views/TutorDirectoryView';
import { TutorProfileView } from './views/TutorProfileView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { TutorDashboardView } from './views/TutorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AuthModal } from './views/AuthModal';

export const AppContent: React.FC = () => {
  const { activeDailySession, setActiveDailySession, completeSessionAndReleaseEscrow } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>('usr_tutor_1');

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleSelectTutor = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    setCurrentTab('tutor_profile');
  };

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
        {currentTab === 'landing' && (
          <LandingView
            onNavigate={setCurrentTab}
            onSelectTutor={handleSelectTutor}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'tutors' && (
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
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {}}
        />
      )}

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
