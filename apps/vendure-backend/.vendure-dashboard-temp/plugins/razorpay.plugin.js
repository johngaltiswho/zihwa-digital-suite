"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RazorpayPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayPlugin = exports.razorpayPaymentHandler = void 0;
const core_1 = require("@vendure/core");
const graphql_1 = require("graphql");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = require("crypto");
const graphql_2 = require("@nestjs/graphql");
// Plugin-level Razorpay credentials and instance used by the custom mutation.
let razorpayInstance;
let razorpayKeyId;
let razorpayKeySecret;
// Optional handler-level overrides from PaymentMethod args.
let paymentHandlerKeyId;
let paymentHandlerKeySecret;
let paymentHandlerInstance;
function getErrorMessage(error) {
    const err = error;
    return (err?.error?.description ||
        err?.error?.reason ||
        err?.message ||
        (typeof err === 'string' ? err : JSON.stringify(err)));
}
function normalizeCredential(value) {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value;
    }
    if (value && typeof value === 'object') {
        const maybeValue = value.value;
        if (typeof maybeValue === 'string' && maybeValue.trim().length > 0) {
            return maybeValue;
        }
    }
    return undefined;
}
/**
 * Razorpay Payment Handler
 * Handles payment creation, verification, and refunds
 */
exports.razorpayPaymentHandler = new core_1.PaymentMethodHandler({
    code: 'razorpay-payment-handler',
    description: [
        {
            languageCode: core_1.LanguageCode.en,
            value: 'Razorpay Payment Gateway',
        },
    ],
    args: {
        keyId: {
            type: 'string',
            label: [{ languageCode: core_1.LanguageCode.en, value: 'Razorpay Key ID' }],
            description: [
                {
                    languageCode: core_1.LanguageCode.en,
                    value: 'Your Razorpay API Key ID',
                },
            ],
        },
        keySecret: {
            type: 'string',
            label: [{ languageCode: core_1.LanguageCode.en, value: 'Razorpay Key Secret' }],
            description: [
                {
                    languageCode: core_1.LanguageCode.en,
                    value: 'Your Razorpay API Key Secret',
                },
            ],
        },
    },
    /**
     * Initialize handler with Razorpay credentials
     */
    init(injector) {
        const args = this.args;
        const keyId = normalizeCredential(args?.keyId);
        const keySecret = normalizeCredential(args?.keySecret);
        if (keyId && keySecret) {
            paymentHandlerKeySecret = keySecret;
            paymentHandlerKeyId = keyId;
            paymentHandlerInstance = new razorpay_1.default({
                key_id: keyId,
                key_secret: keySecret,
            });
        }
    },
    /**
     * Create payment
     * Verifies Razorpay payment signature and fetches payment details
     */
    createPayment: async (ctx, order, amount, args, metadata) => {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature, } = metadata;
            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                console.error('Missing Razorpay payment details', metadata);
                return {
                    amount,
                    state: 'Declined',
                    errorMessage: 'Missing Razorpay payment details',
                    metadata: {},
                };
            }
            // Verify payment signature using HMAC-SHA256
            const keySecret = normalizeCredential(args?.keySecret) ??
                paymentHandlerKeySecret ??
                normalizeCredential(razorpayKeySecret);
            if (!keySecret) {
                return {
                    amount,
                    state: 'Error',
                    errorMessage: 'Razorpay key secret is not configured as a valid string',
                    metadata: {
                        razorpay_payment_id,
                        razorpay_order_id,
                    },
                };
            }
            const expectedSignature = (0, crypto_1.createHmac)('sha256', keySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');
            if (expectedSignature !== razorpay_signature) {
                console.error('Payment signature verification failed', {
                    expected: expectedSignature,
                    received: razorpay_signature,
                });
                return {
                    amount,
                    state: 'Declined',
                    errorMessage: 'Payment signature verification failed',
                    metadata: {
                        razorpay_payment_id,
                        razorpay_order_id,
                    },
                };
            }
            // Fetch payment details from Razorpay
            const keyId = normalizeCredential(args?.keyId) ?? paymentHandlerKeyId;
            const keySecretForClient = normalizeCredential(args?.keySecret) ?? paymentHandlerKeySecret;
            const client = keyId && keySecretForClient
                ? new razorpay_1.default({ key_id: keyId, key_secret: keySecretForClient })
                : paymentHandlerInstance ?? razorpayInstance;
            const payment = await client.payments.fetch(razorpay_payment_id);
            if (payment.status === 'captured' || payment.status === 'authorized') {
                console.log('Payment successful', {
                    payment_id: razorpay_payment_id,
                    amount: payment.amount,
                    status: payment.status,
                });
                return {
                    amount: Number(payment.amount),
                    state: 'Settled',
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
            }
            else {
                console.error('Payment not captured/authorized', {
                    payment_id: razorpay_payment_id,
                    status: payment.status,
                });
                return {
                    amount,
                    state: 'Declined',
                    errorMessage: `Payment status: ${payment.status}`,
                    metadata: {
                        razorpay_payment_id,
                        status: payment.status,
                    },
                };
            }
        }
        catch (error) {
            console.error('Razorpay payment error:', error);
            return {
                amount,
                state: 'Error',
                errorMessage: getErrorMessage(error) || 'Payment processing failed',
                metadata: {},
            };
        }
    },
    /**
     * Settle payment
     * For Razorpay, payment is already settled at creation if captured
     */
    settlePayment: async (ctx, order, payment, args) => {
        return {
            success: true,
            metadata: payment.metadata,
        };
    },
    /**
     * Create refund
     * Processes refund through Razorpay API
     */
    createRefund: async (ctx, input, amount, order, payment, args) => {
        try {
            const { razorpay_payment_id } = payment.metadata;
            if (!razorpay_payment_id) {
                console.error('Missing razorpay_payment_id for refund', payment.metadata);
                return {
                    state: 'Failed',
                    metadata: {},
                };
            }
            // Create refund in Razorpay
            const keyId = normalizeCredential(args?.keyId) ?? paymentHandlerKeyId;
            const keySecretForClient = normalizeCredential(args?.keySecret) ?? paymentHandlerKeySecret;
            const client = keyId && keySecretForClient
                ? new razorpay_1.default({ key_id: keyId, key_secret: keySecretForClient })
                : paymentHandlerInstance ?? razorpayInstance;
            const refund = await client.payments.refund(razorpay_payment_id, {
                amount: amount, // Amount in smallest currency unit (paise)
            });
            console.log('Refund created', {
                refund_id: refund.id,
                payment_id: razorpay_payment_id,
                amount: refund.amount,
                status: refund.status,
            });
            if (refund.status === 'processed') {
                return {
                    state: 'Settled',
                    transactionId: refund.id,
                    metadata: {
                        refund_id: refund.id,
                        payment_id: razorpay_payment_id,
                        amount: refund.amount,
                        status: refund.status,
                    },
                };
            }
            else {
                return {
                    state: 'Failed',
                    metadata: {
                        refund_id: refund.id,
                        status: refund.status,
                        errorMessage: 'Refund not processed',
                    },
                };
            }
        }
        catch (error) {
            console.error('Razorpay refund error:', error);
            return {
                state: 'Failed',
                metadata: {
                    errorMessage: getErrorMessage(error),
                },
            };
        }
    },
});
/**
 * Razorpay Plugin
 * Provides GraphQL mutation for creating Razorpay orders
 */
const razorpayShopSchema = (0, graphql_1.parse)(`
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
let RazorpayResolver = class RazorpayResolver {
    async createRazorpayOrder(amount) {
        try {
            if (!razorpayInstance || !razorpayKeyId || !razorpayKeySecret) {
                throw new Error('Razorpay is not configured on the server');
            }
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
        }
        catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new Error(`Failed to create Razorpay order: ${getErrorMessage(error)}`);
        }
    }
};
__decorate([
    (0, graphql_2.Mutation)('createRazorpayOrder'),
    __param(0, (0, graphql_2.Args)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RazorpayResolver.prototype, "createRazorpayOrder", null);
RazorpayResolver = __decorate([
    (0, graphql_2.Resolver)()
], RazorpayResolver);
let RazorpayPlugin = RazorpayPlugin_1 = class RazorpayPlugin {
    static init(options) {
        this.options = options;
        // Initialize Razorpay instance
        razorpayKeyId = options.keyId;
        razorpayKeySecret = options.keySecret;
        razorpayInstance = new razorpay_1.default({
            key_id: options.keyId,
            key_secret: options.keySecret,
        });
        return RazorpayPlugin_1;
    }
};
exports.RazorpayPlugin = RazorpayPlugin;
exports.RazorpayPlugin = RazorpayPlugin = RazorpayPlugin_1 = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        compatibility: '^3.5.0',
        configuration: (config) => {
            return config;
        },
        shopApiExtensions: {
            schema: razorpayShopSchema,
            resolvers: [RazorpayResolver],
        },
    })
], RazorpayPlugin);
