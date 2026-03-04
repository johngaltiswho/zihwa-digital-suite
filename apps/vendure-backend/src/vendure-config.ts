import {
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
import { AssetServerPlugin, S3AssetStorageStrategy } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'node:path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = Number(process.env.PORT) || 3100;

// Production frontend URLs
const PRODUCTION_FRONTEND_URLS = [
  process.env.FRONTEND_URL,
  process.env.RAILWAY_STATIC_URL,
  'https://stalksnspice.com',
  'https://www.stalksnspice.com',
  'https://shop.zihwainsights.com',
].filter((url): url is string => Boolean(url));

const DEV_URLS = [
  'http://localhost:5176',  // Dashboard port
  'http://localhost:3100',  // Server port
  'http://localhost:3004',  // Stalknspice storefront
  'http://localhost:3009',  // Accounting engine
  'http://localhost:3006',  // Fluvium site (Humility DB)
];

export const config: VendureConfig = {
  apiOptions: {
    port: serverPort,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    cors: {
  origin: IS_DEV ? DEV_URLS : PRODUCTION_FRONTEND_URLS,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'vendure-token', 'vendure-auth-token', 'vendure-session-token'],
  exposedHeaders: ['vendure-token', 'vendure-auth-token', 'vendure-session-token'],
},
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
    httpOnly: true,
    sameSite: IS_DEV ? 'lax' : 'none',
    secure: !IS_DEV,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  requireVerification: false,
  sessionDuration: '7d',  // Session lasts 7 days
},


  dbConnectionOptions: {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  schema: process.env.DB_SCHEMA || 'vendure',
  synchronize: false,
  migrationsRun: false,
  migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
  logging: false,
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 2,
    min: 3,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 90000,
    statement_timeout: '180000ms', // 3 minutes - explicit milliseconds format
  },
  maxQueryExecutionTime: 180000, // 3 minutes
},
  paymentOptions: {
    paymentMethodHandlers: [
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

   // TO:
AssetServerPlugin.init({
  route: 'assets',
  assetUploadDir: path.join(__dirname, '../static/assets'),
  storageStrategyFactory: () =>
    new S3AssetStorageStrategy(
      {
        bucket: process.env.SUPABASE_STORAGE_BUCKET!,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
        },
        nativeS3Configuration: {
          endpoint: process.env.SUPABASE_S3_ENDPOINT!,
          forcePathStyle: true,
          region: process.env.SUPABASE_S3_REGION ?? 'ap-southeast-2',
        },
      },
      (request, identifier) => {
  const normalizedPath = identifier.replace(/\\/g, '/');
  
  // Strip __02, __03 etc.
  const cleanPath = normalizedPath.replace(/__\d+(\.[a-z]+)$/i, '$1');
  
  // If source/ file doesn't exist in Supabase, serve from preview/ instead
  const servePath = cleanPath.replace(/^source\//, 'preview/');
  
  return `${process.env.SUPABASE_PUBLIC_URL}/${servePath}`;
},
    ),
}),
    DefaultSchedulerPlugin.init(),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({
      bufferUpdates: true, // Buffer updates to reduce database load
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
      appDir: path.join(__dirname, '../dist'),

    }),
  ],
};
