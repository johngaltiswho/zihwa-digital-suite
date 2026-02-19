import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const serverPort = Number(env.PORT || 3001);
  const dashboardPort = Number(env.DASHBOARD_PORT || 3002);

  const gqlDir = resolve(__dirname, 'src/gql');
  if (!fs.existsSync(gqlDir)) {
    fs.mkdirSync(gqlDir, { recursive: true });
  }

  return {
    root: __dirname,
    base: '/dashboard/',

    plugins: [
      react(),
      vendureDashboardPlugin({
        vendureConfigPath: resolve(__dirname, 'src/vendure-config.ts'),
        // 'auto' derives the API origin from window.location so the browser
        // sees same-origin requests. The proxy below forwards them to the backend.
        api: {
          host: 'auto',
          port: 'auto',
        },
        gqlOutputPath: gqlDir,
        tempCompilationDir: resolve(__dirname, '.vendure-dashboard-temp'),
      }),
    ],

    server: {
      port: dashboardPort,
      fs: {
        allow: [resolve(__dirname, '../../')],
      },
      proxy: {
        '/admin-api': {
          target: `http://127.0.0.1:${serverPort}`,
          changeOrigin: true,
          ws: true,
        },
        '/assets': {
          target: `http://127.0.0.1:${serverPort}`,
          changeOrigin: true,
        },
      },
    },

    optimizeDeps: {
      force: true,
    },
  };
});
