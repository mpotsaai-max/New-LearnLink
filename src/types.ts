export type UserRole = 'student' | 'tutor' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
  joinedDate: string;
  isVerifiedTutor?: boolean;
  
  // Tutor Specific
  bio?: string;
  qualifications?: string;
  university?: string;
  courseOrMajor?: string;
  collegeOrUniversity?: string;
  yearsOfExperience?: string;
  subjects?: string[];
  academicLevels?: string[];
  location?: string;
  hourlyRatePula?: number;
  packages?: TutorPackage[];
  rating?: number;
  reviewCount?: number;
  totalEarningsPula?: number;
  activeStudentsCount?: number;
  pendingRequestsCount?: number;
  verificationDocs?: string[];
  resumeDocUrl?: string;
  academicRecordDocUrl?: string;
  omangIdDocUrl?: string;

  // Student Specific Verification & Preferences
  emailVerified?: boolean;
  studentIdDocUrl?: string;
  preferredPaymentMethod?: PaymentMethod | 'BankEFT' | '';
}

export interface TutorPackage {
  id: string;
  name: string;
  sessionCount: number;
  pricePula: number;
  savingsPula?: number;
  isBestValue?: boolean;
}

export interface AvailabilitySlot {
  id: string;
  tutorId: string;
  day: string; // e.g. "Mon, 12"
  time: string; // e.g. "15:00"
  isBooked: boolean;
  bookedByStudentId?: string;
}

export type SessionStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type PaymentMethod = 'OrangeMoney' | 'Smega' | 'MyZaka';
export type EscrowStatus = 'escrow_held' | 'released_to_tutor' | 'refunded';

export interface BookingSession {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  subject: string;
  academicLevel: string;
  date: string;
  time: string;
  durationHours: number;
  pricePula: number;
  status: SessionStatus;
  paymentMethod: PaymentMethod;
  escrowStatus: EscrowStatus;
  meetingMode: 'Online' | 'In-person';
  locationStr?: string;
  videoCallUrl?: string;
  notes?: string;
  ratingGiven?: number;
  reviewGiven?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  amountPula: number;
  platformFeePula: number; // 15%
  tutorPayoutPula: number; // 85%
  paymentMethod: PaymentMethod;
  mobileNumber: string;
  transactionRef: string;
  status: EscrowStatus;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'verification' | 'reminder' | 'chat' | 'system';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ReviewItem {
  id: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  subject: string;
  date: string;
}

export interface SimulatedEmail {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  triggerEvent: string;
}
