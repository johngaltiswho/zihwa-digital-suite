# AACP Infrastructure Website

Monorepo Application – aacpinfra-site

This repository contains the official website for AACP Infrastructure Systems Pvt. Ltd., built as part of the ZIHWA Digital Suite monorepo.
The application showcases AACP’s services, projects, news, careers, safety, innovation, and precast offerings with a modern, scalable frontend architecture.

# Purpose of the Project:
--> Build a premium, scalable corporate website
--> Centralize all AACP content (Projects, News, Careers, Services, etc.)
--> Enable easy future expansion without rewriting core logic
--> Follow enterprise-level frontend standards

# Tech Stack: 
Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
Tooling & Platform: 
- Turborepo (monorepo management)
- Node.js (>=18)
- npm (package manager)

# File Structure 
apps/aacpinfra-site/
│
├── public/                              → Publicly served static assets
│   ├── news/                            → News images used in listing & detail pages
│   ├── projects/                        → Project-related images
│   ├── services/                        → Service-related images/icons
│   ├── docs/                            → PDFs (presentations, brochures)
│   ├── hero/                            → Hero banner images
│   └── icons/                           → SVGs and UI icons
│
├── src/
│   │
│   ├── app/                             → Next.js App Router (routing & pages)
│   │   ├── page.tsx                     → Home page (/)
│   │   ├── layout.tsx                   → Root layout (injects Header & Footer)
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                 → About AACP page
│   │   │
│   │   ├── careers/
│   │   │   ├── page.tsx                 → Careers listing page
│   │   │   └── [slug]/page.tsx          → Individual job detail page
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx                 → Contact page
│   │   │
│   │   ├── innovation/
│   │   │   └── page.tsx                 → Innovation page (BIM, Lean, Green)
│   │   │
│   │   ├── news/
│   │   │   ├── page.tsx                 → News listing page
│   │   │   ├── [slug]/page.tsx          → News detail page
│   │   │   ├── category/[category]/page.tsx → Category-based news listing
│   │   │   └── page/[pageNumber]/page.tsx   → Paginated news pages
│   │   │
│   │   ├── services/
│   │   │   ├── page.tsx                 → Services listing page
│   │   │   └── [slug]/page.tsx          → Individual service detail page
│   │   │
│   │   ├── projects/
│   │   │   └── page.tsx                 → Projects listing page
│   │   │
│   │   ├── precast/
│   │   │   └── page.tsx                 → Precast solutions page
│   │   │
│   │   ├── safety/
│   │   │   └── page.tsx                 → Safety & HSE page
│   │   │
│   │   └── strategy/
│   │       └── page.tsx                 → Strategy & vision page
│   │
│   ├── components/                      → Reusable UI components
│   │   ├── header/
│   │   │   └── Header.tsx               → Global site header & navigation
│   │   │
│   │   ├── footer/
│   │   │   ├── Footer.tsx               → Global site footer
│   │   │   └── FooterTop.tsx            → Footer top content sections
│   │   │
│   │   ├── news/
│   │   │   ├── NewsList.tsx             → News list renderer
│   │   │   ├── NewsCard.tsx             → Individual news card
│   │   │   ├── NewsGallery.tsx          → Image gallery for news detail
│   │   │   ├── NewsImageSlider.tsx      → News hero slider
│   │   │   └── Pagination.tsx           → Pagination UI
│   │   │
│   │   ├── projects/
│   │   │   ├── FeaturedProjects.tsx     → Featured projects section
│   │   │   ├── OngoingProjects.tsx      → Ongoing projects highlight
│   │   │   └── ProjectSkeleton.tsx      → Loading skeleton UI
│   │   │
│   │   ├── precast/
│   │   │   ├── PrecastHero.tsx          → Precast hero section
│   │   │   └── PrecastGrid.tsx          → Precast items grid
│   │   │
│   │   └── shared/
│   │       ├── HeroBanner.tsx           → Reusable hero banner
│   │       └── ImageLightbox.tsx        → Fullscreen image viewer
│   │
│   ├── data/                            → Static listing-level content
│   │   ├── news.ts                      → News listing data
│   │   ├── projects.ts                  → Projects data
│   │   ├── services.ts                  → Services data
│   │   ├── jobs.ts                      → Careers/jobs data
│   │   └── homepage.ts                  → Home page content
│   │
│   ├── lib/                             → Detailed data & helpers
│   │   ├── newsData.ts                  → News detail content (gallery, PDFs)
│   │   └── newsPagination.ts            → Pagination logic
│   │
│   ├── types/                           → TypeScript definitions
│   │   ├── news.ts                      → News types
│   │   ├── services.ts                  → Service types
│   │   └── projects.ts                  → Project types
│   │
│   └── styles/                          → Global styles & Tailwind setup
│
├── .env.example                          → Environment variable template
├── next.config.js                        → Next.js configuration
├── tsconfig.json                         → TypeScript configuration
└── package.json                          → Dependencies & scripts
# global Header & Footer
packages/ui/src/components/
│
├── Header/
│   ├── Header.tsx            → Main site header (logo, navigation, CTA)
│   ├── navbar.tsx            → Navigation links & menu structure
│   ├── navConfig.tsx         → Centralized navigation config (routes & labels)
│   └── index.ts              → Barrel export for Header components
│
├── Footer/
│   ├── Footer.tsx            → Global footer wrapper
│   ├── FooterTop.tsx         → Top section (company, inquiries, office details)
│   └── index.ts              → Barrel export for Footer components
│
├── HeroSlider/
│   └── HeroSlider.tsx        → Reusable hero slider used across apps
│
├── button.tsx                → Shared button component
├── card.tsx                  → Shared card UI component
└── code.tsx                  → Shared code/text utilities

##  Environment Setup :
1. System Requirements
- Make sure the following are installed on your system:
* Node.js        ≥ 18.x
* pnpm            ≥ 8.x
* Git            Latest version

2. Clone the Repository 
git clone <repository-url>
cd zhiwa-digital-suite

3. Install pnpm (If Not Installed) 
   npm install -g pnpm

4. Install Dependencies (Root Level)
Run this command from the monorepo root:
- pnpm install
This will install:
* All app dependencies
* Shared UI package dependencies
* Shared ESLint & TypeScript configs

5. Environment Variables Setup
Create environment files only inside the required app.
AACP Infrastructure Website
Path:
apps/aacpinfra-site/.env.local
Example:
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXT_PUBLIC_CONTACT_EMAIL=careers@aacpinfra.com

6. Run AACP Application (Development):
   Run this command:
   pnpm dev --filter=aacpinfra-site

- (OR) from the app folder:
cd apps/aacpinfra-site
pnpm dev

7. Application will be available at:
http://localhost:3000

8. Build For Production 
   cd apps/aacpinfra-site
   pnpm build
   pnpm start


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


