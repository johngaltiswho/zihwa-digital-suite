# Port Assignment Reference

This document defines the port assignments for all applications and services in the Zihwa Digital Suite monorepo to prevent port conflicts.

## Port Ranges

- **3000-3099**: Frontend Applications (Next.js)
- **3100-3199**: Backend Services & APIs
- **5000-5999**: Dashboards & Admin Panels

## Applications & Services

### Frontend Applications (Next.js)

| Application | Port | Description |
|------------|------|-------------|
| web | 3000 | Main marketing/landing site |
| docs | 3001 | Documentation site |
| aacpinfra-site | 3002 | AACP Infrastructure website |
| parsoptima | 3003 | Parsoptima e-commerce storefront |
| stalknspice-storefront | 3004 | StalknSpice e-commerce storefront |
| zihwafoods-site | 3005 | Zihwa Foods website |
| fluvium-site | 3006 | Fluvium website |
| zihwa-insights | 3007 | Zihwa Insights analytics platform |
| accounting-engine | 3008 | Accounting & document management app |

### Backend Services

| Service | Port | Description |
|---------|------|-------------|
| vendure-backend (API) | 3100 | Vendure e-commerce backend API |
| vendure-worker | 3101 | Vendure background worker |

### Admin Dashboards

| Dashboard | Port | Description |
|-----------|------|-------------|
| vendure-dashboard | 5176 | Vendure admin dashboard (Vite) |

## Usage

When starting a development server, use the assigned port:

```bash
# Example for stalknspice-storefront
pnpm --filter stalknspice-storefront dev
# Runs on http://localhost:3004

# Example for vendure-backend
pnpm --filter vendure-backend dev
# API runs on http://localhost:3100
# Dashboard runs on http://localhost:5176
```

## Environment Variables

For backend services that use environment variables for ports:

- **Vendure Backend**: Set `PORT=3100` in `.env` file

## Notes

- If you add a new application, update this document and assign a port from the appropriate range
- Keep port assignments sequential within each range
- Update package.json scripts to include the `--port` flag for Next.js apps
- For backend services, update both package.json scripts and environment configuration
