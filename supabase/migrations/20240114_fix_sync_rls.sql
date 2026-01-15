-- Fix RLS policies for group_members to ensuring syncing works correctly
-- 1. Check if "Users can view own membership" exists, if not create it
-- This ensures that when a user adds themselves to a group, they can immediately see confirmed membership
DROP POLICY IF EXISTS "Users can view own membership" ON group_members;
CREATE POLICY "Users can view own membership" ON group_members FOR
SELECT USING (auth.uid() = user_id);
-- 2. Ensure users can update their own membership (e.g. changing name or accepting invite if we had that)
DROP POLICY IF EXISTS "Users can update own membership" ON group_members;
CREATE POLICY "Users can update own membership" ON group_members FOR
UPDATE USING (auth.uid() = user_id);
-- 3. Ensure INSERT works for self-add (already exists usually, but reinforcing)
DROP POLICY IF EXISTS "Users can add themselves to groups" ON group_members;
CREATE POLICY "Users can add themselves to groups" ON group_members FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- 4. Fix "Users can view groups they are members of" to be more robust
-- (The previous fix for invite code might have covered this, but let's be safe)