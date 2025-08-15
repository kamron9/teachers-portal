import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  html?: string;
  text?: string;
  data?: Record<string, any>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    // Verify connection
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
    } catch (error) {
      logger.error('Email service connection failed:', error);
    }
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.smtp.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html || this.getTemplate(options.template!, options.data),
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: result.messageId,
        template: options.template,
      });
    } catch (error) {
      logger.error('Failed to send email', {
        to: options.to,
        subject: options.subject,
        error: error.message,
      });
      throw error;
    }
  }

  private getTemplate(templateName: string, data: Record<string, any> = {}): string {
    const templates: Record<string, (data: Record<string, any>) => string> = {
      'email-verification': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <p>Thank you for registering with our tutoring marketplace!</p>
              <p>Please click the button below to verify your email address:</p>
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'password-reset': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password.</p>
              <p>Click the button below to create a new password:</p>
              <a href="${data.resetUrl}" class="button">Reset Password</a>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
              <p>This reset link will expire in 1 hour.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'booking-confirmation': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .booking-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Your lesson has been successfully booked.</p>
              <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Teacher:</strong> ${data.teacherName}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time}</p>
                <p><strong>Duration:</strong> ${data.duration}</p>
                <p><strong>Price:</strong> ${data.price} UZS</p>
              </div>
              <p>You will receive a reminder email 24 hours before your lesson.</p>
            </div>
            <div class="footer">
              <p>Need help? Contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'lesson-reminder': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lesson Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .reminder-box { background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; padding: 20px; color: #666; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Upcoming Lesson Reminder</h1>
            </div>
            <div class="content">
              <div class="reminder-box">
                <h3>Your lesson is starting soon!</h3>
                <p><strong>Teacher:</strong> ${data.teacherName}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time}</p>
              </div>
              <p>Make sure you're ready for your lesson. Join the video call using the link provided by your teacher.</p>
            </div>
            <div class="footer">
              <p>Good luck with your lesson!</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'payment-confirmation': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .payment-details { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Successful</h1>
            </div>
            <div class="content">
              <p>Your payment has been processed successfully.</p>
              <div class="payment-details">
                <h3>Payment Details:</h3>
                <p><strong>Amount:</strong> ${data.amount} UZS</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                <p><strong>Date:</strong> ${data.date}</p>
              </div>
              <p>Thank you for using our platform!</p>
            </div>
            <div class="footer">
              <p>Keep this email for your records.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    return template(data);
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export convenience function
export const sendEmail = (options: EmailOptions): Promise<void> => {
  return emailService.sendEmail(options);
};

export default emailService;
