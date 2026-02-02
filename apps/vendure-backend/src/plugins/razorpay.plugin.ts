import {
  LanguageCode,
  PluginCommonModule,
  VendurePlugin,
  PaymentMethodHandler,
  CreatePaymentResult,
  SettlePaymentResult,
  CreateRefundResult,
} from '@vendure/core';
import { parse } from 'graphql';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

// Shared Razorpay instance and credentials
let razorpayInstance: Razorpay;
let razorpayKeyId: string;
let razorpayKeySecret: string;

export interface RazorpayOptions {
  keyId: string;
  keySecret: string;
}

/**
 * Razorpay Payment Handler
 * Handles payment creation, verification, and refunds
 */
export const razorpayPaymentHandler = new PaymentMethodHandler({
  code: 'razorpay-payment-handler',
  description: [
    {
      languageCode: LanguageCode.en,
      value: 'Razorpay Payment Gateway',
    },
  ],
  args: {
    keyId: {
      type: 'string',
      label: [{ languageCode: LanguageCode.en, value: 'Razorpay Key ID' }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: 'Your Razorpay API Key ID',
        },
      ],
    },
    keySecret: {
      type: 'string',
      label: [{ languageCode: LanguageCode.en, value: 'Razorpay Key Secret' }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: 'Your Razorpay API Key Secret',
        },
      ],
    },
  },

  /**
   * Initialize handler with Razorpay credentials
   */
  init(injector) {
    const args = this.args as any;
    razorpayKeySecret = args.keySecret;
    razorpayKeyId = args.keyId;
    razorpayInstance = new Razorpay({
      key_id: args.keyId,
      key_secret: args.keySecret,
    });
  },

  /**
   * Create payment
   * Verifies Razorpay payment signature and fetches payment details
   */
  createPayment: async (
    ctx,
    order,
    amount,
    args,
    metadata
  ): Promise<CreatePaymentResult> => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = metadata;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        console.error('Missing Razorpay payment details', metadata);
        return {
          amount,
          state: 'Declined' as any,
          errorMessage: 'Missing Razorpay payment details',
          metadata: {},
        };
      }

      // Verify payment signature using HMAC-SHA256
      const expectedSignature = createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.error('Payment signature verification failed', {
          expected: expectedSignature,
          received: razorpay_signature,
        });
        return {
          amount,
          state: 'Declined' as any,
          errorMessage: 'Payment signature verification failed',
          metadata: {
            razorpay_payment_id,
            razorpay_order_id,
          },
        };
      }

      // Fetch payment details from Razorpay
      const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

      if (payment.status === 'captured' || payment.status === 'authorized') {
        console.log('Payment successful', {
          payment_id: razorpay_payment_id,
          amount: payment.amount,
          status: payment.status,
        });
        return {
          amount: Number(payment.amount),
          state: 'Settled' as any,
          transactionId: razorpay_payment_id,
          metadata: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            paymentMethod: payment.method,
            cardLast4: payment.card?.last4 || '',
            cardNetwork: payment.card?.network || '',
            bank: payment.bank || '',
            wallet: payment.wallet || '',
            email: payment.email,
            contact: payment.contact,
          },
        };
      } else {
        console.error('Payment not captured/authorized', {
          payment_id: razorpay_payment_id,
          status: payment.status,
        });
        return {
          amount,
          state: 'Declined' as any,
          errorMessage: `Payment status: ${payment.status}`,
          metadata: {
            razorpay_payment_id,
            status: payment.status,
          },
        };
      }
    } catch (error: any) {
      console.error('Razorpay payment error:', error);
      return {
        amount,
        state: 'Error' as any,
        errorMessage: error.message || 'Payment processing failed',
        metadata: {},
      };
    }
  },

  /**
   * Settle payment
   * For Razorpay, payment is already settled at creation if captured
   */
  settlePayment: async (
    ctx,
    order,
    payment,
    args
  ): Promise<SettlePaymentResult> => {
    return {
      success: true,
      metadata: payment.metadata,
    };
  },

  /**
   * Create refund
   * Processes refund through Razorpay API
   */
  createRefund: async (
    ctx,
    input,
    amount,
    order,
    payment,
    args
  ): Promise<CreateRefundResult> => {
    try {
      const { razorpay_payment_id } = payment.metadata;

      if (!razorpay_payment_id) {
        console.error('Missing razorpay_payment_id for refund', payment.metadata);
        return {
          state: 'Failed' as any,
          metadata: {},
        };
      }

      // Create refund in Razorpay
      const refund = await razorpayInstance.payments.refund(
        razorpay_payment_id,
        {
          amount: amount, // Amount in smallest currency unit (paise)
        }
      );

      console.log('Refund created', {
        refund_id: refund.id,
        payment_id: razorpay_payment_id,
        amount: refund.amount,
        status: refund.status,
      });

      if (refund.status === 'processed') {
        return {
          state: 'Settled' as any,
          transactionId: refund.id,
          metadata: {
            refund_id: refund.id,
            payment_id: razorpay_payment_id,
            amount: refund.amount,
            status: refund.status,
          },
        };
      } else {
        return {
          state: 'Failed' as any,
          metadata: {
            refund_id: refund.id,
            status: refund.status,
            errorMessage: 'Refund not processed',
          },
        };
      }
    } catch (error: any) {
      console.error('Razorpay refund error:', error);
      return {
        state: 'Failed' as any,
        metadata: {
          errorMessage: error.message,
        },
      };
    }
  },
});

/**
 * Razorpay Plugin
 * Provides GraphQL mutation for creating Razorpay orders
 */
const razorpayShopSchema = parse(`
  extend type Mutation {
    createRazorpayOrder(amount: Int!): RazorpayOrderResponse!
  }

  type RazorpayOrderResponse {
    id: String!
    amount: Int!
    currency: String!
    keyId: String!
  }
`);

@Resolver()
class RazorpayResolver {
  @Mutation('createRazorpayOrder')
  async createRazorpayOrder(@Args('amount') amount: number) {
    try {
      const order = await razorpayInstance.orders.create({
        amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });

      console.log('Razorpay order created', {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      });

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
      };
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(`Failed to create Razorpay order: ${error.message}`);
    }
  }
}

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    return config;
  },
  shopApiExtensions: {
    schema: razorpayShopSchema,
    resolvers: [RazorpayResolver],
  },
})
export class RazorpayPlugin {
  static options: RazorpayOptions;

  static init(options: RazorpayOptions): typeof RazorpayPlugin {
    this.options = options;

    // Initialize Razorpay instance
    razorpayKeyId = options.keyId;
    razorpayKeySecret = options.keySecret;
    razorpayInstance = new Razorpay({
      key_id: options.keyId,
      key_secret: options.keySecret,
    });

    return RazorpayPlugin;
  }
}
