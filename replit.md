# Overview

InvestigooOnline is a financial planning platform built by IFS Group that provides comprehensive financial calculators, resources, and planning tools. The application serves both authenticated users and guest users, offering features like net worth tracking, loan calculations, mortgage planning, retirement planning, and educational resources. The platform emphasizes professional financial guidance with 40+ years of IFS Group expertise.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Rich Text Editor Integration (October 2025)
- **Feature**: Integrated TipTap WYSIWYG rich text editor for all description fields in CMS
- **Capabilities**: Full Word-style formatting including bold, italic, underline, headings, bullet/numbered lists, blockquotes, text alignment, text colors, highlighting, strikethrough
- **Font Support**: Added font family picker with 10 popular fonts (Arial, Times New Roman, Georgia, Verdana, etc.)
- **Hyperlinks**: Enhanced link functionality supporting both external URLs (https://...) and internal page paths (/services, /blog, etc.)
- **Component**: Created RichTextEditor component with comprehensive toolbar for content formatting
- **Rendering**: Created HTMLContent component for backward-compatible rendering of both plain text (legacy) and HTML (rich text) content
- **CMS Integration**: Updated all 27 description fields across contentSchemas to use 'richtext' control instead of 'textarea'
- **Storage**: Content stored as HTML in existing text fields - no database schema changes needed
- **Pages Updated**: Services, About, Contact, Blog, Resources all import and can display rich text content
- **Impact**: Content managers can now create professionally formatted content with fonts, colors, links, and structured text

## Resources Page Blog Integration (October 2025)
- **Feature**: Resources - Articles tab now displays blog content (flipbooks) with category filtering
- **Functionality**: When "article" type is selected, page fetches flipbook resources instead of generic articles
- **Category Filtering**: Added dynamic category filter buttons from blog categories (Estates & Trusts, etc.)
- **Consistency**: Uses same ResourceCard component as Blog page for identical format and style
- **User Experience**: Category selection persists per tab, automatically clears when switching resource types
- **Integration**: Fetches blog categories from CMS (blog_categories section) for dynamic category list
- **Impact**: Blog content is now accessible from both dedicated Blog page and Resources section with consistent styling

## Blog Page Implementation (October 2025)
- **Feature**: Created dedicated Blog page redesigning flipbook articles section as a standalone blog
- **Route**: Added `/blog` route accessible to all users
- **Database**: Added blog sections to `content_section` enum (blog_header, blog_featured, blog_categories, blog_cta)
- **Content Schemas**: Created 4 CMS-driven blog content schemas in contentSchemas.ts
- **Page Sections**: Header with badge/title/description, Featured posts, Categories filter, Call-to-action
- **Functionality**: Displays flipbook resources, category filtering, search, featured posts highlighting
- **CMS Integration**: Fully editable from Content Management interface - no hardcoded content
- **Impact**: Blog content completely manageable by Content Managers without code changes

## Description Field Formatting Preservation (October 2025)
- **Issue**: Content managers unable to save longer descriptions and formatting (line breaks, paragraphs) was not preserved when pasting content
- **Solution**: 
  - Removed all character limits from description fields across all content schemas
  - Added `whitespace-pre-wrap` CSS class to all description display elements across all pages
- **Database**: Already using `text` type in PostgreSQL (unlimited storage)
- **Validation**: Removed `.max()` constraints from Zod schemas
- **Display**: Added `whitespace-pre-wrap` to preserve line breaks and formatting while allowing text wrapping
- **Pages Updated**: Services, Resources, Home (Landing), About, Contact
- **Impact**: Content managers can now add descriptions of any length with preserved formatting (line breaks, paragraphs)

## Dynamic Icon Support Fix (October 2025)
- **Issue**: "Unknown icon name: Globe" error when using icons not in hardcoded iconMap
- **Root Cause**: Services page had hardcoded list of only 6 icons (TrendingUp, Shield, PiggyBank, FileText, Users, Database)
- **Solution**: Updated Services.tsx to dynamically import all Lucide icons using `import * as LucideIcons` and dynamic lookup
- **Impact**: Services page now supports ALL Lucide React icons, not just the hardcoded 6

## Icon Picker Fix (October 2025)
- **Issue**: Icons were not updating when changed in content forms
- **Root Cause**: Icon fields were using generic 'select' control instead of specialized 'icon' control
- **Solution**: Changed all icon field controls from `control: 'select'` to `control: 'icon'` in contentSchemas
- **Impact**: Icon picker now displays visual icon previews and updates work correctly

## Content Section Title Display Fix (October 2025)
- **Issue**: Multiple instances of same section type (e.g., two "Services Strategic") showed identical titles, making them hard to distinguish
- **Root Cause**: Card titles displayed section type name instead of actual content title
- **Solution**: Updated ContentManagement to display content.title when available, falling back to section type name
- **Impact**: Each content section now shows its unique title (e.g., "Strategic Planning" vs "Strategic Investment")

## Add Section Feature Fix (October 2025)
- **Critical Fix**: Unable to add new service sections due to missing `allowMultiple` property
- **Issue**: All service sections showed "Already exists" preventing content managers from adding multiple services
- **Root Cause**: Service schemas didn't have `allowMultiple: true` flag, treating them as single-instance sections
- **Solution**: Added `allowMultiple: true` to all 6 service section types (investment, strategic, legacy, risk, special, aggregation)
- **Impact**: Content managers can now add multiple service items to services page

## Content Update 500 Error Fix (October 2025)
- **Critical Fix**: Database schema mismatch causing content updates to fail with 500 error
- **Issue**: `page_content_history` table had `old_content`/`new_content` columns instead of single `content` column
- **Root Cause**: Database table structure was out of sync with code schema
- **Solution**: Altered table to match schema - dropped old columns, added `content`, `published`, `created_at`, `change_type`
- **Impact**: Content updates now work reliably on first attempt

## Application Pages and Routes Update (October 2025)
- **Under Construction Page**: Created `/pages/UnderConstruction.tsx` for links not yet implemented
- **New Routes Added**: Profile, Guest Access, Client Login, Mobile App, API Docs, Help Center, Leadership, Careers, Press, Privacy Policy, Terms of Service
- **Link Audit**: Completed end-to-end testing of all navigation links across the application
- **Missing Pages Inventory**: Documented all existing vs missing pages for future development
- **Code Cleanup**: Removed external references from client-side code

## User Role Persistence Fix (October 2025)
- **Critical Fix**: Added `role` field to session data and login response
- **Issue**: When user roles were updated in database, changes weren't reflected after logout/login
- **Root Cause**: Login route only stored id, email, name, authType in session - role was missing
- **Solution**: Include `role: user.role` in both session storage and login response
- **Impact**: Role changes now persist correctly across login sessions

## Production Login Fix (October 2025)
- **Critical Fix**: Added explicit `session.save()` callback in login route to ensure session persists before response
- **Issue**: In production, sessions weren't saving to database before redirect, causing login failures
- **Solution**: Wrap response in `session.save()` callback to guarantee session persistence
- **Impact**: Login now works reliably in both development and production environments

## Roles Management System (October 2025)
- **Database Schema**: Created `role_permissions` table with resource-based access control
- **API Endpoints**: GET/POST `/api/admin/role-permissions` for reading and updating permissions
- **Matrix View**: Hierarchical permission matrix with expandable categories and role checkboxes
- **Database Integration**: Permissions persist across sessions, fully integrated with PostgreSQL
- **Resource Types**: Pages, calculators, calculator categories, and resource types

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
- **Primary Auth**: OpenID Connect integration for client authentication
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
- **OpenID Connect**: Secure authentication integration for user access
- **Environment**: Configured for production and development environments

### Development Tools
- **Development Environment**: Plugins and runtime error handling for enhanced developer experience
- **Vite Plugins**: Development visualization tools and runtime error modal

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