import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BookingSession,
  PaymentTransaction,
  NotificationItem,
  ChatThread,
  ChatMessage,
  ReviewItem,
  SimulatedEmail,
  UserProfile,
  PaymentMethod,
  SessionStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SESSIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_EMAILS
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface AppContextType {
  sessions: BookingSession[];
  transactions: PaymentTransaction[];
  notifications: NotificationItem[];
  chats: ChatThread[];
  messages: ChatMessage[];
  reviews: ReviewItem[];
  emails: SimulatedEmail[];
  
  // Actions
  createBooking: (bookingData: {
    tutorId: string;
    tutorName: string;
    tutorAvatar?: string;
    subject: string;
    academicLevel: string;
    date: string;
    time: string;
    durationHours: number;
    pricePula: number;
    paymentMethod: PaymentMethod;
    mobileNumber: string;
    meetingMode: 'Online' | 'In-person';
    notes?: string;
  }) => { success: boolean; session?: BookingSession; transaction?: PaymentTransaction; error?: string };

  updateSessionStatus: (sessionId: string, newStatus: SessionStatus) => void;
  rescheduleSession: (sessionId: string, newDate: string, newTime: string) => void;
  completeSessionAndReleaseEscrow: (sessionId: string) => void;
  
  // Reviews
  addReview: (reviewData: {
    sessionId: string;
    tutorId: string;
    rating: number;
    comment: string;
    subject: string;
  }) => void;

  // Messaging
  sendMessage: (chatId: string, recipientId: string, content: string) => void;
  getOrCreateChat: (studentId: string, tutorId: string, studentName: string, tutorName: string, studentAvatar?: string, tutorAvatar?: string) => ChatThread;
  markChatAsRead: (chatId: string) => void;

  // Notifications
  markNotifAsRead: (id: string) => void;
  clearAllNotifs: () => void;

  // Admin Actions
  approveTutorVerification: (tutorId: string) => void;
  rejectTutorVerification: (tutorId: string, reason: string) => void;
  suspendUserAccount: (userId: string) => void;
  activateUserAccount: (userId: string) => void;
  closeUserAccount: (userId: string) => void;

  // Search & Filters state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  
  // Active UI Modals / Drawers
  isEmailDrawerOpen: boolean;
  setIsEmailDrawerOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  activeChatUser: { id: string; name: string; avatar?: string } | null;
  setActiveChatUser: (user: { id: string; name: string; avatar?: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();

  const [sessions, setSessions] = useState<BookingSession[]>(() => {
    const saved = localStorage.getItem('learnlink_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('learnlink_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('learnlink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chats, setChats] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('learnlink_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('learnlink_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('learnlink_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [emails, setEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem('learnlink_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedLevel, setSelectedLevel] = useState('All Academic Levels');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [priceRange, setPriceRange] = useState(300);

  // UI Drawer states
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<{ id: string; name: string; avatar?: string } | null>(null);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('learnlink_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('learnlink_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('learnlink_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('learnlink_chats', JSON.stringify(chats)); }, [chats]);
  useEffect(() => { localStorage.setItem('learnlink_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('learnlink_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('learnlink_emails', JSON.stringify(emails)); }, [emails]);

  const addSimulatedEmail = (recipientEmail: string, recipientName: string, subject: string, body: string, triggerEvent: string) => {
    const newEmail: SimulatedEmail = {
      id: `em_${Date.now()}`,
      recipientEmail,
      recipientName,
      subject,
      body,
      sentAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      triggerEvent
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  const addNotification = (userId: string, title: string, message: string, type: NotificationItem['type']) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const createBooking = (bookingData: {
    tutorId: string;
    tutorName: string;
    tutorAvatar?: string;
    subject: string;
    academicLevel: string;
    date: string;
    time: string;
    durationHours: number;
    pricePula: number;
    paymentMethod: PaymentMethod;
    mobileNumber: string;
    meetingMode: 'Online' | 'In-person';
    notes?: string;
  }) => {
    if (!currentUser) return { success: false, error: 'You must be logged in to book a session.' };

    const sessionId = `ses_${Date.now()}`;
    const txId = `tx_${Date.now()}`;
    const refPrefix = bookingData.paymentMethod === 'OrangeMoney' ? 'OM' : bookingData.paymentMethod === 'Smega' ? 'SM' : 'MZ';
    const txRef = `${refPrefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const platformFee = Number((bookingData.pricePula * 0.15).toFixed(2));
    const tutorPayout = Number((bookingData.pricePula * 0.85).toFixed(2));

    const newSession: BookingSession = {
      id: sessionId,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phoneNumber,
      tutorId: bookingData.tutorId,
      tutorName: bookingData.tutorName,
      tutorAvatar: bookingData.tutorAvatar,
      subject: bookingData.subject,
      academicLevel: bookingData.academicLevel,
      date: bookingData.date,
      time: bookingData.time,
      durationHours: bookingData.durationHours,
      pricePula: bookingData.pricePula,
      status: 'pending',
      paymentMethod: bookingData.paymentMethod,
      escrowStatus: 'escrow_held',
      meetingMode: bookingData.meetingMode,
      videoCallUrl: bookingData.meetingMode === 'Online' ? `https://meet.learnlink.co.bw/${sessionId}` : undefined,
      locationStr: bookingData.meetingMode === 'In-person' ? 'To be agreed with tutor' : undefined,
      notes: bookingData.notes,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const newTx: PaymentTransaction = {
      id: txId,
      sessionId,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      tutorId: bookingData.tutorId,
      tutorName: bookingData.tutorName,
      amountPula: bookingData.pricePula,
      platformFeePula: platformFee,
      tutorPayoutPula: tutorPayout,
      paymentMethod: bookingData.paymentMethod,
      mobileNumber: bookingData.mobileNumber,
      transactionRef: txRef,
      status: 'escrow_held',
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    setSessions(prev => [newSession, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    // Student Notification & Email
    addNotification(
      currentUser.id,
      'Payment Secured in Escrow',
      `P${bookingData.pricePula.toFixed(2)} held in ${bookingData.paymentMethod} Escrow for ${bookingData.subject} with ${bookingData.tutorName}.`,
      'payment'
    );

    addSimulatedEmail(
      currentUser.email,
      currentUser.fullName,
      `[LearnLink Escrow] Receipt & Booking Confirmation - P${bookingData.pricePula.toFixed(2)}`,
      `Dumela ${currentUser.fullName},\n\nYour payment of P${bookingData.pricePula.toFixed(2)} via ${bookingData.paymentMethod} (${bookingData.mobileNumber}) has been held safely in LearnLink Escrow.\n\nSession Details:\n- Tutor: ${bookingData.tutorName}\n- Subject: ${bookingData.subject}\n- Date & Time: ${bookingData.date} at ${bookingData.time}\n- Ref: ${txRef}\n\nFunds will only be released to your tutor after the session is completed.\n\nLearnLink Botswana Team`,
      'payment_escrow'
    );

    // Tutor Notification
    addNotification(
      bookingData.tutorId,
      'New Booking Request',
      `${currentUser.fullName} requested a ${bookingData.subject} session (${bookingData.date} at ${bookingData.time}). P${bookingData.pricePula} held in Escrow.`,
      'booking'
    );

    return { success: true, session: newSession, transaction: newTx };
  };

  const updateSessionStatus = (sessionId: string, newStatus: SessionStatus) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const updated = { ...s, status: newStatus };

        // Send notifications
        if (newStatus === 'accepted') {
          addNotification(
            s.studentId,
            'Session Confirmed!',
            `${s.tutorName} accepted your booking request for ${s.subject} on ${s.date}.`,
            'booking'
          );
          addSimulatedEmail(
            s.studentEmail,
            s.studentName,
            `[LearnLink] Booking Confirmed with ${s.tutorName}`,
            `Dumela ${s.studentName},\n\nGreat news! ${s.tutorName} accepted your session for ${s.subject} on ${s.date} (${s.time}).\n\nJoin URL: ${s.videoCallUrl || 'In-person location'}\n\nLearnLink Team`,
            'booking_accepted'
          );
        } else if (newStatus === 'declined') {
          addNotification(
            s.studentId,
            'Booking Request Declined',
            `${s.tutorName} was unable to accept your session. Your payment of P${s.pricePula} has been refunded to your ${s.paymentMethod} account.`,
            'booking'
          );
          // Mark transaction as refunded
          setTransactions(txs => txs.map(t => t.sessionId === sessionId ? { ...t, status: 'refunded' } : t));
          addSimulatedEmail(
            s.studentEmail,
            s.studentName,
            `[LearnLink Escrow Refund] Booking Request Declined`,
            `Dumela ${s.studentName},\n\n${s.tutorName} was unable to accept your booking for ${s.subject}.\n\nYour payment of P${s.pricePula} has been automatically refunded to your mobile money account.\n\nLearnLink Team`,
            'booking_declined'
          );
        }

        return updated;
      })
    );
  };

  const rescheduleSession = (sessionId: string, newDate: string, newTime: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const updated = { ...s, date: newDate, time: newTime, status: 'accepted' as SessionStatus };
        addNotification(
          s.tutorId,
          'Session Rescheduled',
          `${s.studentName} updated the session date to ${newDate} at ${newTime}.`,
          'booking'
        );
        addNotification(
          s.studentId,
          'Session Rescheduled',
          `Your ${s.subject} session has been updated to ${newDate} at ${newTime}.`,
          'booking'
        );
        return updated;
      })
    );
  };

  const completeSessionAndReleaseEscrow = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update Session
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, status: 'completed', escrowStatus: 'released_to_tutor' } : s))
    );

    // Update Transaction
    const tx = transactions.find(t => t.sessionId === sessionId);
    if (tx) {
      setTransactions(prev =>
        prev.map(t => (t.sessionId === sessionId ? { ...t, status: 'released_to_tutor' } : t))
      );

      // Add earnings to tutor profile
      updateUserProfile(session.tutorId, {
        totalEarningsPula: (currentUser?.totalEarningsPula || 0) + tx.tutorPayoutPula
      });

      // Notifications & Emails
      addNotification(
        session.tutorId,
        'Escrow Funds Released! 💰',
        `P${tx.tutorPayoutPula.toFixed(2)} (85% net of platform fee) released to your account for session with ${session.studentName}.`,
        'payment'
      );

      addNotification(
        session.studentId,
        'Session Completed',
        `Thank you for completing your session! Please take a moment to rate and review ${session.tutorName}.`,
        'booking'
      );

      addSimulatedEmail(
        session.studentEmail,
        session.studentName,
        `[LearnLink] Session Completed - Leave a Review for ${session.tutorName}`,
        `Dumela ${session.studentName},\n\nYour session with ${session.tutorName} is now marked complete.\n\nPlease share your feedback to help other students in Botswana find great tutors!\n\nLearnLink Team`,
        'session_completed'
      );
    }
  };

  const addReview = ({ sessionId, tutorId, rating, comment, subject }: { sessionId: string; tutorId: string; rating: number; comment: string; subject: string }) => {
    if (!currentUser) return;

    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      tutorId,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentAvatar: currentUser.avatarUrl,
      rating,
      comment,
      subject,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setReviews(prev => [newRev, ...prev]);

    // Update session record
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ratingGiven: rating, reviewGiven: comment } : s));

    // Recalculate tutor rating & review count
    const tutorRevs = [...reviews.filter(r => r.tutorId === tutorId), newRev];
    const avgRating = Number((tutorRevs.reduce((acc, r) => acc + r.rating, 0) / tutorRevs.length).toFixed(1));

    updateUserProfile(tutorId, {
      rating: avgRating,
      reviewCount: tutorRevs.length
    });

    addNotification(
      tutorId,
      'New Student Review ⭐',
      `${currentUser.fullName} left you a ${rating}-star review for ${subject}: "${comment.substring(0, 50)}..."`,
      'system'
    );
  };

  // Messaging functions
  const getOrCreateChat = (
    studentId: string,
    tutorId: string,
    studentName: string,
    tutorName: string,
    studentAvatar?: string,
    tutorAvatar?: string
  ) => {
    let existing = chats.find(c => c.studentId === studentId && c.tutorId === tutorId);
    if (!existing) {
      existing = {
        id: `chat_${Date.now()}`,
        studentId,
        studentName,
        studentAvatar,
        tutorId,
        tutorName,
        tutorAvatar,
        lastMessage: 'Chat conversation started.',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };
      setChats(prev => [existing!, ...prev]);
    }
    return existing;
  };

  const sendMessage = (chatId: string, recipientId: string, content: string) => {
    if (!currentUser) return;

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      recipientId,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);

    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: content,
              lastMessageTime: 'Just now',
              unreadCount: c.unreadCount + 1
            }
          : c
      )
    );

    addNotification(
      recipientId,
      `New Message from ${currentUser.fullName}`,
      content.length > 40 ? `${content.substring(0, 40)}...` : content,
      'chat'
    );
  };

  const markChatAsRead = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
    setMessages(prev => prev.map(m => m.chatId === chatId ? { ...m, isRead: true } : m));
  };

  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifs = () => {
    setNotifications([]);
  };

  // Admin Portal Actions
  const approveTutorVerification = (tutorId: string) => {
    updateUserProfile(tutorId, {
      status: 'active',
      isVerifiedTutor: true
    });

    const targetUser = INITIAL_USERS.find(u => u.id === tutorId);
    if (targetUser) {
      addNotification(
        tutorId,
        'Tutor Profile Verified! 🎉',
        'Congratulations! LearnLink Admin approved your credentials. You can now accept student booking requests and earn.',
        'verification'
      );

      addSimulatedEmail(
        targetUser.email,
        targetUser.fullName,
        '[LearnLink Admin] Your Tutor Verification Has Been Approved!',
        `Dumela ${targetUser.fullName},\n\nWe are excited to inform you that your tutor verification application has been approved by LearnLink Admin.\n\nYour profile now displays the Verified Educator Badge, and students across Botswana can book sessions with you.\n\nWelcome to LearnLink!`,
        'tutor_approved'
      );
    }
  };

  const rejectTutorVerification = (tutorId: string, reason: string) => {
    updateUserProfile(tutorId, {
      status: 'suspended',
      isVerifiedTutor: false
    });

    addNotification(
      tutorId,
      'Verification Application Rejected',
      `Your verification request was rejected. Reason: ${reason}`,
      'verification'
    );
  };

  const suspendUserAccount = (userId: string) => {
    updateUserProfile(userId, { status: 'suspended' });
  };

  const activateUserAccount = (userId: string) => {
    updateUserProfile(userId, { status: 'active' });
  };

  const closeUserAccount = (userId: string) => {
    // Soft remove user sessions & update user status
    updateUserProfile(userId, { status: 'suspended' });
  };

  return (
    <AppContext.Provider
      value={{
        sessions,
        transactions,
        notifications,
        chats,
        messages,
        reviews,
        emails,
        createBooking,
        updateSessionStatus,
        rescheduleSession,
        completeSessionAndReleaseEscrow,
        addReview,
        sendMessage,
        getOrCreateChat,
        markChatAsRead,
        markNotifAsRead,
        clearAllNotifs,
        approveTutorVerification,
        rejectTutorVerification,
        suspendUserAccount,
        activateUserAccount,
        closeUserAccount,
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        selectedLevel,
        setSelectedLevel,
        selectedLocation,
        setSelectedLocation,
        priceRange,
        setPriceRange,
        isEmailDrawerOpen,
        setIsEmailDrawerOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        activeChatUser,
        setActiveChatUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
