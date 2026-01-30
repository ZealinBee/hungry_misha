# Student Hungry - Design Document

> Design system inspired by Hinge's visual identity - clean, modern, and sophisticated

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Iconography](#iconography)
7. [Imagery Guidelines](#imagery-guidelines)
8. [Motion & Animation](#motion--animation)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)
11. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Principles

1. **Intentional Simplicity**: Every element serves a purpose. Remove anything that doesn't directly contribute to the user experience.

2. **Sophisticated yet Friendly**: Modern design that feels approachable, not intimidating.

3. **Content First**: Design should elevate user content, not compete with it. The interface should feel invisible.

4. **Editorial Aesthetic**: Treat user-generated content with the same visual weight and respect as professional editorial content.

5. **Authentic Connection**: Visuals should evoke genuine human moments, not stock photography artificiality.

### Design Ratios

- **80/20 Rule**: Core palette (black/white) should dominate 80% of the interface. Accent colors used sparingly (20%) for emphasis and delight.
- **Content vs Chrome**: Maximize content area, minimize UI chrome.

---

## Color Palette

### Core Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary White** | `#FFFEFD` | rgb(255, 254, 253) | Primary background, cards, content areas |
| **Primary Black** | `#1A1A1A` | rgb(26, 26, 26) | Primary text, headings, icons |
| **Dove Gray** | `#666666` | rgb(102, 102, 102) | Secondary text, captions, metadata |

### Accent Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Kohlrabi Purple** | `#994EA8` | rgb(153, 78, 168) | Primary accent, CTAs, highlights, links |
| **Kohlrabi Light** | `#B876C4` | rgb(184, 118, 196) | Hover states, secondary accents |
| **Kohlrabi Dark** | `#7A3E86` | rgb(122, 62, 134) | Active states, pressed buttons |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#2E7D32` | Confirmations, success states |
| **Error** | `#C62828` | Error messages, destructive actions |
| **Warning** | `#F57C00` | Warnings, alerts |
| **Info** | `#1565C0` | Informational messages |

### Dark Mode Palette

| Name | Light Mode | Dark Mode |
|------|------------|-----------|
| Background | `#FFFEFD` | `#0A0A0A` |
| Surface | `#FFFFFF` | `#1A1A1A` |
| Primary Text | `#1A1A1A` | `#EDEDED` |
| Secondary Text | `#666666` | `#999999` |
| Accent | `#994EA8` | `#B876C4` |

### CSS Custom Properties

```css
:root {
  /* Core Colors */
  --color-white: #FFFEFD;
  --color-black: #1A1A1A;
  --color-gray: #666666;
  --color-gray-light: #E5E5E5;
  --color-gray-lighter: #F5F5F2;

  /* Accent Colors */
  --color-accent: #994EA8;
  --color-accent-light: #B876C4;
  --color-accent-dark: #7A3E86;

  /* Semantic Colors */
  --color-success: #2E7D32;
  --color-error: #C62828;
  --color-warning: #F57C00;
  --color-info: #1565C0;

  /* Background & Surface */
  --color-background: var(--color-white);
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FFFFFF;

  /* Text Colors */
  --color-text-primary: var(--color-black);
  --color-text-secondary: var(--color-gray);
  --color-text-tertiary: #999999;
  --color-text-inverse: var(--color-white);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0A0A0A;
    --color-surface: #1A1A1A;
    --color-surface-elevated: #262626;
    --color-text-primary: #EDEDED;
    --color-text-secondary: #999999;
    --color-text-tertiary: #666666;
    --color-text-inverse: var(--color-black);
    --color-accent: #B876C4;
  }
}
```

---

## Typography

### Font Families

#### Primary Serif: Tiempos (or Libre Baskerville as fallback)

- **Usage**: Headlines, prompts, featured content, quotes
- **Characteristics**: Elegant, practical, commands attention
- **Weights**: Regular (400), Medium (500), Bold (700)

```css
--font-serif: 'Tiempos Headline', 'Libre Baskerville', Georgia, 'Times New Roman', serif;
--font-serif-text: 'Tiempos Text', 'Libre Baskerville', Georgia, serif;
```

#### Secondary Sans-Serif: Modern Era (or DM Sans as fallback)

- **Usage**: Body copy, UI elements, labels, buttons, captions
- **Characteristics**: Large x-height, low stroke contrast, highly readable
- **Weights**: Regular (400), Medium (500), Bold (700)

```css
--font-sans: 'Modern Era', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| **Display 1** | 72px / 4.5rem | 1.1 | 700 | Hero headlines |
| **Display 2** | 56px / 3.5rem | 1.15 | 700 | Page titles |
| **Heading 1** | 40px / 2.5rem | 1.2 | 700 | Section headers |
| **Heading 2** | 32px / 2rem | 1.25 | 600 | Subsection headers |
| **Heading 3** | 24px / 1.5rem | 1.3 | 600 | Card titles |
| **Heading 4** | 20px / 1.25rem | 1.35 | 600 | Small headers |
| **Body Large** | 18px / 1.125rem | 1.6 | 400 | Featured body text |
| **Body** | 16px / 1rem | 1.6 | 400 | Default body text |
| **Body Small** | 14px / 0.875rem | 1.5 | 400 | Secondary text |
| **Caption** | 12px / 0.75rem | 1.4 | 400 | Metadata, timestamps |
| **Overline** | 12px / 0.75rem | 1.4 | 600 | Labels, categories |

### CSS Typography Variables

```css
:root {
  /* Font Families */
  --font-serif: 'Libre Baskerville', Georgia, serif;
  --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Font Sizes */
  --text-display-1: 4.5rem;
  --text-display-2: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 2rem;
  --text-h3: 1.5rem;
  --text-h4: 1.25rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;

  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.05em;
}
```

### Typography Patterns

#### Headlines (Serif)
```css
.headline {
  font-family: var(--font-serif);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
}
```

#### Body Text (Sans-Serif)
```css
.body {
  font-family: var(--font-sans);
  font-weight: var(--font-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}
```

#### Circle Highlight Effect
Hinge uses a distinctive circle/underline highlight on key words:

```css
.highlight-circle {
  position: relative;
  display: inline-block;
}

.highlight-circle::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: -8px;
  right: -8px;
  height: 40%;
  background: var(--color-accent);
  opacity: 0.3;
  border-radius: 50%;
  z-index: -1;
}
```

---

## Spacing & Layout

### Spacing Scale

Based on an 8px grid system:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, inline elements |
| `--space-2` | 8px | Small gaps, icon padding |
| `--space-3` | 12px | Compact spacing |
| `--space-4` | 16px | Default spacing |
| `--space-5` | 20px | Medium spacing |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Large gaps |
| `--space-10` | 40px | Section margins |
| `--space-12` | 48px | Large section spacing |
| `--space-16` | 64px | Page sections |
| `--space-20` | 80px | Hero spacing |
| `--space-24` | 96px | Major sections |

### CSS Spacing Variables

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Layout Grid

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;

  --gutter: var(--space-6);
  --gutter-lg: var(--space-8);
}

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-left: var(--gutter);
  padding-right: var(--gutter);
}
```

### Layout Patterns

#### Split Layout (50/50)
Common for hero sections with image + text:

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: center;
}

@media (max-width: 768px) {
  .split-layout {
    grid-template-columns: 1fr;
  }
}
```

#### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}
```

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-white);
  background-color: var(--color-black);
  border: none;
  border-radius: 100px; /* Pill shape */
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: scale(0.98);
}
```

#### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-black);
  background-color: transparent;
  border: 2px solid var(--color-black);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--color-black);
  color: var(--color-white);
}
```

#### Accent Button
```css
.btn-accent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-white);
  background-color: var(--color-accent);
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-accent:hover {
  background-color: var(--color-accent-dark);
}
```

### Cards

#### Content Card
```css
.card {
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card-content {
  padding: var(--space-6);
}

.card-title {
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
}

.card-description {
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}
```

### Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 2px solid var(--color-gray-light);
  border-radius: 12px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input-label {
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
}

.nav-logo {
  font-family: var(--font-sans);
  font-size: var(--text-h4);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: var(--space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link.active {
  color: var(--color-accent);
}
```

---

## Iconography

### Icon Style Guidelines

- **Style**: Outlined, 2px stroke weight
- **Size**: 24x24px base, scalable
- **Corner Radius**: Rounded corners (2px)
- **Color**: Inherit from parent (currentColor)

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| XS | 16px | Inline with small text |
| SM | 20px | Buttons, list items |
| MD | 24px | Default, navigation |
| LG | 32px | Feature icons |
| XL | 48px | Hero sections |

### Recommended Icon Libraries

1. **Lucide Icons** (primary recommendation)
2. **Heroicons**
3. **Phosphor Icons**

---

## Imagery Guidelines

### Photography Style

1. **Authentic Moments**: Real, candid shots over posed photography
2. **Warm Tones**: Natural lighting with warm color grading
3. **Human Connection**: Focus on genuine emotions and interactions
4. **Diverse Representation**: Inclusive imagery reflecting various backgrounds
5. **Lifestyle Context**: Show people in real environments, not studios

### Image Treatment

```css
/* Standard image styling */
.image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
}

/* Hero images */
.image-hero {
  aspect-ratio: 16/9;
}

/* Profile/avatar images */
.image-avatar {
  aspect-ratio: 1/1;
  border-radius: 50%;
}

/* Card images */
.image-card {
  aspect-ratio: 4/3;
}
```

### Image Aspect Ratios

| Type | Ratio | Usage |
|------|-------|-------|
| Hero | 16:9 | Banner images, full-width |
| Card | 4:3 | Content cards, previews |
| Square | 1:1 | Avatars, thumbnails |
| Portrait | 3:4 | Profile photos |

---

## Motion & Animation

### Timing Functions

```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-fast` | 100ms | Micro-interactions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Larger elements |
| `--duration-slower` | 500ms | Page transitions |

### Animation Patterns

#### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s var(--ease-out) forwards;
}
```

#### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s var(--ease-out) forwards;
}
```

### Hover States

```css
/* Standard hover lift */
.hover-lift {
  transition: transform var(--duration-normal) var(--ease-default),
              box-shadow var(--duration-normal) var(--ease-default);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

---

## Responsive Design

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

### Media Query Patterns

```css
/* Mobile first approach */
.component {
  /* Mobile styles (default) */
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .component {
    /* Tablet and up */
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop and up */
    padding: var(--space-8);
  }
}
```

### Responsive Typography

```css
/* Fluid typography */
.display-1 {
  font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);
}

.heading-1 {
  font-size: clamp(1.75rem, 3vw + 0.5rem, 2.5rem);
}

.body {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
}
```

---

## Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18px+): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

### Focus States

```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Remove default outline when using mouse */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Utilities

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Implementation Guide

### Setting Up Fonts

#### Option 1: Google Fonts (Fallback fonts)

```tsx
// app/layout.tsx
import { Libre_Baskerville, DM_Sans } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Tailwind CSS Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'hinge-white': '#FFFEFD',
        'hinge-black': '#1A1A1A',
        'hinge-gray': '#666666',
        'hinge-gray-light': '#E5E5E5',
        'hinge-gray-lighter': '#F5F5F2',
        'kohlrabi': {
          DEFAULT: '#994EA8',
          light: '#B876C4',
          dark: '#7A3E86',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-2': ['3.5rem', { lineHeight: '1.15', fontWeight: '700' }],
      },
      borderRadius: {
        'pill': '100px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
};
```

### Component Examples

#### Hero Section
```tsx
export function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-serif text-display-1 text-hinge-black mb-6">
            Find your <span className="highlight-circle">next</span> meal buddy
          </h1>
          <p className="font-sans text-body-lg text-hinge-gray mb-8">
            Connect with fellow students who share your taste in food and conversation.
          </p>
          <button className="btn-primary">
            Get Started
          </button>
        </div>
        <div className="relative">
          <img
            src="/hero-image.jpg"
            alt="Students enjoying a meal together"
            className="rounded-2xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
```

---

## File Structure Recommendation

```
app/
├── globals.css          # Global styles & CSS variables
├── layout.tsx           # Root layout with fonts
├── page.tsx             # Home page
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   └── sections/
│       ├── Hero.tsx
│       └── ...
└── styles/
    └── design-tokens.css  # All CSS custom properties
```

---

## Sources & References

- [Hinge Brand Resources](https://hinge.co/brand-resources)
- [Hinge Brand Color Palette - Mobbin](https://mobbin.com/colors/brand/hinge)
- [It's Nice That - Hinge Rebrand](https://www.itsnicethat.com/news/hinge-rebrand-less-addictive-graphic-design-100419)
- [1000 Logos - Hinge Logo](https://1000logos.net/hinge-logo/)
- [Klim Type Foundry - Tiempos](https://klim.co.nz/retail-fonts/tiempos-headline/)
- [Family Type - Modern Era](https://www.familytype.co/typefaces/modern-era)

---

*Document Version: 1.0*
*Last Updated: January 2026*
