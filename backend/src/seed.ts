import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from './utils/logger';

const prisma = new PrismaClient();

// Sample data constants
const SUBJECTS = [
  { name: 'Mathematics', category: 'STEM', description: 'Algebra, Geometry, Calculus, Statistics' },
  { name: 'Physics', category: 'STEM', description: 'Mechanics, Thermodynamics, Electromagnetism' },
  { name: 'Chemistry', category: 'STEM', description: 'Organic, Inorganic, Physical Chemistry' },
  { name: 'Biology', category: 'STEM', description: 'Cell Biology, Genetics, Ecology' },
  { name: 'Computer Science', category: 'STEM', description: 'Programming, Algorithms, Data Structures' },
  { name: 'English', category: 'LANGUAGES', description: 'Grammar, Literature, Writing, Speaking' },
  { name: 'Russian', category: 'LANGUAGES', description: 'Grammar, Literature, Conversation' },
  { name: 'Uzbek', category: 'LANGUAGES', description: 'Native language, Literature, Writing' },
  { name: 'History', category: 'HUMANITIES', description: 'World History, Uzbekistan History' },
  { name: 'Geography', category: 'HUMANITIES', description: 'Physical and Human Geography' },
  { name: 'Economics', category: 'BUSINESS', description: 'Microeconomics, Macroeconomics' },
  { name: 'Accounting', category: 'BUSINESS', description: 'Financial and Management Accounting' },
  { name: 'Art', category: 'CREATIVE', description: 'Drawing, Painting, Digital Art' },
  { name: 'Music', category: 'CREATIVE', description: 'Piano, Guitar, Voice, Music Theory' },
  { name: 'IELTS Preparation', category: 'TEST_PREP', description: 'IELTS Speaking, Writing, Reading, Listening' },
  { name: 'SAT Preparation', category: 'TEST_PREP', description: 'SAT Math, English, Essay Writing' },
];

const REGIONS = [
  'Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Fergana', 'Namangan',
  'Nukus', 'Urgench', 'Termez', 'Qarshi', 'Jizzakh', 'Gulistan', 'Navoi'
];

const UZBEK_NAMES = {
  male: {
    first: ['Akmal', 'Bobur', 'Davron', 'Elyor', 'Farrux', 'Gulom', 'Hasanjon', 'Islom', 'Javohir', 'Karim', 'Lochin', 'Murod', 'Nodirjon', 'Otabek', 'Pulat', 'Qobil', 'Rustam', 'Sardor', 'Temur', 'Ulugbek'],
    last: ['Abdullayev', 'Aliyev', 'Bobomurodov', 'Dustmatov', 'Ergashev', 'Fayzullayev', 'Gafurov', 'Hasanov', 'Ibragimov', 'Juraev', 'Karimov', 'Latipov', 'Mirzayev', 'Nazarov', 'Ochilov', 'Pulatov', 'Qosimov', 'Rahmonov', 'Solijonov', 'Toshmatov']
  },
  female: {
    first: ['Aziza', 'Barno', 'Dildora', 'Elvira', 'Feruza', 'Gulnora', 'Hilola', 'Iroda', 'Jamila', 'Kamola', 'Laylo', 'Madina', 'Nilufar', 'Oysha', 'Parichehr', 'Qunduz', 'Ruxsora', 'Sevara', 'Turgunoy', 'Umida'],
    last: ['Abdullayeva', 'Aliyeva', 'Bobomurodova', 'Dustmatova', 'Ergasheva', 'Fayzullayeva', 'Gafurova', 'Hasanova', 'Ibragimova', 'Juraeva', 'Karimova', 'Latipova', 'Mirzayeva', 'Nazarova', 'Ochilova', 'Pulatova', 'Qosimova', 'Rahmonova', 'Solijonova', 'Toshmatova']
  }
};

const SAMPLE_BIOS = [
  "Experienced educator with 5+ years of teaching experience. Passionate about helping students achieve their academic goals.",
  "Graduate from Tashkent State University. Specialized in modern teaching methodologies and student-centered learning.",
  "Professional tutor with proven track record of improving student performance. Patient and dedicated teacher.",
  "Certified teacher with expertise in curriculum development. Committed to making learning engaging and effective.",
  "Former university lecturer turned private tutor. Expert in exam preparation and academic coaching.",
  "Multilingual educator with international teaching experience. Focused on developing critical thinking skills.",
  "Young and enthusiastic teacher who uses innovative teaching methods. Great with students of all ages.",
  "Experienced online tutor with excellent communication skills. Specialized in one-on-one instruction.",
  "Subject matter expert with industry experience. Brings real-world examples to enhance learning.",
  "Dedicated educator committed to student success. Creates personalized learning plans for each student."
];

// Utility functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePhoneNumber(): string {
  return `+998${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'mail.ru'];
  const domain = getRandomElement(domains);
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
  return `${username}@${domain}`;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFutureDate(daysFromNow: number): Date {
  const now = new Date();
  return new Date(now.getTime() + Math.random() * daysFromNow * 24 * 60 * 60 * 1000);
}

async function createSubjects() {
  logger.info('Creating subjects...');
  
  for (const subject of SUBJECTS) {
    await prisma.subject.create({
      data: subject
    });
  }
  
  logger.info(`Created ${SUBJECTS.length} subjects`);
}

async function createAdminUser() {
  logger.info('Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.create({
    data: {
      email: 'admin@tutoring.uz',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    }
  });
  
  logger.info('Admin user created');
}

async function createTeachers(count: number = 50) {
  logger.info(`Creating ${count} teachers...`);
  
  const subjects = await prisma.subject.findMany();
  
  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = getRandomElement(UZBEK_NAMES[gender].first);
    const lastName = getRandomElement(UZBEK_NAMES[gender].last);
    const email = generateEmail(firstName, lastName);
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'TEACHER',
        isActive: true,
        emailVerified: Math.random() > 0.1, // 90% verified
        emailVerifiedAt: Math.random() > 0.1 ? getRandomDate(new Date(2023, 0, 1), new Date()) : null,
        lastLoginAt: getRandomDate(new Date(2024, 0, 1), new Date()),
      }
    });
    
    // Create teacher profile
    const teacher = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        bio: getRandomElement(SAMPLE_BIOS),
        experienceYears: Math.floor(Math.random() * 15) + 1,
        education: 'Bachelor\'s degree in relevant field',
        specializations: getRandomElements(SUBJECTS.map(s => s.name), Math.floor(Math.random() * 3) + 1),
        languages: getRandomElements(['Uzbek', 'Russian', 'English'], Math.floor(Math.random() * 2) + 1),
        hourlyRate: Math.floor(Math.random() * 100000) + 50000, // 50,000 - 150,000 UZS
        city: getRandomElement(REGIONS),
        region: getRandomElement(REGIONS),
        country: 'Uzbekistan',
        phoneNumber: generatePhoneNumber(),
        isVerified: Math.random() > 0.2, // 80% verified
        verifiedAt: Math.random() > 0.2 ? getRandomDate(new Date(2023, 6, 1), new Date()) : null,
        rating: Math.random() * 2 + 3, // 3.0 - 5.0
        totalReviews: Math.floor(Math.random() * 50),
        completedLessons: Math.floor(Math.random() * 200),
        responseTime: Math.floor(Math.random() * 1440) + 60, // 1-24 hours in minutes
        isAvailable: Math.random() > 0.3, // 70% available
      }
    });
    
    // Create subject offerings
    const teacherSubjects = getRandomElements(subjects, Math.floor(Math.random() * 4) + 1);
    for (const subject of teacherSubjects) {
      await prisma.subjectOffering.create({
        data: {
          teacherId: teacher.id,
          subjectName: subject.name,
          level: getRandomElement(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
          pricePerHour: Math.floor(Math.random() * 100000) + 30000, // 30,000 - 130,000 UZS
          description: `Comprehensive ${subject.name} tutoring with personalized approach`,
        }
      });
    }
    
    // Create availability slots for next 30 days
    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      
      // Skip some days randomly
      if (Math.random() > 0.8) continue;
      
      // Create 2-6 slots per day
      const slotsCount = Math.floor(Math.random() * 5) + 2;
      for (let slot = 0; slot < slotsCount; slot++) {
        const startHour = Math.floor(Math.random() * 14) + 8; // 8 AM to 10 PM
        const startTime = new Date(date);
        startTime.setHours(startHour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(startHour + Math.floor(Math.random() * 3) + 1); // 1-4 hour slots
        
        await prisma.availabilitySlot.create({
          data: {
            teacherId: teacher.id,
            startTime,
            endTime,
            isBooked: Math.random() > 0.7, // 30% booked
            isRecurring: Math.random() > 0.8, // 20% recurring
          }
        });
      }
    }
  }
  
  logger.info(`Created ${count} teachers with profiles and availability`);
}

async function createStudents(count: number = 100) {
  logger.info(`Creating ${count} students...`);
  
  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = getRandomElement(UZBEK_NAMES[gender].first);
    const lastName = getRandomElement(UZBEK_NAMES[gender].last);
    const email = generateEmail(firstName, lastName);
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'STUDENT',
        isActive: true,
        emailVerified: Math.random() > 0.15, // 85% verified
        emailVerifiedAt: Math.random() > 0.15 ? getRandomDate(new Date(2023, 0, 1), new Date()) : null,
        lastLoginAt: getRandomDate(new Date(2024, 0, 1), new Date()),
      }
    });
    
    // Create student profile
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        dateOfBirth: getRandomDate(new Date(1995, 0, 1), new Date(2010, 0, 1)),
        phoneNumber: generatePhoneNumber(),
        city: getRandomElement(REGIONS),
        region: getRandomElement(REGIONS),
        country: 'Uzbekistan',
        educationLevel: getRandomElement(['HIGH_SCHOOL', 'UNDERGRADUATE', 'GRADUATE', 'OTHER']),
        preferredSubjects: getRandomElements(SUBJECTS.map(s => s.name), Math.floor(Math.random() * 5) + 1),
        learningGoals: 'Improve academic performance and prepare for exams',
        preferredLanguage: getRandomElement(['Uzbek', 'Russian', 'English']),
        timezone: 'Asia/Tashkent',
      }
    });
  }
  
  logger.info(`Created ${count} students`);
}

async function createBookings(count: number = 200) {
  logger.info(`Creating ${count} bookings...`);
  
  const teachers = await prisma.teacherProfile.findMany({
    include: {
      subjectOfferings: true,
      availabilitySlots: {
        where: {
          startTime: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          }
        }
      }
    }
  });
  
  const students = await prisma.studentProfile.findMany();
  
  for (let i = 0; i < count; i++) {
    const teacher = getRandomElement(teachers);
    const student = getRandomElement(students);
    const subjectOffering = getRandomElement(teacher.subjectOfferings);
    
    if (!subjectOffering) continue;
    
    // Use existing availability slot or create a new one
    let availabilitySlot = getRandomElement(teacher.availabilitySlots.filter(slot => !slot.isBooked));
    
    if (!availabilitySlot) {
      // Create a new slot if none available
      const futureDate = getRandomFutureDate(30);
      const startTime = new Date(futureDate);
      startTime.setHours(Math.floor(Math.random() * 14) + 8, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
      
      availabilitySlot = await prisma.availabilitySlot.create({
        data: {
          teacherId: teacher.id,
          startTime,
          endTime,
          isBooked: true,
        }
      });
    }
    
    const startAt = availabilitySlot.startTime;
    const endAt = availabilitySlot.endTime;
    const duration = Math.round((endAt.getTime() - startAt.getTime()) / (1000 * 60)); // minutes
    const totalAmount = Math.round((duration / 60) * subjectOffering.pricePerHour);
    const platformFee = Math.round(totalAmount * 0.15); // 15% platform fee
    const teacherAmount = totalAmount - platformFee;
    
    // Determine booking status based on date
    let status: string;
    const now = new Date();
    if (startAt < now) {
      // Past bookings
      status = Math.random() > 0.2 ? 'COMPLETED' : 'CANCELLED';
    } else {
      // Future bookings
      status = Math.random() > 0.1 ? 'CONFIRMED' : 'PENDING';
    }
    
    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        teacherId: teacher.id,
        subjectOfferingId: subjectOffering.id,
        startAt,
        endAt,
        duration,
        totalAmount,
        platformFee,
        teacherAmount,
        status,
        notes: Math.random() > 0.7 ? 'Looking forward to the lesson!' : undefined,
        cancellationReason: status === 'CANCELLED' ? getRandomElement(['STUDENT_CANCELLED', 'TEACHER_CANCELLED', 'TECHNICAL_ISSUES']) : undefined,
        isRecurring: Math.random() > 0.9, // 10% recurring
      }
    });
    
    // Mark availability slot as booked
    await prisma.availabilitySlot.update({
      where: { id: availabilitySlot.id },
      data: { isBooked: true }
    });
    
    // Create payment for completed bookings
    if (status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          studentId: student.id,
          teacherId: teacher.id,
          amount: totalAmount,
          platformFee,
          teacherAmount,
          currency: 'UZS',
          paymentMethod: getRandomElement(['CARD', 'CLICK', 'PAYME', 'UZCARD']),
          status: 'COMPLETED',
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processedAt: getRandomDate(startAt, now),
        }
      });
    }
  }
  
  logger.info(`Created ${count} bookings with related payments`);
}

async function createReviews(count: number = 150) {
  logger.info(`Creating ${count} reviews...`);
  
  const completedBookings = await prisma.booking.findMany({
    where: {
      status: 'COMPLETED',
      endAt: {
        lt: new Date(), // Only past completed bookings
      }
    },
    include: {
      student: true,
      teacher: true,
    }
  });
  
  // Create reviews for about 75% of completed bookings
  const reviewableBookings = getRandomElements(completedBookings, Math.min(count, Math.floor(completedBookings.length * 0.75)));
  
  const reviewComments = [
    "Excellent teacher! Very patient and explains concepts clearly.",
    "Great lesson, learned a lot. Highly recommend!",
    "Professional and knowledgeable. Will book again.",
    "Good teaching style, but could be more interactive.",
    "Amazing tutor! Made difficult topics easy to understand.",
    "Very helpful and encouraging. Thank you!",
    "Solid lesson, covered all the topics I needed help with.",
    "Patient teacher who adapts to student's learning pace.",
    "Engaging and well-prepared lessons. Highly satisfied!",
    "Clear explanations and good use of examples.",
  ];
  
  for (const booking of reviewableBookings) {
    const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars (weighted towards higher)
    const isAnonymous = Math.random() > 0.8; // 20% anonymous
    
    await prisma.review.create({
      data: {
        studentId: booking.studentId,
        teacherId: booking.teacherId,
        bookingId: booking.id,
        rating,
        comment: Math.random() > 0.2 ? getRandomElement(reviewComments) : undefined,
        isAnonymous,
        status: Math.random() > 0.05 ? 'APPROVED' : 'PENDING', // 95% approved
      }
    });
  }
  
  // Update teacher ratings based on reviews
  const teachers = await prisma.teacherProfile.findMany();
  
  for (const teacher of teachers) {
    const teacherReviews = await prisma.review.findMany({
      where: {
        teacherId: teacher.id,
        status: 'APPROVED',
      }
    });
    
    if (teacherReviews.length > 0) {
      const avgRating = teacherReviews.reduce((sum, review) => sum + review.rating, 0) / teacherReviews.length;
      
      await prisma.teacherProfile.update({
        where: { id: teacher.id },
        data: {
          rating: avgRating,
          totalReviews: teacherReviews.length,
        }
      });
    }
  }
  
  logger.info(`Created ${reviewableBookings.length} reviews and updated teacher ratings`);
}

async function createNotifications(count: number = 300) {
  logger.info(`Creating ${count} notifications...`);
  
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['STUDENT', 'TEACHER'] }
    }
  });
  
  const notificationTypes = [
    'BOOKING_CONFIRMATION',
    'BOOKING_REMINDER',
    'BOOKING_CANCELLATION',
    'PAYMENT_CONFIRMATION',
    'REVIEW_REQUEST',
    'REVIEW_RECEIVED',
    'TEACHER_VERIFIED',
    'SYSTEM_UPDATES',
  ];
  
  const notificationTemplates = {
    BOOKING_CONFIRMATION: 'Your lesson has been confirmed for {date}',
    BOOKING_REMINDER: 'Reminder: Your lesson starts in 1 hour',
    BOOKING_CANCELLATION: 'Your lesson has been cancelled',
    PAYMENT_CONFIRMATION: 'Payment of {amount} UZS has been processed',
    REVIEW_REQUEST: 'Please review your recent lesson',
    REVIEW_RECEIVED: 'You have received a new review',
    TEACHER_VERIFIED: 'Congratulations! Your profile has been verified',
    SYSTEM_UPDATES: 'New features and improvements are now available',
  };
  
  for (let i = 0; i < count; i++) {
    const user = getRandomElement(users);
    const type = getRandomElement(notificationTypes);
    const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
    
    await prisma.notification.create({
      data: {
        userId: user.id,
        type,
        title: `${type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`,
        message: notificationTemplates[type as keyof typeof notificationTemplates] || 'You have a new notification',
        priority: getRandomElement(['LOW', 'MEDIUM', 'HIGH']),
        isRead: Math.random() > 0.4, // 60% read
        readAt: Math.random() > 0.4 ? getRandomDate(createdAt, new Date()) : null,
        createdAt,
      }
    });
  }
  
  logger.info(`Created ${count} notifications`);
}

async function createAuditLogs(count: number = 500) {
  logger.info(`Creating ${count} audit logs...`);
  
  const users = await prisma.user.findMany();
  const actions = [
    'USER_LOGIN',
    'USER_LOGOUT',
    'PROFILE_UPDATE',
    'BOOKING_CREATED',
    'BOOKING_CANCELLED',
    'PAYMENT_PROCESSED',
    'REVIEW_CREATED',
    'AVAILABILITY_UPDATED',
  ];
  
  const resources = ['user', 'booking', 'payment', 'review', 'availability'];
  
  for (let i = 0; i < count; i++) {
    const user = getRandomElement(users);
    const action = getRandomElement(actions);
    const resource = getRandomElement(resources);
    
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        resource,
        resourceId: `${resource}_${Math.random().toString(36).substr(2, 9)}`,
        oldValues: {},
        newValues: { updated: true },
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible; SeedData/1.0)',
        createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
      }
    });
  }
  
  logger.info(`Created ${count} audit logs`);
}

async function main() {
  try {
    logger.info('Starting database seeding...');
    
    // Clear existing data
    logger.info('Clearing existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.subjectOffering.deleteMany();
    await prisma.teacherProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.subject.deleteMany();
    
    // Create fresh data
    await createSubjects();
    await createAdminUser();
    await createTeachers(50);
    await createStudents(100);
    await createBookings(300);
    await createReviews(200);
    await createNotifications(400);
    await createAuditLogs(500);
    
    // Final statistics
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.teacherProfile.count(),
      prisma.studentProfile.count(),
      prisma.subject.count(),
      prisma.subjectOffering.count(),
      prisma.booking.count(),
      prisma.payment.count(),
      prisma.review.count(),
      prisma.notification.count(),
      prisma.auditLog.count(),
    ]);
    
    logger.info('Database seeding completed successfully!');
    logger.info('Final statistics:', {
      users: stats[0],
      teachers: stats[1],
      students: stats[2],
      subjects: stats[3],
      subjectOfferings: stats[4],
      bookings: stats[5],
      payments: stats[6],
      reviews: stats[7],
      notifications: stats[8],
      auditLogs: stats[9],
    });
    
    logger.info('Default credentials:');
    logger.info('Admin: admin@tutoring.uz / admin123');
    logger.info('All teachers and students: [email] / password123');
    
  } catch (error) {
    logger.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
