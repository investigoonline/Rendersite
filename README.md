# InvestigooOnline

Financial planning platform by IFS Group — comprehensive calculators, resources, and planning tools for authenticated and guest users.

---

## Tech Stack

- **Frontend:** React + TypeScript, Tailwind CSS, shadcn/ui, Wouter, TanStack Query
- **Backend:** Express.js + TypeScript, Drizzle ORM
- **Database:** PostgreSQL
- **Build:** Vite (frontend) + esbuild (backend)

---

## Railway Deployment

### Prerequisites
- [Railway account](https://railway.app)
- GitHub account (repository connected to Railway)

### Steps

**1. Create a Railway project**
- New Project → Deploy from GitHub repo → select this repository

**2. Add PostgreSQL**
- Inside the project → **+ New** → **Database** → **Add PostgreSQL**
- Railway automatically sets `DATABASE_URL` in your environment

**3. Set environment variables**

In Railway → **Variables**, add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | *(generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)* |

`DATABASE_URL` and `PORT` are set automatically by Railway — do not add them manually.

**4. Push the database schema**

Copy the PostgreSQL connection string from Railway → run once locally:

```bash
DATABASE_URL="your-railway-db-url" npx drizzle-kit push
```

**5. Deploy**

Railway builds and deploys automatically on every push to `main`.

Health check endpoint: `GET /api/health` → `{"status":"ok"}`

---

## Custom Domain

Railway → **Settings** → **Domains** → **Add Custom Domain**

Add the CNAME record Railway provides to your DNS registrar. SSL is issued automatically.

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL and SESSION_SECRET in .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

App runs at `http://localhost:5000`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:push` | Push schema to database |
| `npm run check` | TypeScript type check |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Long random string for session encryption |
| `NODE_ENV` | Yes | Set to `production` in production |
| `PORT` | No | Port to listen on (default: 5000) |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | No | Cloud storage bucket for image uploads |
