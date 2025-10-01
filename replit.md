# Overview

InvestigooOnline is a financial planning platform built by IFS Group that provides comprehensive financial calculators, resources, and planning tools. The application serves both authenticated users and guest users, offering features like net worth tracking, loan calculations, mortgage planning, retirement planning, and educational resources. The platform emphasizes professional financial guidance with 40+ years of IFS Group expertise.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Full-Stack Architecture
The application follows a monorepo structure with separate client and server directories, built as a modern web application with React frontend and Express.js backend.

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with consistent error handling
- **Session Management**: Express sessions with PostgreSQL store
- **File Structure**: Modular route handlers and storage layer abstraction

### Authentication System
- **Primary Auth**: Replit's OpenID Connect integration for client authentication
- **Guest Access**: Custom guest account system with email verification
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTPS-only cookies, secure session management

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle migrations with type-safe schema definitions
- **Key Tables**: Users, guest accounts, calculations, resources, contact messages, net worth snapshots
- **Data Types**: Support for JSON storage, enums, UUIDs, and temporal data

### Calculator System
- **Architecture**: Modular calculator components with shared validation schemas
- **Data Flow**: Form validation → calculation logic → result display → optional persistence
- **Calculator Types**: Net worth, loan payoff, mortgage, retirement, tax calculations
- **Persistence**: Calculations can be saved for authenticated users and guests

### Resource Management
- **Content Types**: Articles, videos, newsletters, flipbooks, FAQs
- **Categorization**: Type-based filtering and search functionality
- **View Tracking**: Analytics for resource engagement
- **Storage**: Database-driven content management

### Content Management System (CMS)
- **Role-Based Access**: Super Admins and Content Managers can manage all website content
- **Schema-Driven Forms**: Content editing uses Zod schemas with UI metadata for type-safe validation
- **Form Controls**: Text fields, textareas, numbers, dropdowns, switches, icon pickers, and array editors
- **Dynamic Sections**: Content organized by page (home, services, contact, resources, footer)
- **Add Section Feature**: Content managers can create new sections from predefined types per page
- **Section Types**: Heroes, stats, features, service lists, contact methods, resource highlights
- **Icon Integration**: Lucide React icons selectable via dropdown with type-safe mappings
- **Array Management**: ArrayFieldEditor handles repeatable content (stats, features, links) with add/remove/reorder
- **Security**: All CMS endpoints protected with requireRole middleware for super_admin and content_manager roles

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL hosting with connection pooling
- **Connection**: WebSocket-based connections for serverless compatibility

### Authentication Provider
- **Replit Auth**: OpenID Connect integration for user authentication
- **Environment**: Configured for Replit ecosystem with domain validation

### Development Tools
- **Replit Integration**: Development environment plugins and runtime error handling
- **Vite Plugins**: Cartographer for development visualization, runtime error modal

### UI Dependencies
- **Radix UI**: Comprehensive accessible component primitives
- **Lucide Icons**: SVG icon library for consistent iconography
- **Font Loading**: Google Fonts integration (Inter, JetBrains Mono)

### Form and Validation
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performance-optimized form management
- **Hookform Resolvers**: Zod integration for form validation

### Data Fetching
- **TanStack Query**: Server state management with caching and background updates
- **Native Fetch**: HTTP client with credential support for API requests

### Build and Development
- **TypeScript**: Full type safety across client and server
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **ESBuild**: Fast bundling for server-side code
- **Path Aliases**: Simplified imports with @ and @shared prefixes