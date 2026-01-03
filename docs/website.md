# Instructions for Web Designer

## Project Overview

**MWM** is a modern full-stack web framework built on Bun. It's designed for developers who want to build web applications quickly without the complexity of traditional frameworks.

### Target Audience

- Web developers (junior to senior)
- Indie hackers and startup founders
- Developers frustrated with complex build tooling
- Teams looking for a simpler alternative to Next.js/Remix

### Brand Personality

- **Fast** - Bun-powered, no build step complexity
- **Simple** - Convention over configuration
- **Modern** - Server-side rendering with HTMX for interactivity
- **Developer-friendly** - Great DX, minimal boilerplate

### Competitors/Reference Sites

- nextjs.org
- remix.run
- astro.build
- htmx.org
- bun.sh

---

## Pages Required

### 1. Homepage

**Purpose:** First impression, explain what MWM is, convert visitors to try it

**Sections:**

- Hero with tagline and "Get Started" CTA
- Quick install command (`bun create mwm my-app`)
- Key features (3-4 cards)
- Code example showing simplicity
- Social proof (GitHub stars, testimonials if available)
- Footer with links

**Key Messages:**

- Build full-stack apps with just Bun
- File-based routing like Next.js
- No webpack, no complex config
- Server-rendered React + HTMX

---

### 2. Documentation (Docs)

**Purpose:** Technical reference for developers

**Structure:**

- Sidebar navigation (collapsible sections)
- Search bar
- Previous/Next navigation
- Code blocks with syntax highlighting and copy button
- Dark mode support

**Doc Sections:**

1. Getting Started
   - Installation
   - Project Structure
   - First App
2. Routing
   - File-based Routes
   - Dynamic Routes
   - Layouts
   - API Routes
3. Data Fetching
   - Server Components
   - Forms & Actions
4. Styling
   - Tailwind CSS
   - Global Styles
5. Database
   - Prisma Integration
   - Migrations
6. Authentication
   - Sessions
   - Sign In/Sign Up
7. Deployment
   - Production Build
   - Docker

---

### 3. Examples/Showcase

**Purpose:** Show real apps built with MWM

**Content:**

- Grid of example projects with screenshots
- Filter by category (Blog, E-commerce, Dashboard, etc.)
- Links to live demo and source code
- "Submit your project" CTA

---

### 4. Blog

**Purpose:** Updates, tutorials, announcements

**Features:**

- List view with cards (title, date, excerpt, reading time)
- Individual post pages
- Author info
- Tags/categories
- RSS feed link

---

### 5. Pricing (Optional/Future)

**Purpose:** If we offer premium features or support

**Content:**

- Open source core (free)
- Pro tier for teams (if applicable)
- Enterprise support option
- FAQ section

---

## Design Requirements

### General

- Clean, minimal aesthetic
- Generous whitespace
- Fast-loading (we're a performance-focused framework!)
- Mobile-responsive
- Accessible (WCAG 2.1 AA)

### Colors

- Primary: Use Google Keep's yellow (#FBBC04 or similar warm yellow) as the primary accent color
- Dark mode required
- High contrast for code blocks
- The yellow should be used for CTAs, highlights, and brand elements

### Typography

- Monospace for code (Fira Code, JetBrains Mono, or similar)
- Sans-serif for body (Inter, System UI, or similar)
- Clear hierarchy (h1-h4)

### Components Needed

- Navigation (desktop + mobile hamburger)
- Hero section
- Feature cards
- Code blocks with syntax highlighting
- Buttons (primary, secondary, ghost)
- Input fields
- Sidebar navigation (for docs)
- Footer
- Callout/alert boxes (info, warning, tip)
- Tabs
- Table of contents

### Interactions

- Smooth scroll
- Hover states
- Copy-to-clipboard for code
- Mobile menu animation
- Theme toggle (light/dark)

---

## Deliverables

1. **Figma/Sketch File** with:

   - Desktop designs (1440px)
   - Mobile designs (375px)
   - Component library
   - Style guide (colors, typography, spacing)

2. **Pages to Design:**
   - Homepage
   - Docs page (with sidebar)
   - Single doc article
   - Blog list
   - Blog post
   - 404 page
