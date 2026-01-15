# SettleUp

Modern offline-first expense tracking and settlement application.

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with vintage aesthetic
- **Dexie.js** for IndexedDB (local-first storage)
- **Supabase** for cloud sync and authentication
- **Zustand** for state management

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features (In Development)

- ✅ Offline-first architecture with IndexedDB
- ✅ Cloud sync with Supabase
- ✅ Real-time updates across devices
- ✅ Expense tracking and splitting (Equal/Custom)
- ✅ Smart settlement calculations
- ✅ Group Invite Codes
- ✅ Profile Picture Upload (Storage)
- ✅ Dark Mode UI
- ✅ PWA support (Installable)

## Environment Variables

Create a `.env.local` file:

## Troubleshooting

### "Bucket not found" Error
If you see this error, you need to create the storage bucket manually in Supabase Dashboard:
1. Go to **Storage** > **New Bucket** > Name it `avatars` > Make it **Public**.
2. Or run the SQL provided in `supabase/migrations/20240115_add_avatar_storage.sql`.

### "Redirecting to localhost after email confirmation"
This happens because your Supabase Project's **Site URL** is still set to localhost.

**Solution:**
1.  Go to **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2.  Set **Site URL** to your production URL (e.g., `https://your-project.vercel.app`).
3.  Add your production URL to **Redirect URLs**.
4.  For magic links to work properly, ensure you are redirecting to a valid page.

### "App pauses / Keeps logging out"
If you are on the **Supabase Free Tier**, the database pauses after inactivity, which causes login sessions to fail.
**Solution:** Use a free uptime monitor (like [Cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com)) to ping your API URL `https://your-project.supabase.co/rest/v1/` or your site every 10-15 minutes to keep it awake.
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
