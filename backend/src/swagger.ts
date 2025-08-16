import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from './config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TutorUZ API',
      version: '1.0.0',
      description: 'O\'zbekiston uchun rep-tutorlar bozori API hujjatlari',
      contact: {
        name: 'TutorUZ Support',
        email: 'support@tutoruz.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server'
      },
      {
        url: `https://api.tutoruz.com/api/${config.apiVersion}`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'ADMIN'] },
            avatar: { type: 'string', format: 'uri' },
            isVerified: { type: 'boolean' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Teacher: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            subjects: { 
              type: 'array',
              items: { type: 'string' }
            },
            experience: { type: 'integer' },
            hourlyRate: { type: 'number' },
            bio: { type: 'string' },
            education: { type: 'string' },
            certificates: {
              type: 'array',
              items: { type: 'string', format: 'uri' }
            },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            totalReviews: { type: 'integer' },
            isVerified: { type: 'boolean' },
            availability: {
              type: 'object',
              properties: {
                monday: { type: 'array', items: { type: 'string' } },
                tuesday: { type: 'array', items: { type: 'string' } },
                wednesday: { type: 'array', items: { type: 'string' } },
                thursday: { type: 'array', items: { type: 'string' } },
                friday: { type: 'array', items: { type: 'string' } },
                saturday: { type: 'array', items: { type: 'string' } },
                sunday: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            teacherId: { type: 'string', format: 'uuid' },
            subject: { type: 'string' },
            scheduledAt: { type: 'string', format: 'date-time' },
            duration: { type: 'integer' },
            status: { 
              type: 'string', 
              enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'] 
            },
            amount: { type: 'number' },
            notes: { type: 'string' },
            meetingLink: { type: 'string', format: 'uri' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            bookingId: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            currency: { type: 'string', default: 'UZS' },
            status: { 
              type: 'string', 
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'] 
            },
            method: { 
              type: 'string', 
              enum: ['CARD', 'UZCARD', 'HUMO', 'WALLET', 'CASH'] 
            },
            transactionId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            bookingId: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            teacherId: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            isVisible: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            senderId: { type: 'string', format: 'uuid' },
            receiverId: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            type: { type: 'string', enum: ['TEXT', 'IMAGE', 'FILE'] },
            attachments: {
              type: 'array',
              items: { type: 'string', format: 'uri' }
            },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Foydalanuvchi autentifikatsiyasi'
      },
      {
        name: 'Users',
        description: 'Foydalanuvchilar boshqaruvi'
      },
      {
        name: 'Teachers',
        description: 'O\'qituvchilar boshqaruvi'
      },
      {
        name: 'Students',
        description: 'O\'quvchilar boshqaruvi'
      },
      {
        name: 'Bookings',
        description: 'Dars bron qilish'
      },
      {
        name: 'Payments',
        description: 'To\'lovlar tizimi'
      },
      {
        name: 'Reviews',
        description: 'Baholar va sharhlar'
      },
      {
        name: 'Messages',
        description: 'Xabarlar tizimi'
      },
      {
        name: 'Search',
        description: 'Qidiruv funksiyalari'
      },
      {
        name: 'Admin',
        description: 'Administrator paneli'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/validators/*.ts'
  ]
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  // Swagger UI ni o'rnatish
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #1f2937; }
      .swagger-ui .scheme-container { background: #f9fafb; }
    `,
    customSiteTitle: 'TutorUZ API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true
    }
  }));

  // JSON formatida specs ni olish uchun
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 Swagger UI: http://localhost:${config.port}/api-docs`);
  console.log(`📄 API Specs: http://localhost:${config.port}/api-docs.json`);
};

export default specs;
