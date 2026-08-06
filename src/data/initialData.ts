import { UserProfile, BookingSession, PaymentTransaction, NotificationItem, ChatThread, ChatMessage, ReviewItem, SimulatedEmail } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_student_demo',
    email: 'thabo.student@learnlink.co.bw',
    fullName: 'Thabo Mokgosi',
    phoneNumber: '+267 71 234 567',
    role: 'student',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    joinedDate: '15 Jan 2026',
  },
  {
    id: 'usr_tutor_1',
    email: 'neo.modise@learnlink.co.bw',
    fullName: 'Neo Modise',
    phoneNumber: '+267 72 111 222',
    role: 'tutor',
    status: 'active',
    isVerifiedTutor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinedDate: '10 Oct 2025',
    bio: 'University of Botswana M.Sc Graduate with 6+ years of experience helping BGCSE & IGCSE students score A*s in Pure Mathematics, Physics, and Further Maths.',
    qualifications: 'M.Sc Applied Mathematics (UB), B.Sc Pure Physics (UB)',
    university: 'University of Botswana (UB)',
    subjects: ['Mathematics', 'Physics', 'Further Maths'],
    academicLevels: ['Secondary (BGCSE/IGCSE)', 'Tertiary (University)'],
    location: 'Gaborone (In-person & Online)',
    hourlyRatePula: 180,
    packages: [
      { id: 'pkg_neo_1', name: 'Starter Pass (4 Sessions)', sessionCount: 4, pricePula: 680, savingsPula: 40 },
      { id: 'pkg_neo_2', name: 'Exam Sprint (8 Sessions)', sessionCount: 8, pricePula: 1280, savingsPula: 160, isBestValue: true },
      { id: 'pkg_neo_3', name: 'Term Master (12 Sessions)', sessionCount: 12, pricePula: 1800, savingsPula: 360 }
    ],
    rating: 4.9,
    reviewCount: 38,
    totalEarningsPula: 14200,
    activeStudentsCount: 9,
    pendingRequestsCount: 2,
    verificationDocs: ['B.Sc_Degree_UB_NeoModise.pdf', 'National_ID_Omang_Verified.pdf', 'Teaching_Certificate_Botswana.pdf']
  },
  {
    id: 'usr_tutor_2',
    email: 'kabo.letsholo@learnlink.co.bw',
    fullName: 'Dr. Kabo Letsholo',
    phoneNumber: '+267 74 333 444',
    role: 'tutor',
    status: 'active',
    isVerifiedTutor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    joinedDate: '01 Dec 2025',
    bio: 'Former Assistant Lecturer specializing in Organic Chemistry, General Biology, and Biochemistry. Passionate about simplifying complex molecular concepts.',
    qualifications: 'Ph.D Biochemistry (UCT), B.Sc Chemistry (UB)',
    university: 'University of Cape Town / UB',
    subjects: ['Chemistry', 'Biology', 'Science'],
    academicLevels: ['Secondary (BGCSE/IGCSE)', 'Tertiary (University)'],
    location: 'Maun (Online Only)',
    hourlyRatePula: 220,
    packages: [
      { id: 'pkg_kabo_1', name: 'Chemistry Boost (4 Sessions)', sessionCount: 4, pricePula: 800, savingsPula: 80 },
      { id: 'pkg_kabo_2', name: 'Bio & Chem Mastery (8 Sessions)', sessionCount: 8, pricePula: 1500, savingsPula: 260, isBestValue: true }
    ],
    rating: 5.0,
    reviewCount: 24,
    totalEarningsPula: 9800,
    activeStudentsCount: 6,
    pendingRequestsCount: 1,
    verificationDocs: ['PhD_Certificate_UCT.pdf', 'National_ID_Omang.pdf']
  },
  {
    id: 'usr_tutor_3',
    email: 'tshepo.phiri@learnlink.co.bw',
    fullName: 'Tshepo Phiri',
    phoneNumber: '+267 76 555 666',
    role: 'tutor',
    status: 'active',
    isVerifiedTutor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    joinedDate: '12 Jan 2026',
    bio: 'Software Engineer & Tech Instructor. Teaching Python, Web Development (HTML/CSS/JS), Database SQL, and Computer Studies for Secondary and College students.',
    qualifications: 'B.Sc Computer Science (BIUST)',
    university: 'Botswana International University of Science & Technology (BIUST)',
    subjects: ['Computer Science', 'Programming (Python)', 'Information Technology'],
    academicLevels: ['Secondary (BGCSE/IGCSE)', 'Tertiary (University)', 'Professional/Adult'],
    location: 'Gaborone (In-person & Online)',
    hourlyRatePula: 150,
    packages: [
      { id: 'pkg_tshepo_1', name: 'Code Starter (4 Sessions)', sessionCount: 4, pricePula: 550, savingsPula: 50 },
      { id: 'pkg_tshepo_2', name: 'Full Stack Basics (10 Sessions)', sessionCount: 10, pricePula: 1300, savingsPula: 200, isBestValue: true }
    ],
    rating: 4.8,
    reviewCount: 19,
    totalEarningsPula: 6400,
    activeStudentsCount: 5,
    pendingRequestsCount: 0,
    verificationDocs: ['BIUST_CS_Degree.pdf', 'Omang_ID_Tshepo.pdf']
  },
  {
    id: 'usr_tutor_4',
    email: 'kagiso.seboni@learnlink.co.bw',
    fullName: 'Kagiso Seboni',
    phoneNumber: '+267 75 777 888',
    role: 'tutor',
    status: 'active',
    isVerifiedTutor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    joinedDate: '20 Nov 2025',
    bio: 'Certified High School English Language & Literature Educator. Expert in BGCSE Essay Writing, Grammar, and Literature set books analysis.',
    qualifications: 'B.Ed Secondary Education (English Major, UB)',
    university: 'University of Botswana',
    subjects: ['English Language', 'English Literature', 'General Studies'],
    academicLevels: ['Primary (PSLE)', 'Secondary (Junior/BGCSE)'],
    location: 'Francistown (In-person & Online)',
    hourlyRatePula: 140,
    packages: [
      { id: 'pkg_kagiso_1', name: 'Essay Mastery (4 Sessions)', sessionCount: 4, pricePula: 500, savingsPula: 60 }
    ],
    rating: 4.7,
    reviewCount: 15,
    totalEarningsPula: 5100,
    activeStudentsCount: 4,
    pendingRequestsCount: 0,
    verificationDocs: ['BEd_Degree_UB.pdf', 'Omang_ID_Kagiso.pdf']
  },
  {
    id: 'usr_tutor_5',
    email: 'lerato.motsumi@learnlink.co.bw',
    fullName: 'Lerato Motsumi',
    phoneNumber: '+267 72 999 000',
    role: 'tutor',
    status: 'active',
    isVerifiedTutor: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    joinedDate: '05 Jan 2026',
    bio: 'ACCA Affiliate & Corporate Finance Specialist. Helping ACCA, BAC, and BGCSE Commerce & Accounting students excel with clear step-by-step problem solving.',
    qualifications: 'ACCA Affiliate, B.A Accounting & Finance (BAC)',
    university: 'Botswana Accountancy College (BAC)',
    subjects: ['Financial Accounting', 'Commerce', 'Economics'],
    academicLevels: ['Secondary (BGCSE)', 'Tertiary (BAC/UB)', 'Professional (ACCA/CIMA)'],
    location: 'Palapye (Online Only)',
    hourlyRatePula: 190,
    packages: [
      { id: 'pkg_lerato_1', name: 'Accounting Intensive (6 Sessions)', sessionCount: 6, pricePula: 1050, savingsPula: 90, isBestValue: true }
    ],
    rating: 4.9,
    reviewCount: 22,
    totalEarningsPula: 8200,
    activeStudentsCount: 7,
    pendingRequestsCount: 1,
    verificationDocs: ['BAC_Degree_Accounting.pdf', 'ACCA_Transcript.pdf', 'Omang_ID.pdf']
  },
  {
    id: 'usr_tutor_pending_1',
    email: 'thato.kgaodi@learnlink.co.bw',
    fullName: 'Thato Kgaodi',
    phoneNumber: '+267 71 888 222',
    role: 'tutor',
    status: 'pending_verification',
    isVerifiedTutor: false,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    joinedDate: '04 Aug 2026',
    bio: 'Specialist Setswana & Social Studies educator focusing on Primary and Junior Secondary curriculum. Eager to assist students build native fluency and exam confidence.',
    qualifications: 'Diploma in Primary Education (Tlokweng College)',
    university: 'Tlokweng College of Education',
    subjects: ['Setswana', 'Social Studies'],
    academicLevels: ['Primary (PSLE)', 'Secondary (Junior High)'],
    location: 'Gaborone (In-person)',
    hourlyRatePula: 120,
    packages: [],
    rating: 0,
    reviewCount: 0,
    totalEarningsPula: 0,
    activeStudentsCount: 0,
    pendingRequestsCount: 0,
    verificationDocs: ['Diploma_Tlokweng_College.pdf', 'Omang_Thato_Kgaodi.pdf', 'Character_Reference_Letter.pdf']
  },
  {
    id: 'usr_admin_demo',
    email: 'admin@learnlink.co.bw',
    fullName: 'LearnLink Admin',
    phoneNumber: '+267 39 000 111',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    joinedDate: '01 Oct 2025'
  }
];

export const INITIAL_SESSIONS: BookingSession[] = [
  {
    id: 'ses_101',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    studentEmail: 'thabo.student@learnlink.co.bw',
    studentPhone: '+267 71 234 567',
    tutorId: 'usr_tutor_1',
    tutorName: 'Neo Modise',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    subject: 'Pure Mathematics',
    academicLevel: 'Secondary (BGCSE/IGCSE)',
    date: '2026-08-08',
    time: '15:00 - 16:30',
    durationHours: 1.5,
    pricePula: 270,
    status: 'accepted',
    paymentMethod: 'OrangeMoney',
    escrowStatus: 'escrow_held',
    meetingMode: 'Online',
    videoCallUrl: 'https://learnlink.daily.co/ses-101-puremaths',
    notes: 'Focus on Calculus Integration by parts and Trigonometric Identities past papers.',
    createdAt: '2026-08-05'
  },
  {
    id: 'ses_102',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    studentEmail: 'thabo.student@learnlink.co.bw',
    studentPhone: '+267 71 234 567',
    tutorId: 'usr_tutor_3',
    tutorName: 'Tshepo Phiri',
    tutorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    subject: 'Programming (Python)',
    academicLevel: 'Tertiary (University)',
    date: '2026-08-10',
    time: '10:00 - 11:30',
    durationHours: 1.5,
    pricePula: 225,
    status: 'pending',
    paymentMethod: 'Smega',
    escrowStatus: 'escrow_held',
    meetingMode: 'Online',
    videoCallUrl: 'https://learnlink.daily.co/ses-102-python',
    notes: 'Introduction to Data Structures, Arrays and Hash Maps in Python.',
    createdAt: '2026-08-06'
  },
  {
    id: 'ses_103',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    studentEmail: 'thabo.student@learnlink.co.bw',
    studentPhone: '+267 71 234 567',
    tutorId: 'usr_tutor_1',
    tutorName: 'Neo Modise',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    subject: 'Physics',
    academicLevel: 'Secondary (BGCSE/IGCSE)',
    date: '2026-08-01',
    time: '14:00 - 15:30',
    durationHours: 1.5,
    pricePula: 270,
    status: 'completed',
    paymentMethod: 'OrangeMoney',
    escrowStatus: 'released_to_tutor',
    meetingMode: 'In-person',
    locationStr: 'Gaborone Public Library Study Lounge',
    notes: 'Newtonian Dynamics and Momentum calculation exercises.',
    ratingGiven: 5,
    reviewGiven: 'Neo was exceptionally clear and patient. He helped me solve 5 tough BGCSE exam questions in under an hour!',
    createdAt: '2026-07-29'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_8801',
    sessionId: 'ses_101',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    tutorId: 'usr_tutor_1',
    tutorName: 'Neo Modise',
    amountPula: 270,
    platformFeePula: 40.5, // 15%
    tutorPayoutPula: 229.5, // 85%
    paymentMethod: 'OrangeMoney',
    mobileNumber: '+267 71 234 567',
    transactionRef: 'OM-20260805-9921',
    status: 'escrow_held',
    timestamp: '2026-08-05 14:32'
  },
  {
    id: 'tx_8802',
    sessionId: 'ses_102',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    tutorId: 'usr_tutor_3',
    tutorName: 'Tshepo Phiri',
    amountPula: 225,
    platformFeePula: 33.75,
    tutorPayoutPula: 191.25,
    paymentMethod: 'Smega',
    mobileNumber: '+267 71 234 567',
    transactionRef: 'SM-20260806-1044',
    status: 'escrow_held',
    timestamp: '2026-08-06 09:15'
  },
  {
    id: 'tx_8800',
    sessionId: 'ses_103',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    tutorId: 'usr_tutor_1',
    tutorName: 'Neo Modise',
    amountPula: 270,
    platformFeePula: 40.5,
    tutorPayoutPula: 229.5,
    paymentMethod: 'OrangeMoney',
    mobileNumber: '+267 71 234 567',
    transactionRef: 'OM-20260729-4410',
    status: 'released_to_tutor',
    timestamp: '2026-08-01 16:00'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_1',
    tutorId: 'usr_tutor_1',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Neo was exceptionally clear and patient. He helped me solve 5 tough BGCSE exam questions in under an hour!',
    subject: 'Physics',
    date: '01 Aug 2026'
  },
  {
    id: 'rev_2',
    tutorId: 'usr_tutor_1',
    studentId: 'usr_student_2',
    studentName: 'Lesedi Marathe',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Scored an A in my mid-term Pure Maths test after taking Neo’s 8-session exam sprint package. Best tutor in Gaborone!',
    subject: 'Pure Mathematics',
    date: '22 Jul 2026'
  },
  {
    id: 'rev_3',
    tutorId: 'usr_tutor_2',
    studentId: 'usr_student_3',
    studentName: 'Kagiso Tsimako',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Dr. Kabo simplified organic chemistry reaction mechanisms so well. Online sessions were smooth and high quality.',
    subject: 'Chemistry',
    date: '28 Jul 2026'
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_1',
    studentId: 'usr_student_demo',
    studentName: 'Thabo Mokgosi',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tutorId: 'usr_tutor_1',
    tutorName: 'Neo Modise',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    lastMessage: 'I have reviewed your past paper solutions. Looking forward to our Saturday session!',
    lastMessageTime: '10:45 AM',
    unreadCount: 1
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    chatId: 'chat_1',
    senderId: 'usr_student_demo',
    senderName: 'Thabo Mokgosi',
    senderRole: 'student',
    recipientId: 'usr_tutor_1',
    content: 'Dumela Rra Neo, please remember to send me the Calculus worksheet before Saturday.',
    timestamp: '10:30 AM',
    isRead: true
  },
  {
    id: 'msg_2',
    chatId: 'chat_1',
    senderId: 'usr_tutor_1',
    senderName: 'Neo Modise',
    senderRole: 'tutor',
    recipientId: 'usr_student_demo',
    content: 'I have reviewed your past paper solutions. Looking forward to our Saturday session!',
    timestamp: '10:45 AM',
    isRead: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_student_demo',
    title: 'Booking Accepted',
    message: 'Neo Modise accepted your Pure Mathematics session request for Sat, 8 Aug at 15:00.',
    type: 'booking',
    timestamp: 'Yesterday at 14:35',
    isRead: false
  },
  {
    id: 'notif_2',
    userId: 'usr_student_demo',
    title: 'Payment Secured in Escrow',
    message: 'P270.00 is held safely in OrangeMoney Escrow. Funds will only be released after your session is completed.',
    type: 'payment',
    timestamp: '05 Aug 2026',
    isRead: true
  },
  {
    id: 'notif_3',
    userId: 'usr_tutor_1',
    title: 'New Booking Request',
    message: 'Thabo Mokgosi requested a 1.5-hr Pure Mathematics session.',
    type: 'booking',
    timestamp: '05 Aug 2026',
    isRead: false
  }
];

export const INITIAL_EMAILS: SimulatedEmail[] = [
  {
    id: 'em_101',
    recipientEmail: 'thabo.student@learnlink.co.bw',
    recipientName: 'Thabo Mokgosi',
    subject: '[LearnLink Escrow] Payment Confirmation - P270.00 Held in Escrow',
    body: 'Dear Thabo,\n\nYour payment of P270.00 via OrangeMoney has been successfully received and secured in LearnLink Escrow for session #ses_101 with Neo Modise.\n\nFunds remain protected until you confirm session completion.\n\nThank you,\nLearnLink Botswana Team',
    sentAt: '05 Aug 2026, 14:32',
    triggerEvent: 'payment_escrow'
  },
  {
    id: 'em_102',
    recipientEmail: 'neo.modise@learnlink.co.bw',
    recipientName: 'Neo Modise',
    subject: '[LearnLink Session] Booking Request Accepted for Pure Mathematics',
    body: 'Hello Neo,\n\nYou accepted the session request from Thabo Mokgosi scheduled for 08 Aug 2026 at 15:00.\n\nMeeting Mode: Online (Link: https://meet.learnlink.co.bw/ses-101-puremaths)\n\nLearnLink Support',
    sentAt: '05 Aug 2026, 14:35',
    triggerEvent: 'booking_accepted'
  }
];

export const SUBJECT_CATEGORIES = [
  { name: 'Mathematics', icon: 'Calculator', count: '18 Tutors', popular: true },
  { name: 'Physics & Science', icon: 'Atom', count: '14 Tutors', popular: true },
  { name: 'Chemistry & Biology', icon: 'FlaskConical', count: '12 Tutors', popular: true },
  { name: 'Computer Programming', icon: 'Code', count: '10 Tutors', popular: true },
  { name: 'English & Literature', icon: 'BookOpen', count: '15 Tutors', popular: false },
  { name: 'Accounting & Finance', icon: 'Landmark', count: '9 Tutors', popular: false },
  { name: 'Setswana Language', icon: 'Languages', count: '8 Tutors', popular: false },
  { name: 'Economics & Commerce', icon: 'TrendingUp', count: '7 Tutors', popular: false }
];

export const BOTSWANA_LOCATIONS = [
  'All Locations',
  'Gaborone (In-person & Online)',
  'Francistown (In-person & Online)',
  'Maun (Online Only)',
  'Palapye (In-person & Online)',
  'Lobatse (In-person)',
  'Remote / Online Only'
];

export const ACADEMIC_LEVELS = [
  'All Academic Levels',
  'Primary (PSLE)',
  'Secondary (Junior / BGCSE / IGCSE)',
  'Tertiary (University / College)',
  'Professional / ACCA / Adult'
];
