-- Add avatar_url to group_members table
ALTER TABLE group_members
ADD COLUMN avatar_url TEXT;
-- Update the sync engine to include this column
-- (No SQL change needed for sync engine as it selects *)
-- Optional: Create a trigger to update group_members avatar when user metadata changes
-- For now, we will handle this in the application logic (when profile is updated, update group_members)