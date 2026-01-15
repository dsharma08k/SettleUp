import Dexie, { Table } from 'dexie';

// Database interfaces matching Supabase schema
export interface Group {
    id: string;
    name: string;
    description?: string;
    invite_code: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    last_modified_at: string;
}

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    name: string;
    role: 'admin' | 'member';
    joined_at: string;
    last_modified_at: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number; // in paise/cents
    currency: string;
    category?: string;
    paid_by: string;
    date: string;
    group_id: string;
    split_type: 'equal' | 'custom';
    created_by: string;
    created_at: string;
    last_modified_at: string;
}

export interface ExpenseSplit {
    id: string;
    expense_id: string;
    user_id: string;
    user_name: string;
    amount: number;
    is_paid: boolean;
    last_modified_at: string;
}

export interface Settlement {
    id: string;
    group_id: string;
    from_user: string;
    to_user: string;
    amount: number;
    is_paid: boolean;
    paid_at?: string;
    created_at: string;
    last_modified_at: string;
}

export interface SyncQueueItem {
    id: string;
    user_id: string;
    table_name: string;
    operation: 'insert' | 'update' | 'delete';
    record_id: string;
    data: any;
    created_at: string;
    synced_at?: string;
    error?: string;
}

// Dexie database class
export class SettleUpDatabase extends Dexie {
    groups!: Table<Group, string>;
    group_members!: Table<GroupMember, string>;
    expenses!: Table<Expense, string>;
    expense_splits!: Table<ExpenseSplit, string>;
    settlements!: Table<Settlement, string>;
    sync_queue!: Table<SyncQueueItem, string>;

    constructor() {
        super('SettleUpDB');

        this.version(2).stores({
            groups: 'id, created_by, invite_code, last_modified_at',
            group_members: 'id, group_id, user_id, [group_id+user_id], last_modified_at',
            expenses: 'id, group_id, created_by, date, last_modified_at',
            expense_splits: 'id, expense_id, user_id, last_modified_at',
            settlements: 'id, group_id, from_user, to_user, last_modified_at',
            sync_queue: 'id, user_id, table_name, synced_at, created_at',
        });
    }
}

// Create and export database instance
export const db = new SettleUpDatabase();

// Helper function to initialize database
export async function initDatabase() {
    try {
        await db.open();
        console.log('✅ IndexedDB initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize IndexedDB:', error);
        return false;
    }
}

// Helper to clear all data (useful for logout)
export async function clearAllData() {
    await Promise.all([
        db.groups.clear(),
        db.group_members.clear(),
        db.expenses.clear(),
        db.expense_splits.clear(),
        db.settlements.clear(),
        db.sync_queue.clear(),
    ]);
    console.log('🗑️ All local data cleared');
}
