import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSchedulerPlugin,
  DefaultSearchPlugin,
  VendureConfig,
  BcryptPasswordHashingStrategy,
} from '@vendure/core';
import { RazorpayPlugin, razorpayPaymentHandler } from './plugins/razorpay.plugin';
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'node:path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = Number(process.env.PORT) || 3002;

export const config: VendureConfig = {
  apiOptions: {
    port: serverPort,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    trustProxy: IS_DEV ? false : 1,
    ...(IS_DEV
      ? {
          adminApiDebug: true,
          shopApiDebug: true,
        }
      : {}),
  },

  authOptions: {
    // Uses bcrypt internally.
    // bcrypt → bcryptjs replacement is handled via pnpm overrides (NOT here).
    passwordHashingStrategy: new BcryptPasswordHashingStrategy(),
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME!,
      password: process.env.SUPERADMIN_PASSWORD!,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET!,
    },
    requireVerification: false,
  },

  dbConnectionOptions: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    logging: false,
    ssl: { rejectUnauthorized: false },
  },

  paymentOptions: {
    paymentMethodHandlers: [
      dummyPaymentHandler,
      razorpayPaymentHandler,
    ],
  },

  customFields: {},

  plugins: [
    RazorpayPlugin.init({
      keyId: process.env.RAZORPAY_KEY_ID!,
      keySecret: process.env.RAZORPAY_KEY_SECRET!,
    }),

    GraphiqlPlugin.init(),

    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
    }),

    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({
      bufferUpdates: false,
      indexStockStatus: true,
    }),

    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(
        path.join(__dirname, '../static/email/templates')
      ),
      globalTemplateVars: {
        fromAddress: '"Stalks N Spice" <noreply@stalksnspice.com>',
        verifyEmailAddressUrl: 'http://localhost:3003/verify',
        passwordResetUrl: 'http://localhost:3003/password-reset',
        changeEmailAddressUrl:
          'http://localhost:3003/verify-email-address-change',
      },
    }),

    // Vendure 3.x Dashboard (Vite-based)
    DashboardPlugin.init({
      route: 'dashboard',
      appDir: path.join(__dirname, '../vendure-dashboard-temp'),
    }),
  ],
};
