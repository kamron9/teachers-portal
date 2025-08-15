import twilio from 'twilio';
import { config } from '../config';
import { logger } from '../utils/logger';

interface SMSOptions {
  to: string;
  message: string;
}

class SMSService {
  private client: twilio.Twilio;

  constructor() {
    if (config.twilio.accountSid && config.twilio.authToken) {
      this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
      logger.info('SMS service initialized');
    } else {
      logger.warn('SMS service not configured - Twilio credentials missing');
    }
  }

  public async sendSMS(options: SMSOptions): Promise<void> {
    if (!this.client) {
      logger.warn('SMS service not available', { to: options.to });
      return;
    }

    try {
      const result = await this.client.messages.create({
        body: options.message,
        from: config.twilio.phoneNumber,
        to: options.to,
      });

      logger.info('SMS sent successfully', {
        to: options.to,
        messageId: result.sid,
        status: result.status,
      });
    } catch (error) {
      logger.error('Failed to send SMS', {
        to: options.to,
        error: error.message,
      });
      throw error;
    }
  }

  public async sendOTP(phone: string, otp: string): Promise<void> {
    const message = `Your verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
    
    await this.sendSMS({
      to: phone,
      message,
    });
  }

  public async sendBookingReminder(phone: string, teacherName: string, subject: string, dateTime: string): Promise<void> {
    const message = `Reminder: Your ${subject} lesson with ${teacherName} is scheduled for ${dateTime}. Please be ready!`;
    
    await this.sendSMS({
      to: phone,
      message,
    });
  }

  public async sendBookingConfirmation(phone: string, teacherName: string, subject: string, dateTime: string): Promise<void> {
    const message = `Your lesson with ${teacherName} for ${subject} has been confirmed for ${dateTime}. Good luck!`;
    
    await this.sendSMS({
      to: phone,
      message,
    });
  }

  public async sendPaymentConfirmation(phone: string, amount: string): Promise<void> {
    const message = `Payment of ${amount} UZS has been processed successfully. Thank you for using our platform!`;
    
    await this.sendSMS({
      to: phone,
      message,
    });
  }
}

// Create singleton instance
const smsService = new SMSService();

// Export convenience function
export const sendSMS = (options: SMSOptions): Promise<void> => {
  return smsService.sendSMS(options);
};

export default smsService;
