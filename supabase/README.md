# Supabase Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://vmzcmippsxbswjpdszxx.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run the Schema SQL

1. Open the `supabase/schema.sql` file in this project
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

This will create:
- ✅ All database tables (groups, group_members, expenses, expense_splits, settlements, sync_queue)
- ✅ Indexes for performance
- ✅ Auto-update triggers for `last_modified_at`
- ✅ Row Level Security (RLS) policies
- ✅ Realtime subscriptions enabled

## Step 3: Verify Tables

After running the SQL, verify in the **Table Editor**:
- `groups`
- `group_members`
- `expenses`
- `expense_splits`
- `settlements`
- `sync_queue`

## Step 4: Enable Realtime (if needed)

If Realtime isn't automatically enabled:
1. Go to **Database** → **Replication**
2. Enable replication for all tables

## What's Next?

Once the schema is set up, we'll continue with:
- Phase 3: UI Implementation (auth, dashboard, groups, expenses)
- Phase 4: Local-first architecture (sync logic, offline support)
- Phase 5: PWA & Deployment

---

**Note:** The database is now configured with Row Level Security, so users can only access data from groups they're members of. This ensures data privacy and security.
