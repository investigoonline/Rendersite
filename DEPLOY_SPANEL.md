# SPanel Deployment Guide — InvestigooOnline

## What's in This Package

- `dist/index.js` — compiled backend server
- `dist/public/` — compiled frontend (HTML, CSS, JS, images)
- `package.json` — dependency list
- `.env.example` — all environment variables you need to set

---

## Step 1: Create a PostgreSQL Database in SPanel

1. Log into SPanel
2. Go to **PostgreSQL Databases**
3. Create a new database, user, and password
4. Note down: hostname, database name, username, password, port (usually 5432)

Your `DATABASE_URL` will be:
```
postgresql://USERNAME:PASSWORD@HOSTNAME:5432/DATABASE_NAME
```

---

## Step 2: Upload Files to Your Server

Upload the entire project folder to your server via SPanel's File Manager or FTP.

Recommended location: `/home/yourusername/investigoo/`

Files you MUST upload:
```
dist/              (entire folder — frontend + backend)
package.json
package-lock.json  (if present)
.env               (you create this — see Step 3)
```

---

## Step 3: Create Your .env File

SSH into your server and create a `.env` file in your project folder:

```bash
cd /home/yourusername/investigoo
nano .env
```

Add these variables (fill in your actual values):

```env
NODE_ENV=production
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOSTNAME:5432/DATABASE_NAME
SESSION_SECRET=any-long-random-string-here-at-least-32-chars

# Authentication (OpenID Connect)
INVESTIGO_DOMAINS=yourdomain.com
ISSUER_URL=https://auth.yourdomain.com/oidc
INVESTIGO_APP_ID=your-app-id

# Object Storage (if using file uploads)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your-bucket-id
PRIVATE_OBJECT_DIR=.private
PUBLIC_OBJECT_SEARCH_PATHS=public
```

---

## Step 4: Install Dependencies

```bash
cd /home/yourusername/investigoo
npm install --omit=dev
```

---

## Step 5: Run Database Migrations

The app uses Drizzle ORM. Push the schema to your new database:

```bash
npm run db:push
```

---

## Step 6: Install PM2 (Process Manager)

PM2 keeps your app running in the background and restarts it if it crashes.

```bash
npm install -g pm2
```

---

## Step 7: Start the App with PM2

```bash
cd /home/yourusername/investigoo
pm2 start dist/index.js --name "investigoo" --interpreter node
pm2 save
pm2 startup
```

Your app will now run on **port 5000**.

---

## Step 8: Point Your Domain with SPanel Reverse Proxy

In SPanel, set up a **Reverse Proxy** to forward your domain to port 5000:

1. Go to **Nginx Proxy** or **Node.js App** in SPanel
2. Set proxy target: `http://127.0.0.1:5000`
3. Point your domain to this proxy

---

## Useful PM2 Commands

```bash
pm2 status              # check if app is running
pm2 logs investigoo     # view live logs
pm2 restart investigoo  # restart the app
pm2 stop investigoo     # stop the app
```

---

## Important Notes

- The app requires Node.js 18 or higher
- Do NOT use `npm run dev` in production — use PM2 with `dist/index.js`
- SSL/HTTPS is handled by SPanel's Nginx — no changes needed in the app
- File uploads use cloud object storage — configure `DEFAULT_OBJECT_STORAGE_BUCKET_ID` with your storage bucket

---

## Troubleshooting

**App won't start:**
- Check `pm2 logs investigoo` for error messages
- Make sure `.env` file exists and `DATABASE_URL` is correct

**Database errors:**
- Confirm PostgreSQL is running and credentials are correct
- Run `npm run db:push` again

**Page not found / white screen:**
- Confirm the reverse proxy is pointing to port 5000
- Check that `dist/public/` was uploaded correctly
