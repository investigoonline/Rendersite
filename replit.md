# Overview

InvestigooOnline is a financial planning platform by IFS Group offering comprehensive financial calculators, resources, and planning tools. It serves both authenticated and guest users with features like net worth tracking, loan, mortgage, and retirement planning, alongside educational content. The platform leverages over 40 years of IFS Group expertise to provide professional financial guidance.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

The application is a monorepo with a React/TypeScript frontend and an Express.js/TypeScript backend, designed for modern web applications.

## Frontend Architecture
- **Framework**: React with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query for server state.
- **UI Framework**: shadcn/ui built on Radix UI.
- **Styling**: Tailwind CSS with custom design tokens.
- **Forms**: React Hook Form with Zod validation.
- **Build Tool**: Vite.

## Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Database ORM**: Drizzle ORM.
- **API Design**: RESTful.
- **Session Management**: Express sessions with PostgreSQL store.

## Authentication System
- **Primary Auth**: OpenID Connect.
- **Guest Access**: Custom system with email verification.
- **Session Storage**: PostgreSQL-backed sessions.

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver.
- **Schema Management**: Drizzle migrations.
- **Key Tables**: Users, guest accounts, calculations, resources, contact messages, net worth snapshots.

## Calculator System
- **Architecture**: Modular components with shared validation schemas.
- **Functionality**: Net worth, loan, mortgage, retirement, tax calculations.
- **Persistence**: Calculations can be saved for authenticated users and guests.

## Resource Management
- **Content Types**: Articles, videos, newsletters, flipbooks, FAQs.
- **Functionality**: Type-based filtering, search, view tracking.

## Content Management System (CMS)
- **Access**: Role-based (Super Admins, Content Managers).
- **Content Editing**: Schema-driven forms using Zod with UI metadata.
- **Controls**: Supports text, numbers, dropdowns, switches, icon pickers, and array editors.
- **Dynamic Sections**: Content organized by page with ability to add new sections from predefined types.
- **Icon Integration**: Lucide React icons are selectable.
- **Hero Image Management**: CMS-driven upload and management for major pages, with automatic resizing and WebP conversion.

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL hosting.

## Authentication Provider
- **OpenID Connect**: For secure user authentication.

## UI Dependencies
- **Radix UI**: Accessible component primitives.
- **Lucide Icons**: SVG icon library.
- **Google Fonts**: Inter, JetBrains Mono.

## Form and Validation
- **Zod**: Runtime type validation and schema definition.
- **React Hook Form**: Form management.

## Data Fetching
- **TanStack Query**: Server state management.
- **Native Fetch**: HTTP client for API requests.