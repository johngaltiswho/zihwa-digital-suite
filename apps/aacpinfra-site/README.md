# AACP Infrastructure Website

Monorepo Application – aacpinfra-site

This repository contains the official website for AACP Infrastructure Systems Pvt. Ltd., built as part of the ZIHWA Digital Suite monorepo.
The application showcases AACP’s services, projects, news, careers, safety, innovation, and precast offerings with a modern, scalable frontend architecture.

---

## Purpose of the Project:
- Build a premium, enterprise-grade corporate website
- Centralize all AACP digital content (Projects, News, Careers, Services, etc.)
- Enable future scalability without rewriting core logic
- Follow industry-standard frontend architecture and best practices

---

## 🧰 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)

### Tooling & Platform
- **Turborepo** (monorepo management)
- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x

----

## 📁 Application Structure — `apps/aacpinfra-site`

```txt
apps/aacpinfra-site/
├── public/                          # Public static assets
│   ├── hero/                        # Hero banner images
│   ├── news/                        # News images
│   ├── projects/                    # Project images
│   ├── services/                    # Service icons/images
│   ├── docs/                        # PDFs (brochures, presentations)
│   └── icons/                       # SVG icons
│
├── src/
│   ├── app/                         # Next.js App Router (pages & routing)
│   │   ├── page.tsx                 # Home page (/)
│   │   ├── layout.tsx               # Root layout (Header & Footer)
│   │   ├── about/                   # About AACP page
│   │   ├── careers/                 # Careers listing & job detail pages
│   │   ├── contact/                 # Contact page
│   │   ├── innovation/              # Innovation (BIM, Lean, Green)
│   │   ├── news/                    # News listing, detail & pagination
│   │   ├── services/                # Services listing & details
│   │   ├── projects/                # Projects listing
│   │   ├── precast/                 # Precast solutions
│   │   ├── safety/                  # Safety & HSE
│   │   └── strategy/                # Strategy & vision
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── header/                  # Global header & navigation
│   │   ├── footer/                  # Footer & footer-top sections
│   │   ├── news/                    # News-related UI components
│   │   ├── projects/                # Project-related UI components
│   │   ├── precast/                 # Precast UI components
│   │   └── shared/                  # Shared UI (Hero, Lightbox, etc.)
│   │
│   ├── data/                        # Static content & listings
│   │   ├── homepage.ts              # Home page content
│   │   ├── services.ts              # Services data
│   │   ├── projects.ts              # Projects data
│   │   ├── news.ts                  # News listing data
│   │   └── jobs.ts                  # Careers/jobs data
│   │
│   ├── lib/                         # Helpers & utilities
│   │   ├── newsData.ts              # News detail content (PDFs, galleries)
│   │   └── newsPagination.ts        # Pagination logic
│   │
│   ├── types/                       # TypeScript definitions
│   │   ├── news.ts
│   │   ├── services.ts
│   │   └── projects.ts
│   │
│   └── styles/                      # Global styles & Tailwind setup
│
├── .env.example                     # Environment variable template
├── next.config.js                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # App dependencies & scripts
---

## global Header & Footer
```txt
packages/ui/src/components/
├── Header/                          # Global site header
│   ├── Header.tsx                  # Logo, navigation, CTA
│   ├── navbar.tsx                  # Navigation links
│   ├── navConfig.tsx               # Centralized nav config
│   └── index.ts                    # Barrel export
│
├── Footer/                          # Global site footer
│   ├── Footer.tsx
│   ├── FooterTop.tsx
│   └── index.ts
│
├── HeroSlider/                      # Reusable hero slider
│   └── HeroSlider.tsx
│
├── button.tsx                       # Shared button component
├── card.tsx                         # Shared card UI
└── code.tsx                         # Shared utilities

##  Environment Setup :
### 1. System Requirements
  Make sure the following are installed on your system:
- Node.js ≥ 18.x
- pnpm ≥ 8.x
- Git (Latest version)

## 2. Clone the Repository 
```bash
git clone <repository-url>
cd zhiwa-digital-suite

### 3. Install pnpm (If Not Installed) 
```bash
   npm install -g pnpm

### 4. Install Dependencies (Root Level)
```bash
Run this command from the monorepo root:
- pnpm install
This will install:
- All app dependencies
- Shared UI package dependencies
- Shared ESLint & TypeScript configs

### 5. Environment Variables Setup
Create environment files only inside the required app.
AACP Infrastructure Website
Path:
```txt
apps/aacpinfra-site/.env.local
Example:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXT_PUBLIC_CONTACT_EMAIL=careers@aacpinfra.com

   Run this command:
   ```bash
   pnpm dev --filter aacpinfra-site

- (OR) from the app folder:
```bash
cd apps/aacpinfra-site
pnpm dev

### 7. Application will be available at:
```bash
http://localhost:3000

### 8. Build For Production 
```bash
   cd apps/aacpinfra-site
   pnpm build
   pnpm start


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


