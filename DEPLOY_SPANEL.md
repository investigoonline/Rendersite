# SPanel Deployment Guide — InvestigooOnline

## Overview

InvestigooOnline is a Node.js (Express) + React application with a PostgreSQL database.
The compiled app lives entirely in the `dist/` folder — the frontend is pre-built static files
served by the Express backend.

**Requirements:**
- Node.js 20 or higher
- PostgreSQL 14 or higher
- PM2 (process manager)
- SPanel Reverse Proxy or Node.js App feature

---

## Step 1 — Create a PostgreSQL Database in SPanel

1. Log into SPanel → **PostgreSQL Databases**
2. Create a new database (e.g. `investigoo_db`)
3. Create a database user (e.g. `investigoo_user`) and set a strong password
4. Assign the user to the database with **All Privileges**
5. Note down all four values — you'll need them shortly:

| Value | Example |
|-------|---------|
| Host | `localhost` or `127.0.0.1` |
| Port | `5432` |
| Database name | `investigoo_db` |
| Username | `investigoo_user` |
| Password | `your_db_password` |

---

## Step 2 — Upload the Project Files

Upload the following files/folders to your server (e.g. `/home/yourusername/investigoo/`):

```
dist/              ← compiled frontend + backend (required)
package.json       ← dependency manifest (required)
package-lock.json  ← lockfile (required)
drizzle.config.ts  ← database schema tool config (required for Step 5)
shared/            ← shared schema files (required for Step 5)
ecosystem.config.js ← PM2 config you create in Step 4 (required)
```

Use SPanel's **File Manager**, **FTP**, or `scp` via SSH.

---

## Step 3 — Install Node.js Dependencies

SSH into your server and run:

```bash
cd /home/yourusername/investigoo
npm install --omit=dev
```

Also install the schema push tool globally (needed only once):

```bash
npm install -g drizzle-kit
```

---

## Step 4 — Create the PM2 Ecosystem Config

This file sets all environment variables and tells PM2 how to start the app.

Create a file called `ecosystem.config.js` in your project folder:

```bash
nano /home/yourusername/investigoo/ecosystem.config.js
```

Paste the following and fill in your real values:

```js
module.exports = {
  apps: [
    {
      name: "investigoo",
      script: "dist/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "5000",

        // PostgreSQL — replace with your real credentials
        DATABASE_URL: "postgresql://investigoo_user:your_db_password@localhost:5432/investigoo_db",

        // Session secret — use any long random string (32+ characters)
        SESSION_SECRET: "replace-this-with-a-long-random-secret-string",

        // Object storage — only needed if using hero image uploads
        DEFAULT_OBJECT_STORAGE_BUCKET_ID: "your-bucket-id",
        PRIVATE_OBJECT_DIR: ".private",
        PUBLIC_OBJECT_SEARCH_PATHS: "public",
      },
    },
  ],
};
```

> **Tip:** Generate a secure session secret with:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## Step 5 — Push the Database Schema

This creates all required tables in your PostgreSQL database.

```bash
cd /home/yourusername/investigoo
DATABASE_URL="postgresql://investigoo_user:your_db_password@localhost:5432/investigoo_db" npx drizzle-kit push
```

The sessions table is created automatically when the app first starts.

---

## Step 6 — Install PM2

```bash
npm install -g pm2
```

---

## Step 7 — Start the App

```bash
cd /home/yourusername/investigoo
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Run the `pm2 startup` command it outputs (it will look like `sudo env PATH=... pm2 startup ...`).
This makes PM2 automatically restart your app after a server reboot.

Verify the app is running:

```bash
pm2 status
pm2 logs investigoo --lines 50
```

The app is now running on **port 5000**.

---

## Step 8 — Set Up the Reverse Proxy in SPanel

Point your domain to the running Node.js app:

1. In SPanel go to **Nginx Configuration** or **Proxy Settings**
2. Add a new proxy rule:
   - **Domain:** `yourdomain.com`
   - **Proxy target:** `http://127.0.0.1:5000`
3. Enable SSL/HTTPS via SPanel's **SSL Manager** (Let's Encrypt is free)

---

## Step 9 — Verify It's Working

Open your browser and visit `https://yourdomain.com`.

Check the health endpoint:
```bash
curl https://yourdomain.com/api/health
# Should return: {"status":"ok"}
```

---

## Useful PM2 Commands

```bash
pm2 status                    # see all running apps
pm2 logs investigoo           # live log stream
pm2 logs investigoo --lines 100  # last 100 log lines
pm2 restart investigoo        # restart after config changes
pm2 stop investigoo           # stop the app
pm2 reload investigoo         # zero-downtime reload
```

---

## Updating the App

When you deploy new code:

```bash
cd /home/yourusername/investigoo
# Upload new dist/ folder via FTP/scp first, then:
npm install --omit=dev
pm2 reload investigoo
```

---

## Important Notes

### Authentication
The app uses email + password authentication with bcrypt. No external OAuth provider
is required. Users register and log in directly through the app.

### Object Storage (Hero Image Uploads)
The CMS hero image upload feature uses a cloud storage sidecar service. This service
is not available on standard SPanel hosting. Hero images uploaded through the CMS
will not persist unless you configure an alternative storage solution.

For a simple local file alternative, the `uploads/` folder is already served
statically by the app — contact your developer to redirect image uploads there.

### Sessions
Sessions are stored in the PostgreSQL `sessions` table and automatically created
on first startup. Sessions last 7 days.

### HTTPS / SSL
Always run in production behind HTTPS. The app sets secure cookies in
`NODE_ENV=production`, so HTTPS is required for login to work correctly.

---

## Troubleshooting

**App won't start:**
```bash
pm2 logs investigoo --lines 100
```
Most common cause: wrong `DATABASE_URL` in `ecosystem.config.js`.

**Login doesn't work / session lost immediately:**
- Confirm HTTPS is active (secure cookies require it)
- Check `SESSION_SECRET` is set in `ecosystem.config.js`

**Database errors on startup:**
- Re-run the schema push: `DATABASE_URL="..." npx drizzle-kit push`
- Confirm the PostgreSQL user has full privileges on the database

**White screen / page not loading:**
- Confirm `dist/public/` was uploaded correctly
- Check the reverse proxy is pointing to `http://127.0.0.1:5000`
- Run `curl http://127.0.0.1:5000` on the server to test direct access

**Port already in use:**
```bash
# Change PORT in ecosystem.config.js to another value, e.g. 5001
# Then update the reverse proxy target to match
```
