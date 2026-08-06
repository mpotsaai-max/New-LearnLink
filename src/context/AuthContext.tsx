import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    bio?: string;
    subjects?: string[];
    academicLevels?: string[];
    hourlyRatePula?: number;
    location?: string;
    qualifications?: string;
    university?: string;
  }) => { success: boolean; error?: string; user?: UserProfile };
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  updateUserProfile: (id: string, updates: Partial<UserProfile>) => void;
  isEmailTaken: (email: string) => boolean;
  isPhoneTaken: (phone: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('learnlink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Reset legacy saved sessions once so everyone gets the clean public visitor view by default
    if (!localStorage.getItem('learnlink_guest_default_v3')) {
      localStorage.removeItem('learnlink_current_user');
      localStorage.setItem('learnlink_guest_default_v3', 'true');
      return null;
    }

    const savedCurrent = localStorage.getItem('learnlink_current_user');
    if (savedCurrent) {
      try {
        return JSON.parse(savedCurrent);
      } catch {
        return null;
      }
    }
    // Default to Guest Visitor for clean public experience
    return null;
  });

  useEffect(() => {
    localStorage.setItem('learnlink_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('learnlink_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('learnlink_current_user');
    }
  }, [currentUser]);

  const isEmailTaken = (email: string) => {
    return users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
  };

  const isPhoneTaken = (phone: string) => {
    const clean = phone.replace(/\s+/g, '');
    return users.some(u => u.phoneNumber.replace(/\s+/g, '') === clean);
  };

  const login = (email: string, _pass: string) => {
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (found.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended by LearnLink Admin. Please contact support@learnlink.co.bw.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const register = (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    bio?: string;
    subjects?: string[];
    academicLevels?: string[];
    hourlyRatePula?: number;
    location?: string;
    qualifications?: string;
    university?: string;
  }) => {
    // Unique Email & Phone validation check
    if (isEmailTaken(data.email)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    if (isPhoneTaken(data.phoneNumber)) {
      return { success: false, error: 'An account with this mobile phone number already exists.' };
    }

    const isTutor = data.role === 'tutor';
    const newId = `usr_${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      email: data.email.trim(),
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      role: data.role,
      status: isTutor ? 'pending_verification' : 'active',
      isVerifiedTutor: false,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      bio: data.bio || '',
      subjects: data.subjects || (isTutor ? ['Mathematics'] : []),
      academicLevels: data.academicLevels || (isTutor ? ['Secondary (BGCSE/IGCSE)'] : []),
      hourlyRatePula: data.hourlyRatePula || 150,
      location: data.location || 'Gaborone',
      qualifications: data.qualifications || 'Certified Tutor',
      university: data.university || 'University of Botswana',
      packages: isTutor ? [
        { id: `pkg_${newId}_1`, name: 'Starter Pass (4 Sessions)', sessionCount: 4, pricePula: (data.hourlyRatePula || 150) * 4 * 0.95 },
        { id: `pkg_${newId}_2`, name: 'Intensive Pass (8 Sessions)', sessionCount: 8, pricePula: (data.hourlyRatePula || 150) * 8 * 0.88, isBestValue: true }
      ] : [],
      rating: 0,
      reviewCount: 0,
      totalEarningsPula: 0,
      activeStudentsCount: 0,
      pendingRequestsCount: 0,
      verificationDocs: isTutor ? [`National_ID_Omang_${data.fullName.replace(/\s+/g, '_')}.pdf`, `Degree_Certificate_${data.fullName.replace(/\s+/g, '_')}.pdf`] : []
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoUser = (role: UserRole) => {
    let target = users.find(u => u.role === role);
    if (!target) {
      target = INITIAL_USERS.find(u => u.role === role);
    }
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateUserProfile = (id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchDemoUser,
        updateUserProfile,
        isEmailTaken,
        isPhoneTaken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
