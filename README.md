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
- ✅ Expense tracking and splitting
- ✅ Smart settlement calculations
- ✅ PWA support

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
