import net from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const preferred = parseInt(process.env.PREFERRED_VENDURE_PORT ?? '3002', 10);

const candidatePorts = [
  preferred,
  ...Array.from({ length: 30 }, (_, idx) => preferred + idx + 1),
];

async function getAvailablePort(ports) {
  for (const port of ports) {
    const available = await new Promise(resolve => {
      const server = net.createServer()
        .once('error', () => {
          server.close();
          resolve(null);
        })
        .once('listening', () => {
          server.close(() => resolve(port));
        })
        .listen(port, '0.0.0.0');
    });
    if (available != null) {
      return available;
    }
  }
  throw new Error('No available port found for Vendure');
}

const port = await getAvailablePort(candidatePorts);

console.log(`[vendure] using port ${port}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const child = spawn(
  'pnpm',
  ['--filter', 'vendure-backend', 'run', 'dev:internal'],
  {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(port),
    },
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
