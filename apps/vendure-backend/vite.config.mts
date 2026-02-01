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
  const dashboardPath = 'dashboard';

  const gqlDir = resolve(__dirname, 'src/gql');
  if (!fs.existsSync(gqlDir)) {
    fs.mkdirSync(gqlDir, { recursive: true });
  }

  return {
    root: __dirname,
    base: `/${dashboardPath}/`,

    esbuild: {
      jsx: 'automatic',
    },

    plugins: [
      react({
  tsconfig: resolve(__dirname, 'tsconfig.dashboard.json'),
}),

      vendureDashboardPlugin({
        // 🔥 MUST be a filesystem path — NOT file://
        vendureConfigPath: resolve(__dirname, 'src/vendure-config.ts'),

        api: {
          host: 'http://localhost',
          port: serverPort,
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
    },

    optimizeDeps: {
      force: true,
    },
  };
});
