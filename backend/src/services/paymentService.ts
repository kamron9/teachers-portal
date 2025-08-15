import crypto from 'crypto';
import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { PaymentError } from '../utils/errors';

export interface PaymentRequest {
  paymentId: string;
  amount: number; // in kopeks
  provider: 'CLICK' | 'PAYME' | 'UZUM_BANK' | 'STRIPE';
  description: string;
  returnUrl?: string;
  cancelUrl?: string;
  paymentMethodId?: string;
  customerInfo: {
    id: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentResponse {
  paymentUrl: string;
  providerRef: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  paymentId: string;
  providerRef: string;
  amount: number; // in kopeks
  reason: string;
  provider: 'CLICK' | 'PAYME' | 'UZUM_BANK' | 'STRIPE';
}

export interface RefundResponse {
  refundRef: string;
  status: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    switch (request.provider) {
      case 'CLICK':
        return this.createClickPayment(request);
      case 'PAYME':
        return this.createPaymePayment(request);
      case 'UZUM_BANK':
        return this.createUzumBankPayment(request);
      case 'STRIPE':
        return this.createStripePayment(request);
      default:
        throw new PaymentError(`Unsupported payment provider: ${request.provider}`, 'UNSUPPORTED_PROVIDER');
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    switch (request.provider) {
      case 'CLICK':
        return this.processClickRefund(request);
      case 'PAYME':
        return this.processPaymeRefund(request);
      case 'UZUM_BANK':
        return this.processUzumBankRefund(request);
      case 'STRIPE':
        return this.processStripeRefund(request);
      default:
        throw new PaymentError(`Unsupported refund provider: ${request.provider}`, 'UNSUPPORTED_PROVIDER');
    }
  }

  async verifyWebhook(provider: string, headers: any, payload: any): Promise<boolean> {
    switch (provider) {
      case 'CLICK':
        return this.verifyClickWebhook(headers, payload);
      case 'PAYME':
        return this.verifyPaymeWebhook(headers, payload);
      case 'UZUM_BANK':
        return this.verifyUzumBankWebhook(headers, payload);
      case 'STRIPE':
        return this.verifyStripeWebhook(headers, payload);
      default:
        return false;
    }
  }

  async processWebhook(provider: string, payload: any): Promise<any> {
    switch (provider) {
      case 'CLICK':
        return this.processClickWebhook(payload);
      case 'PAYME':
        return this.processPaymeWebhook(payload);
      case 'UZUM_BANK':
        return this.processUzumBankWebhook(payload);
      case 'STRIPE':
        return this.processStripeWebhook(payload);
      default:
        throw new PaymentError(`Unsupported webhook provider: ${provider}`, 'UNSUPPORTED_PROVIDER');
    }
  }

  // Click.uz Implementation
  private async createClickPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { merchantId, serviceId, secretKey } = config.payments.click;
      
      // Convert kopeks to sum (Click works with sum)
      const amountInSum = Math.round(request.amount / 100);
      
      const params = {
        service_id: serviceId,
        merchant_id: merchantId,
        amount: amountInSum,
        transaction_param: request.paymentId,
        description: request.description,
        return_url: request.returnUrl || `${config.frontendUrl}/payment/success`,
        cancel_url: request.cancelUrl || `${config.frontendUrl}/payment/cancel`,
      };

      // Generate signature
      const signString = `${params.service_id}${params.merchant_id}${params.amount}${params.transaction_param}${secretKey}`;
      const signature = crypto.createHash('md5').update(signString).digest('hex');

      const response = await axios.post('https://api.click.uz/v2/merchant', {
        ...params,
        sign: signature
      });

      if (response.data.error_code !== 0) {
        throw new Error(response.data.error_note || 'Click payment creation failed');
      }

      logger.info('Click payment created', {
        paymentId: request.paymentId,
        clickTransactionId: response.data.click_trans_id,
        amount: amountInSum
      });

      return {
        paymentUrl: response.data.payment_url,
        providerRef: response.data.click_trans_id,
        metadata: {
          clickTransactionId: response.data.click_trans_id,
          amountInSum
        }
      };

    } catch (error) {
      logger.error('Click payment creation failed', {
        paymentId: request.paymentId,
        error: error.message
      });
      throw new PaymentError(`Click payment failed: ${error.message}`, 'CLICK_PAYMENT_FAILED');
    }
  }

  private async processClickRefund(request: RefundRequest): Promise<RefundResponse> {
    // Click.uz refund implementation
    const { merchantId, secretKey } = config.payments.click;
    const amountInSum = Math.round(request.amount / 100);

    const params = {
      merchant_id: merchantId,
      click_trans_id: request.providerRef,
      amount: amountInSum,
      reason: request.reason
    };

    const signString = `${params.merchant_id}${params.click_trans_id}${params.amount}${secretKey}`;
    const signature = crypto.createHash('md5').update(signString).digest('hex');

    try {
      const response = await axios.post('https://api.click.uz/v2/merchant/refund', {
        ...params,
        sign: signature
      });

      return {
        refundRef: response.data.refund_id || request.providerRef,
        status: response.data.error_code === 0 ? 'COMPLETED' : 'FAILED',
        metadata: response.data
      };
    } catch (error) {
      throw new PaymentError(`Click refund failed: ${error.message}`, 'CLICK_REFUND_FAILED');
    }
  }

  private verifyClickWebhook(headers: any, payload: any): boolean {
    const { secretKey } = config.payments.click;
    const receivedSignature = headers['click-signature'] || payload.sign;
    
    if (!receivedSignature) return false;

    const signString = `${payload.click_trans_id}${payload.service_id}${payload.click_paydoc_id}${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}${secretKey}`;
    const expectedSignature = crypto.createHash('md5').update(signString).digest('hex');

    return receivedSignature === expectedSignature;
  }

  private processClickWebhook(payload: any): any {
    const { action, click_trans_id, merchant_trans_id, amount, error } = payload;
    
    let status = 'PENDING';
    if (action === 1 && error === 0) { // Payment completed
      status = 'COMPLETED';
    } else if (error !== 0) { // Payment failed
      status = 'FAILED';
    }

    return {
      paymentId: merchant_trans_id,
      status,
      providerRef: click_trans_id,
      amount: amount * 100, // Convert sum to kopeks
      metadata: payload
    };
  }

  // Payme Implementation
  private async createPaymePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { merchantId } = config.payments.payme;
      
      // Convert kopeks to tiyin (Payme works with tiyin)
      const amountInTiyin = request.amount;
      
      const params = {
        merchant: merchantId,
        amount: amountInTiyin,
        account: {
          order_id: request.paymentId
        },
        description: request.description,
        return_url: request.returnUrl || `${config.frontendUrl}/payment/success`,
        cancel_url: request.cancelUrl || `${config.frontendUrl}/payment/cancel`
      };

      // Payme uses different API structure
      const paymentUrl = `https://checkout.paycom.uz/${btoa(JSON.stringify(params))}`;

      logger.info('Payme payment created', {
        paymentId: request.paymentId,
        amount: amountInTiyin
      });

      return {
        paymentUrl,
        providerRef: request.paymentId, // Payme uses our payment ID initially
        metadata: {
          amountInTiyin,
          merchantId
        }
      };

    } catch (error) {
      logger.error('Payme payment creation failed', {
        paymentId: request.paymentId,
        error: error.message
      });
      throw new PaymentError(`Payme payment failed: ${error.message}`, 'PAYME_PAYMENT_FAILED');
    }
  }

  private async processPaymeRefund(request: RefundRequest): Promise<RefundResponse> {
    // Payme refund implementation
    const { merchantId, secretKey } = config.payments.payme;

    try {
      const auth = Buffer.from(`Paycom:${secretKey}`).toString('base64');
      
      const response = await axios.post('https://checkout.paycom.uz/api', {
        method: 'transactions.cancel',
        params: {
          id: request.providerRef,
          reason: 1 // Refund reason code
        }
      }, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        refundRef: response.data.result?.transaction || request.providerRef,
        status: response.data.result ? 'COMPLETED' : 'FAILED',
        metadata: response.data
      };
    } catch (error) {
      throw new PaymentError(`Payme refund failed: ${error.message}`, 'PAYME_REFUND_FAILED');
    }
  }

  private verifyPaymeWebhook(headers: any, payload: any): boolean {
    const { secretKey } = config.payments.payme;
    const auth = headers.authorization;
    
    if (!auth || !auth.startsWith('Basic ')) return false;

    const credentials = Buffer.from(auth.substring(6), 'base64').toString();
    const [username, password] = credentials.split(':');

    return username === 'Paycom' && password === secretKey;
  }

  private processPaymeWebhook(payload: any): any {
    const { method, params } = payload;
    
    let status = 'PENDING';
    let paymentId = params?.account?.order_id;

    if (method === 'transactions.create') {
      status = 'PENDING';
    } else if (method === 'transactions.perform') {
      status = 'COMPLETED';
    } else if (method === 'transactions.cancel') {
      status = 'FAILED';
    }

    return {
      paymentId,
      status,
      providerRef: params?.id,
      amount: params?.amount,
      metadata: payload
    };
  }

  // Uzum Bank Implementation (similar structure to other providers)
  private async createUzumBankPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { merchantId, secretKey } = config.payments.uzumBank;
      
      const amountInSum = Math.round(request.amount / 100);
      
      const params = {
        merchant_id: merchantId,
        order_id: request.paymentId,
        amount: amountInSum,
        description: request.description,
        return_url: request.returnUrl || `${config.frontendUrl}/payment/success`,
        cancel_url: request.cancelUrl || `${config.frontendUrl}/payment/cancel`
      };

      // Mock implementation - replace with actual Uzum Bank API
      logger.info('Uzum Bank payment created (mock)', {
        paymentId: request.paymentId,
        amount: amountInSum
      });

      return {
        paymentUrl: `https://payment.uzumbank.uz/pay/${request.paymentId}`,
        providerRef: `uzum_${request.paymentId}`,
        metadata: { amountInSum, merchantId }
      };

    } catch (error) {
      throw new PaymentError(`Uzum Bank payment failed: ${error.message}`, 'UZUM_BANK_PAYMENT_FAILED');
    }
  }

  private async processUzumBankRefund(request: RefundRequest): Promise<RefundResponse> {
    // Mock implementation
    return {
      refundRef: `uzum_refund_${Date.now()}`,
      status: 'COMPLETED',
      metadata: { amount: request.amount }
    };
  }

  private verifyUzumBankWebhook(headers: any, payload: any): boolean {
    // Mock verification - implement actual signature verification
    return true;
  }

  private processUzumBankWebhook(payload: any): any {
    return {
      paymentId: payload.order_id,
      status: payload.status === 'success' ? 'COMPLETED' : 'FAILED',
      providerRef: payload.transaction_id,
      amount: payload.amount * 100,
      metadata: payload
    };
  }

  // Stripe Implementation (for international payments)
  private async createStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Note: This is a simplified implementation
      // In production, you'd use the Stripe SDK
      
      const amountInCents = Math.round(request.amount / 100); // Convert kopeks to cents
      
      const params = {
        amount: amountInCents,
        currency: 'usd', // Stripe doesn't support UZS directly
        payment_method_types: ['card'],
        success_url: request.returnUrl || `${config.frontendUrl}/payment/success`,
        cancel_url: request.cancelUrl || `${config.frontendUrl}/payment/cancel`,
        metadata: {
          payment_id: request.paymentId
        }
      };

      // Mock Stripe implementation
      logger.info('Stripe payment created (mock)', {
        paymentId: request.paymentId,
        amount: amountInCents
      });

      return {
        paymentUrl: `https://checkout.stripe.com/pay/mock_${request.paymentId}`,
        providerRef: `stripe_${request.paymentId}`,
        metadata: { amountInCents }
      };

    } catch (error) {
      throw new PaymentError(`Stripe payment failed: ${error.message}`, 'STRIPE_PAYMENT_FAILED');
    }
  }

  private async processStripeRefund(request: RefundRequest): Promise<RefundResponse> {
    // Mock implementation
    return {
      refundRef: `stripe_refund_${Date.now()}`,
      status: 'COMPLETED',
      metadata: { amount: request.amount }
    };
  }

  private verifyStripeWebhook(headers: any, payload: any): boolean {
    // Mock verification - implement actual Stripe signature verification
    return true;
  }

  private processStripeWebhook(payload: any): any {
    return {
      paymentId: payload.metadata?.payment_id,
      status: payload.type === 'payment_intent.succeeded' ? 'COMPLETED' : 'FAILED',
      providerRef: payload.id,
      amount: payload.amount * 100, // Convert cents to kopeks
      metadata: payload
    };
  }

  // Utility methods
  formatAmount(amount: number, currency: string = 'UZS'): string {
    const amountInMainUnit = Math.round(amount / 100);
    return `${amountInMainUnit.toLocaleString()} ${currency}`;
  }

  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 100000000; // Max 1M UZS
  }

  getSupportedProviders(): string[] {
    return ['CLICK', 'PAYME', 'UZUM_BANK', 'STRIPE'];
  }
}

export default PaymentService;
