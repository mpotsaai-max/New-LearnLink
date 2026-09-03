import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { db, auth } from '../firebase/config';

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, pass: string) => Promise<{
    success: boolean;
    error?: string;
    requiresEmailVerification?: boolean;
    unverifiedUser?: UserProfile;
  }>;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
    isNewUser?: boolean;
  }>;
  register: (userData: {
    fullName: string;
    email: string;
    password?: string;
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
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile; firebaseEmailSent?: boolean }>;
  verifyStudentEmail: (email: string) => { success: boolean; error?: string };
  resendVerificationEmail: (email?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  checkEmailVerified: (email?: string) => Promise<{ verified: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  updateUserProfile: (id: string, updates: Partial<UserProfile>) => void;
  deleteUserByEmail: (email: string) => Promise<void>;
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
          const remoteUsers: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            remoteUsers.push(docSnap.data() as UserProfile);
          });

          setUsers(() => {
            const map = new Map<string, UserProfile>();
            // Add initial demo baseline users
            INITIAL_USERS.forEach(u => map.set(u.id, u));
            // Add all live remote users from Firestore
            remoteUsers.forEach(u => map.set(u.id, u));
            const updated = Array.from(map.values());
            localStorage.setItem('learnlink_users', JSON.stringify(updated));
            return updated;
          });
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
    const cleanEmail = email.trim().toLowerCase();
    // Protect demo accounts
    if (INITIAL_USERS.some(u => u.email.trim().toLowerCase() === cleanEmail)) {
      return true;
    }
    return users.some(u => u.email.trim().toLowerCase() === cleanEmail);
  };

  const isPhoneTaken = (phone: string, currentEmail?: string) => {
    if (!phone || phone.trim().length < 6) return false;
    const clean = phone.replace(/\s+/g, '');
    return users.some(u => {
      if (currentEmail && u.email.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
        return false;
      }
      return u.phoneNumber.replace(/\s+/g, '') === clean;
    });
  };

  const signInWithGoogle = async (preferredRole: UserRole = 'student'): Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
    isNewUser?: boolean;
  }> => {
    try {
      if (!auth) {
        return { success: false, error: 'Firebase authentication is not initialized.' };
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const cleanEmail = (fbUser.email || '').trim().toLowerCase();

      if (!cleanEmail) {
        return { success: false, error: 'No email address found in this Google Account.' };
      }

      // Check if user already exists in system
      const existing = users.find(u => u.email.trim().toLowerCase() === cleanEmail);

      if (existing) {
        if (existing.status === 'suspended') {
          return { success: false, error: 'Your account has been suspended by LearnLink Admin. Please contact support@learnlink.co.bw.' };
        }
        if (existing.role === 'tutor' && (existing.status === 'pending_verification' || !existing.isVerifiedTutor)) {
          return {
            success: false,
            error: 'Your tutor registration is currently pending admin verification and document review. Tutors cannot log in until approved.'
          };
        }
        // Google accounts are pre-verified by Google
        const verifiedUser = { ...existing, emailVerified: true };
        setCurrentUser(verifiedUser);
        return { success: true, user: verifiedUser, isNewUser: false };
      }

      // New registration via Google Account
      const isTutor = preferredRole === 'tutor';
      const newId = `usr_g_${Date.now()}`;
      const newUser: UserProfile = {
        id: newId,
        email: cleanEmail,
        fullName: fbUser.displayName || cleanEmail.split('@')[0],
        phoneNumber: fbUser.phoneNumber || '',
        role: preferredRole,
        status: isTutor ? 'pending_verification' : 'active',
        isVerifiedTutor: false,
        emailVerified: true, // Google accounts are verified by Google!
        avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        rating: 0,
        reviewCount: 0,
        totalEarningsPula: 0,
        activeStudentsCount: 0,
        pendingRequestsCount: 0,
        packages: isTutor ? [
          { id: `pkg_${newId}_1`, name: 'Starter Pass (4 Sessions)', sessionCount: 4, pricePula: 600 },
          { id: `pkg_${newId}_2`, name: 'Intensive Pass (8 Sessions)', sessionCount: 8, pricePula: 1100, isBestValue: true }
        ] : []
      };

      setUsers(prev => [newUser, ...prev.filter(u => u.email.trim().toLowerCase() !== cleanEmail)]);

      if (!isTutor) {
        setCurrentUser(newUser);
      }

      // Sync user to Firestore
      try {
        await setDoc(doc(db, 'users', newId), newUser);
      } catch (e) {
        console.warn('Firestore Google user save notice:', e);
      }

      return { success: true, user: newUser, isNewUser: true };
    } catch (err: any) {
      console.warn('Google sign-in notice:', err);
      if (err?.code === 'auth/popup-blocked') {
        return { 
          success: false, 
          error: 'The Google Sign-In popup window was blocked by your browser. Please allow popups or open LearnLink in a new tab.' 
        };
      }
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in window was closed before completing.' };
      }
      if (err?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Another sign-in window is already open.' };
      }
      if (err?.code === 'auth/operation-not-allowed') {
        return { 
          success: false, 
          error: 'Google Sign-In is not enabled yet in your Firebase Console. Go to Authentication > Sign-in method, click "Add new provider", select "Google", and enable it.' 
        };
      }
      if (err?.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Domain not authorized in Firebase. Add this domain or learnlink.ink to Firebase Console > Authentication > Settings > Authorized domains.'
        };
      }
      return { success: false, error: err?.message || 'Failed to authenticate with Google.' };
    }
  };

  const login = async (email: string, pass: string): Promise<{
    success: boolean;
    error?: string;
    requiresEmailVerification?: boolean;
    unverifiedUser?: UserProfile;
  }> => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.trim().toLowerCase() === cleanEmail);

    if (found) {
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
    }

    let firebaseAuthSuccess = false;
    // Attempt Firebase Authentication with email & password
    if (auth && pass && pass.length >= 6) {
      try {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
        firebaseAuthSuccess = true;
      } catch (fbErr: any) {
        console.warn('Firebase Auth sign-in notice:', fbErr?.code || fbErr?.message);
        if (fbErr?.code === 'auth/invalid-credential' || fbErr?.code === 'auth/wrong-password') {
          return { success: false, error: 'Incorrect email address or password. Please check your credentials.' };
        }
        if (fbErr?.code === 'auth/user-disabled') {
          return { success: false, error: 'This user account has been disabled.' };
        }
      }
    }

    // Found in system users list
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    // Authenticated via Firebase Auth but first time on this browser
    if (firebaseAuthSuccess) {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email.trim(),
        fullName: email.split('@')[0],
        phoneNumber: '',
        role: 'student',
        status: 'active',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      return { success: true };
    }

    return { success: false, error: 'No registered account found with this email address. Please click Register to create an account.' };
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

  const register = async (data: {
    fullName: string;
    email: string;
    password?: string;
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
  }): Promise<{ success: boolean; error?: string; user?: UserProfile; firebaseEmailSent?: boolean }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Protect hardcoded initial demo accounts from being overwritten
    const isDemoAccount = INITIAL_USERS.some(u => u.email.trim().toLowerCase() === cleanEmail);
    if (isDemoAccount) {
      return { success: false, error: 'This is a protected demo email address. Please use your personal email address.' };
    }

    if (isPhoneTaken(data.phoneNumber, data.email)) {
      return { success: false, error: 'An account with this mobile phone number already exists.' };
    }

    // Attempt Firebase Authentication account creation
    let firebaseEmailSent = false;
    if (auth && data.password && data.password.length >= 6) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
        if (userCred.user) {
          try {
            await sendEmailVerification(userCred.user);
            firebaseEmailSent = true;
            console.log('Firebase verification email successfully sent to:', data.email.trim());
          } catch (emailErr: any) {
            console.warn('Firebase sendEmailVerification notice:', emailErr?.code || emailErr?.message);
          }
        }
      } catch (fbErr: any) {
        console.warn('Firebase Auth createUser notice:', fbErr?.code || fbErr?.message);
        if (fbErr?.code === 'auth/email-already-in-use') {
          return { success: false, error: 'This email address is already registered in Firebase. Please sign in.' };
        }
        if (fbErr?.code === 'auth/weak-password') {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }
        if (fbErr?.code === 'auth/operation-not-allowed') {
          return { 
            success: false, 
            error: 'Firebase Auth: Email/Password sign-in provider is not enabled in your Firebase Console (Authentication > Sign-in method).' 
          };
        }
        if (fbErr?.code === 'auth/invalid-email') {
          return { success: false, error: 'Please enter a valid email address.' };
        }
      }
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

    setUsers(prev => [newUser, ...prev.filter(u => u.email.trim().toLowerCase() !== cleanEmail)]);

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

    return { success: true, user: newUser, firebaseEmailSent };
  };

  const resendVerificationEmail = async (email?: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      if (auth && auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { 
          success: true, 
          message: `Firebase verification email resent to ${auth.currentUser.email || email}. Please check your inbox and spam folder.` 
        };
      }
      return { 
        success: false, 
        error: 'Unable to resend: No active Firebase Auth user session. Please sign in or re-register.' 
      };
    } catch (err: any) {
      console.warn('Firebase resend verification error:', err);
      if (err?.code === 'auth/too-many-requests') {
        return { success: false, error: 'Firebase rate-limit: Please wait a moment before requesting another email.' };
      }
      return { success: false, error: err?.message || 'Failed to dispatch verification email.' };
    }
  };

  const checkEmailVerified = async (email?: string): Promise<{ verified: boolean; error?: string }> => {
    try {
      if (auth && auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          const targetEmail = email || auth.currentUser.email;
          if (targetEmail) {
            verifyStudentEmail(targetEmail);
          }
          return { verified: true };
        }
        return { verified: false };
      }
      return { verified: false, error: 'No active session found.' };
    } catch (err: any) {
      return { verified: false, error: err?.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      if (auth) {
        signOut(auth).catch(err => console.warn('Firebase signOut notice:', err));
      }
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
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

  const deleteUserByEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.trim().toLowerCase() === cleanEmail);
    if (found) {
      try {
        await deleteDoc(doc(db, 'users', found.id));
      } catch (e) {
        console.warn('Firestore deleteDoc notice:', e);
      }
    }
    setUsers(prev => {
      const updated = prev.filter(u => u.email.trim().toLowerCase() !== cleanEmail);
      localStorage.setItem('learnlink_users', JSON.stringify(updated));
      return updated;
    });
    if (currentUser?.email.trim().toLowerCase() === cleanEmail) {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signInWithGoogle,
        register,
        verifyStudentEmail,
        resendVerificationEmail,
        checkEmailVerified,
        logout,
        switchDemoUser,
        updateUserProfile,
        deleteUserByEmail,
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
