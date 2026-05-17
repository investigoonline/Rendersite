# Threat Model

## Project Overview

InvestigooOnline is a React + TypeScript frontend with an Express + TypeScript backend and PostgreSQL database. It serves public visitors plus authenticated users and admins for financial calculators, saved calculations, net worth history, CMS-managed content, profile management, role-based admin tooling, and site/system settings. In production, `NODE_ENV` is expected to be `production`; TLS is handled by the deployment platform; mockup sandbox surfaces are not in scope for production findings.

## Assets

- **User accounts and sessions** — email addresses, password hashes, session cookies, roles, and account status. Compromise enables impersonation or privilege abuse.
- **Financial planning data** — saved calculator inputs/results and net worth snapshots. This is sensitive personal financial information.
- **Administrative control plane** — super-admin bootstrap, role assignments, content management, site settings, inactive-user restore/delete flows, and audit/history views.
- **Messaging and contact data** — contact form submissions, contact email destination, and SMTP configuration used to deliver mail.
- **Uploaded media references** — profile image paths, CMS hero image metadata, and object-storage-backed assets.
- **Application secrets/configuration** — `SESSION_SECRET`, database credentials, and any SMTP credentials stored in site settings.

## Trust Boundaries

- **Browser to API** — all client input crossing into `server/index.ts` / `server/routes.ts` is untrusted and must be authenticated, authorized, and validated server-side.
- **API to PostgreSQL** — `server/storage.ts` has direct access to user, financial, content, audit, and settings tables. Broken access control at the route layer exposes the full backing data.
- **API to object storage** — file upload and image serving paths cross into object storage helpers under `server/investigo_integrations/object_storage/`.
- **Public vs authenticated vs admin** — public content routes and contact forms share a codebase with authenticated profile/calculation APIs and privileged admin/CMS APIs. Client-side route guards do not provide security.
- **App to email infrastructure** — SMTP settings are fetched from the database and used to send operational email.

## Scan Anchors

- **Production entry points:** `server/index.ts`, `server/routes.ts`, `server/storage.ts`
- **Highest-risk areas:** auth/session handling, admin bootstrap and role management, financial-data APIs, `site_settings`, contact/email configuration, object-storage-backed upload paths
- **Public surfaces:** `/api/contact`, `/api/content`, `/api/resources`, image metadata, and any route lacking explicit session/role checks
- **Authenticated/admin surfaces:** profile APIs, admin user-management routes, content mutation routes, site setting mutation routes
- **Usually dev-only / lower priority:** `client/src` permission/UI gating, `dist/`, `scripts/`, and attached assets unless server reachability proves otherwise

## Threat Categories

### Spoofing

The application uses cookie-backed sessions. Protected endpoints must require a valid server-side session and must not trust frontend state, local storage, or client route guards for identity. Administrative bootstrap flows must not allow an unauthenticated actor to create or assume privileged roles.

### Tampering

Financial records, user roles, page content, and site settings are all sensitive mutable state. The server must validate request bodies and enforce ownership or role checks before accepting writes. User-controlled file uploads and content updates must be constrained to intended object types and destinations.

### Information Disclosure

The project stores sensitive financial records, account metadata, contact submissions, audit/history records, and site settings that may include SMTP credentials. Public routes must not expose data belonging to other users, privileged operational data, or secrets. API responses and logs must avoid returning credentials, reset material, or internal-only configuration to untrusted callers.

### Denial of Service

Public contact, auth, and data-submission endpoints can be abused for spam or resource exhaustion if they lack throttling, body-size limits, or other abuse controls. File upload and image-processing paths must remain bounded in size and cost.

### Elevation of Privilege

Role-protected admin and CMS functionality must be enforced on the server for every request. Any route that lets a caller choose another user’s identifier, inspect role membership, bootstrap a privileged account, or update permissions is a candidate for broken access control or privilege escalation and should be treated as high risk.
