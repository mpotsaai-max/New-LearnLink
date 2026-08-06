import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, pass: string) => {
    success: boolean;
    error?: string;
    requiresEmailVerification?: boolean;
    unverifiedUser?: UserProfile;
  };
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
    courseOrMajor?: string;
    collegeOrUniversity?: string;
    yearsOfExperience?: string;
    resumeDocUrl?: string;
    academicRecordDocUrl?: string;
    omangIdDocUrl?: string;
  }) => { success: boolean; error?: string; user?: UserProfile };
  verifyStudentEmail: (email: string) => { success: boolean; error?: string };
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
    // Standard public visitor default: null (Guest)
    const savedLoggedIn = localStorage.getItem('learnlink_is_logged_in');
    const savedCurrent = localStorage.getItem('learnlink_current_user');
    if (savedLoggedIn === 'true' && savedCurrent) {
      try {
        return JSON.parse(savedCurrent);
      } catch {
        return null;
      }
    }
    // Clean default: public visitor
    return null;
  });

  useEffect(() => {
    localStorage.setItem('learnlink_users', JSON.stringify(users));
  }, [users]);

  // Firestore real-time users synchronization across devices
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteUsers: UserProfile[] = [];
            snapshot.forEach((docSnap) => {
              remoteUsers.push(docSnap.data() as UserProfile);
            });

            setUsers(prev => {
              const map = new Map<string, UserProfile>();
              INITIAL_USERS.forEach(u => map.set(u.id, u));
              prev.forEach(u => map.set(u.id, u));
              remoteUsers.forEach(u => map.set(u.id, u));
              return Array.from(map.values());
            });
          }
        },
        (err) => {
          console.warn('Firestore user listener notice:', err);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Firestore onSnapshot init notice:', e);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('learnlink_current_user', JSON.stringify(currentUser));
      localStorage.setItem('learnlink_is_logged_in', 'true');
    } else {
      localStorage.removeItem('learnlink_current_user');
      localStorage.removeItem('learnlink_is_logged_in');
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

    // Tutor Approval Check: Cannot log in before admin approval
    if (found.role === 'tutor' && (found.status === 'pending_verification' || !found.isVerifiedTutor)) {
      return {
        success: false,
        error: 'Your tutor registration and uploaded credentials (ID, Transcripts, Resume) are currently under review by LearnLink Admin. Tutors cannot log in until account approval.'
      };
    }

    // Student Email Verification Check
    if (found.role === 'student' && found.emailVerified === false) {
      return {
        success: false,
        requiresEmailVerification: true,
        unverifiedUser: found,
        error: 'Your student account email address has not been verified yet. Please enter your email verification code to proceed.'
      };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const verifyStudentEmail = (email: string) => {
    const user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!user) return { success: false, error: 'User account not found.' };

    const updated = { ...user, emailVerified: true };
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    setCurrentUser(updated);

    try {
      setDoc(doc(db, 'users', user.id), { emailVerified: true }, { merge: true }).catch(err => {
        console.warn('Firestore setDoc verify notice:', err);
      });
    } catch (e) {
      console.warn('Firestore update notice:', e);
    }

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
    courseOrMajor?: string;
    collegeOrUniversity?: string;
    yearsOfExperience?: string;
    resumeDocUrl?: string;
    academicRecordDocUrl?: string;
    omangIdDocUrl?: string;
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
    
    // Default placeholder avatar (for tutors, picture upload is enabled AFTER approval)
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`;

    const newUser: UserProfile = {
      id: newId,
      email: data.email.trim(),
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      role: data.role,
      status: isTutor ? 'pending_verification' : 'active',
      isVerifiedTutor: false,
      avatarUrl: defaultAvatar,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      bio: data.bio || (isTutor ? `Tutor in ${data.courseOrMajor || 'General Subjects'} from ${data.collegeOrUniversity || data.university || 'University'}.` : ''),
      subjects: data.subjects || (isTutor ? ['Mathematics'] : []),
      academicLevels: data.academicLevels || (isTutor ? ['Secondary (BGCSE/IGCSE)'] : []),
      hourlyRatePula: data.hourlyRatePula || 150,
      location: data.location || 'Gaborone',
      qualifications: data.qualifications || data.courseOrMajor || 'Degree Candidate',
      university: data.collegeOrUniversity || data.university || 'University of Botswana',
      courseOrMajor: data.courseOrMajor || '',
      collegeOrUniversity: data.collegeOrUniversity || data.university || '',
      yearsOfExperience: data.yearsOfExperience || '',
      packages: isTutor ? [
        { id: `pkg_${newId}_1`, name: 'Starter Pass (4 Sessions)', sessionCount: 4, pricePula: (data.hourlyRatePula || 150) * 4 * 0.95 },
        { id: `pkg_${newId}_2`, name: 'Intensive Pass (8 Sessions)', sessionCount: 8, pricePula: (data.hourlyRatePula || 150) * 8 * 0.88, isBestValue: true }
      ] : [],
      rating: 0, // Initial rating is strictly 0.0 upon registration & initial approval
      reviewCount: 0,
      totalEarningsPula: 0,
      activeStudentsCount: 0,
      pendingRequestsCount: 0,
      verificationDocs: isTutor ? [
        data.omangIdDocUrl ? `Omang/ID: ${data.omangIdDocUrl}` : `National_Omang_ID_${data.fullName.replace(/\s+/g, '_')}.pdf`,
        data.academicRecordDocUrl ? `Academic Record: ${data.academicRecordDocUrl}` : `Academic_Record_${data.fullName.replace(/\s+/g, '_')}.pdf`,
        data.resumeDocUrl ? `Resume/CV: ${data.resumeDocUrl}` : `Resume_CV_${data.fullName.replace(/\s+/g, '_')}.pdf`
      ] : [],
      resumeDocUrl: data.resumeDocUrl || '',
      academicRecordDocUrl: data.academicRecordDocUrl || '',
      omangIdDocUrl: data.omangIdDocUrl || '',
      emailVerified: isTutor ? false : false // Requires email verification for students
    };

    setUsers(prev => [newUser, ...prev]);

    // Do NOT log in tutors automatically upon registration because approval is mandatory
    if (!isTutor) {
      // For student, we leave currentUser unassigned until email verification step is completed
    }

    // Save to Firestore globally for cross-device visibility
    try {
      setDoc(doc(db, 'users', newId), newUser).catch(err => {
        console.warn('Firestore setDoc notice:', err);
      });
    } catch (e) {
      console.warn('Firestore save notice:', e);
    }

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
    setUsers(prev => {
      const updatedList = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      const updatedUser = updatedList.find(u => u.id === id);
      if (updatedUser) {
        try {
          setDoc(doc(db, 'users', id), updatedUser, { merge: true }).catch(err => {
            console.warn('Firestore setDoc merge notice:', err);
          });
        } catch (e) {
          console.warn('Firestore update notice:', e);
        }
      }
      return updatedList;
    });

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
        verifyStudentEmail,
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
