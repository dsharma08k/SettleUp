-- SettleUp Database Schema
-- Run this SQL in your Supabase SQL Editor
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_at TIMESTAMPTZ DEFAULT NOW()
);
-- Group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    amount BIGINT NOT NULL,
    -- stored in paise/cents
    currency TEXT NOT NULL DEFAULT 'INR',
    category TEXT,
    paid_by UUID NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    split_type TEXT NOT NULL DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom')),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_at TIMESTAMPTZ DEFAULT NOW()
);
-- Expense splits table
CREATE TABLE expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    amount BIGINT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    last_modified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(expense_id, user_id)
);
-- Settlements table
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    from_user UUID NOT NULL,
    to_user UUID NOT NULL,
    amount BIGINT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_at TIMESTAMPTZ DEFAULT NOW()
);
-- Sync queue table (for offline operations)
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
    record_id UUID NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ,
    error TEXT
);
-- Indexes for better performance
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_invite_code ON groups(invite_code);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_last_modified ON expenses(last_modified_at);
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_settlements_group_id ON settlements(group_id);
CREATE INDEX idx_sync_queue_user_id ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_synced_at ON sync_queue(synced_at);
-- Update last_modified_at trigger function
CREATE OR REPLACE FUNCTION update_last_modified_at() RETURNS TRIGGER AS $$ BEGIN NEW.last_modified_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Add triggers to auto-update last_modified_at
CREATE TRIGGER update_groups_last_modified BEFORE
UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_last_modified_at();
CREATE TRIGGER update_group_members_last_modified BEFORE
UPDATE ON group_members FOR EACH ROW EXECUTE FUNCTION update_last_modified_at();
CREATE TRIGGER update_expenses_last_modified BEFORE
UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_last_modified_at();
CREATE TRIGGER update_expense_splits_last_modified BEFORE
UPDATE ON expense_splits FOR EACH ROW EXECUTE FUNCTION update_last_modified_at();
CREATE TRIGGER update_settlements_last_modified BEFORE
UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_last_modified_at();
-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
-- Groups policies
CREATE POLICY "Users can view groups they are members of" ON groups FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = groups.id
        )
    );
CREATE POLICY "Users can create groups" ON groups FOR
INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON groups FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = groups.id
                AND role = 'admin'
        )
    );
CREATE POLICY "Group admins can delete groups" ON groups FOR DELETE USING (
    auth.uid() IN (
        SELECT user_id
        FROM group_members
        WHERE group_id = groups.id
            AND role = 'admin'
    )
);
-- Group members policies
CREATE POLICY "Users can view members of their groups" ON group_members FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members gm2
            WHERE gm2.group_id = group_members.group_id
        )
    );
CREATE POLICY "Users can add themselves to groups" ON group_members FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Group admins can update members" ON group_members FOR
UPDATE USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members gm2
            WHERE gm2.group_id = group_members.group_id
                AND gm2.role = 'admin'
        )
    );
CREATE POLICY "Users can remove themselves from groups" ON group_members FOR DELETE USING (auth.uid() = user_id);
-- Expenses policies
CREATE POLICY "Users can view expenses in their groups" ON expenses FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = expenses.group_id
        )
    );
CREATE POLICY "Group members can create expenses" ON expenses FOR
INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = expenses.group_id
        )
    );
CREATE POLICY "Users can update their own expenses" ON expenses FOR
UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own expenses" ON expenses FOR DELETE USING (auth.uid() = created_by);
-- Expense splits policies
CREATE POLICY "Users can view splits for expenses in their groups" ON expense_splits FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM expenses e
                INNER JOIN group_members gm ON gm.group_id = e.group_id
            WHERE e.id = expense_splits.expense_id
                AND gm.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can create expense splits" ON expense_splits FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM expenses e
                INNER JOIN group_members gm ON gm.group_id = e.group_id
            WHERE e.id = expense_splits.expense_id
                AND gm.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update expense splits" ON expense_splits FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM expenses e
            WHERE e.id = expense_splits.expense_id
                AND e.created_by = auth.uid()
        )
    );
-- Settlements policies
CREATE POLICY "Users can view settlements in their groups" ON settlements FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = settlements.group_id
        )
    );
CREATE POLICY "Group members can create settlements" ON settlements FOR
INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id
            FROM group_members
            WHERE group_id = settlements.group_id
        )
    );
CREATE POLICY "Users involved can update settlements" ON settlements FOR
UPDATE USING (
        auth.uid() = from_user
        OR auth.uid() = to_user
    );
-- Sync queue policies
CREATE POLICY "Users can manage their own sync queue" ON sync_queue FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime
ADD TABLE groups;
ALTER PUBLICATION supabase_realtime
ADD TABLE group_members;
ALTER PUBLICATION supabase_realtime
ADD TABLE expenses;
ALTER PUBLICATION supabase_realtime
ADD TABLE expense_splits;
ALTER PUBLICATION supabase_realtime
ADD TABLE settlements;