# Full Stack Developer Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

🔗 **Live Demo**: [https://portfolio-nextjs-mocha-beta.vercel.app/](https://portfolio-nextjs-mocha-beta.vercel.app/)

## Features

-  Modern and clean design
-  Fully responsive (mobile, tablet, desktop)
-  Built with Next.js 14+ App Router
-  Styled with Tailwind CSS
-  TypeScript for type safety
-  Optimized for performance
-  SEO friendly

## Sections

- **Hero** - Landing section with introduction
- **About** - Professional background and summary
- **Experience** - Work history and achievements
- **Projects** - Showcase of development projects
- **Skills** - Technical skills and expertise
- **Contact** - Contact form and social links

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

1. **Personal Information**: Edit `data/portfolio.ts` to update your experience, projects, and skills
2. **Hero Section**: Update your name in `components/sections/Hero.tsx`
3. **Contact Links**: Add your GitHub, LinkedIn, and email in `components/sections/Contact.tsx` and `components/Footer.tsx`
4. **SEO Metadata**: Update title and description in `app/layout.tsx`
5. **Styling**: Modify Tailwind classes or `app/globals.css` for custom styles

## Build for Production

```bash
npm run build
npm run start
```

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist Sans & Geist Mono
- **Linting**: ESLint

## Project Structure

```
portfolio-nextjs/
 app/                    # Next.js app directory
    layout.tsx         # Root layout
    page.tsx           # Home page
    globals.css        # Global styles
 components/            # React components
    sections/          # Page sections
       Hero.tsx
       About.tsx
       Experience.tsx
       Projects.tsx
       Skills.tsx
       Contact.tsx
    Navbar.tsx
    Footer.tsx
 data/                  # Portfolio data
    portfolio.ts
 types/                 # TypeScript types
    index.ts
 public/               # Static assets
```

## License

MIT

## Author

Gopikrishna Venepalli - Full Stack Developer @ Verizon
- Portfolio: [https://portfolio-nextjs-mocha-beta.vercel.app/](https://portfolio-nextjs-mocha-beta.vercel.app/)
- LinkedIn: [linkedin.com/in/gopikrishna-v-a6a528b4](https://linkedin.com/in/gopikrishna-v-a6a528b4)
- GitHub: [github.com/Gopikrishna1980](https://github.com/Gopikrishna1980)
