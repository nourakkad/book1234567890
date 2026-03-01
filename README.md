# Books Showroom

Next.js app with MongoDB-backed editable content and admin dashboard.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deploy to Netlify

This project is configured for Netlify using `@netlify/plugin-nextjs` and `netlify.toml`.

### 1) Push project to GitHub

Commit and push your project to a GitHub repository.

### 2) Create a site on Netlify

- Netlify dashboard -> **Add new site** -> **Import from Git**
- Choose your repository
- Build command: `pnpm build`
- Publish directory: leave empty (Netlify Next.js plugin handles it)

### 3) Add environment variables in Netlify

Site settings -> **Environment variables**, then add:

- `MONGODB_URI`
- `MONGODB_DB`
- `ADMIN_DASHBOARD_PASSWORD`

Use the values from your local `.env` (same keys as `.env.example`).

### 4) Deploy

Trigger deploy from Netlify UI (or push to your connected branch).

## Important Note About Uploads

Your admin upload API currently writes files to `public/uploads` on local disk.

On Netlify, function filesystem writes are not persistent across deploys/restarts, so uploaded images/PDFs can be lost.  
For production uploads, use external object storage (Cloudinary, S3, Supabase Storage, etc.) and store returned URLs in MongoDB.
