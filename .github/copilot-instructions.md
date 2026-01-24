# Portfolio Project - Copilot Instructions

## Project Overview
Next.js portfolio website for a Full Stack Developer at Verizon showcasing professional experience, projects, and skills.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: React functional components with hooks

## Project Structure
- `app/` - Next.js pages (page.tsx, layout.tsx)
- `components/` - Reusable React components (Navbar, Footer)
- `components/sections/` - Page sections (Hero, About, Experience, Projects, Skills, Contact)
- `data/` - Portfolio data (experiences, projects, skills)
- `types/` - TypeScript type definitions
- `public/` - Static assets

## Development
- `npm run dev` - Start dev server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Key Features
- Responsive design with Tailwind CSS
- SEO optimized with Next.js metadata
- Smooth scrolling navigation
- Contact form with state management
- Mobile-friendly navigation menu

## Customization
1. Update personal info in `data/portfolio.ts`
2. Replace placeholder text in Hero section with your name
3. Add your GitHub/LinkedIn URLs in Contact and Footer
4. Update metadata in `app/layout.tsx`
5. Add project screenshots to `public/` folder
