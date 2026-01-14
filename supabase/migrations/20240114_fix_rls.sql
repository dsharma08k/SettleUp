-- Allow any authenticated user to select groups (needed for invite code lookup)
-- This is necessary so the joinGroup function can verify an invite code before the user is a member.
-- 1. Drop the restrictive policy (if it exists)
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;
-- 2. Create the inclusive policy
CREATE POLICY "Users can view groups they are members of OR use invite code" ON groups FOR
SELECT USING (
        -- User is a member
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = groups.id
        )
        OR -- OR user is authenticated (allowing them to find groups by invite code)
        auth.role() = 'authenticated'
    );