# Allergy Health Daily - Next.js Version

This is the modernized Next.js version of the **Allergy Health Daily** website, successfully migrated from static HTML.

## 🚀 Project Features

### Tech Stack
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 + Custom Brand Colors
- **Fonts**: Playfair Display (Google Fonts) + Grift (Custom Font)
- **Build Tool**: Turbopack

### Key Features
- ✅ **Responsive Design** - Perfect compatibility across all devices
- ✅ **Blog System** - Dynamic blog pages and detail views
- ✅ **Interactive Quiz** - Allergy personality assessment functionality
- ✅ **SEO Optimization** - Comprehensive meta tags and structured data
- ✅ **Performance Optimization** - Next.js automatic image optimization and code splitting
- ✅ **Brand Consistency** - Preserved original design style and colors

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog-related pages
│   ├── quiz/              # Quiz pages
│   ├── privacy-policy/    # Privacy policy
│   ├── terms-of-service/  # Terms of service
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   └── blog/            # Blog components (BlogCard, CategoryTag)
public/
├── images/              # Image assets
└── fonts/              # Font files
```

## 🎨 Design System

### Brand Colors
- **Primary**: `#056839` (Deep Green)
- **Dark**: `#2a4028` (Darker Green)  
- **Light**: `#d7ebc7` (Light Green)
- **Secondary**: `#2c5aa0` (Blue)

### Component Features
- **BlogCard**: Hover animations, category tags, reading time
- **CategoryTag**: Interactive filter tags
- **Header**: Responsive navigation, active state indication
- **Footer**: Links and copyright information

## 🚀 Development and Deployment

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build production version
npm run start        # Start production server
npm run lint         # Code linting
```

### Access URLs
- Development: http://localhost:3000
- Production: Deployable to Vercel, Netlify, and other platforms

## 📊 Performance Metrics

- **Bundle Size**: ~123kB (first load)
- **Static Generation**: 11 pages pre-rendered
- **Code Splitting**: Automatic page-based splitting
- **Image Optimization**: Next.js Image component auto-optimization

## 🔧 Completed Migration Features

1. **✅ Home Page** - Complete hero section, blog cards, CTA areas
2. **✅ Blog System** - List pages, detail pages, category filtering
3. **✅ Quiz Functionality** - Interactive Q&A, result display, personalized recommendations
4. **✅ Static Pages** - Privacy policy, terms of service
5. **✅ Responsive Layout** - Mobile optimization
6. **✅ SEO Optimization** - Meta tags, structured data

## 🌟 Technical Highlights

- **Modern Architecture**: Latest Next.js 15 with App Router
- **Type Safety**: Complete TypeScript support
- **Performance Optimization**: Static generation, image optimization, code splitting
- **Developer Experience**: Hot reload, Turbopack build tool
- **Maintainability**: Component-based architecture, clear file structure

## Original Next.js Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

