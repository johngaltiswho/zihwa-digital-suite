"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const core_1 = require("@vendure/core");
const email_plugin_1 = require("@vendure/email-plugin");
const asset_server_plugin_1 = require("@vendure/asset-server-plugin");
const plugin_1 = require("@vendure/dashboard/plugin");
const graphiql_plugin_1 = require("@vendure/graphiql-plugin");
require("dotenv/config");
const node_path_1 = __importDefault(require("node:path"));
const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = Number(process.env.PORT) || 3002;
exports.config = {
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
        passwordHashingStrategy: new core_1.BcryptPasswordHashingStrategy(),
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
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
        migrations: [node_path_1.default.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        ssl: { rejectUnauthorized: false },
    },
    paymentOptions: {
        paymentMethodHandlers: [core_1.dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        graphiql_plugin_1.GraphiqlPlugin.init(),
        asset_server_plugin_1.AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: node_path_1.default.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
        }),
        core_1.DefaultSchedulerPlugin.init(),
        core_1.DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        core_1.DefaultSearchPlugin.init({
            bufferUpdates: false,
            indexStockStatus: true,
        }),
        email_plugin_1.EmailPlugin.init({
            devMode: true,
            outputPath: node_path_1.default.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: email_plugin_1.defaultEmailHandlers,
            templateLoader: new email_plugin_1.FileBasedTemplateLoader(node_path_1.default.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: '"Stalks N Spice" <noreply@stalksnspice.com>',
                verifyEmailAddressUrl: 'http://localhost:3003/verify',
                passwordResetUrl: 'http://localhost:3003/password-reset',
                changeEmailAddressUrl: 'http://localhost:3003/verify-email-address-change',
            },
        }),
        // Vendure 3.x Dashboard (Vite-based)
        plugin_1.DashboardPlugin.init({
            route: 'dashboard',
            appDir: node_path_1.default.join(__dirname, '../vendure-dashboard-temp'),
        }),
    ],
};
