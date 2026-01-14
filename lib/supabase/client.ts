import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Database types
export interface Database {
    public: {
        Tables: {
            groups: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    invite_code: string;
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                    last_modified_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    invite_code: string;
                    created_by: string;
                    created_at?: string;
                    updated_at?: string;
                    last_modified_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    invite_code?: string;
                    created_by?: string;
                    created_at?: string;
                    updated_at?: string;
                    last_modified_at?: string;
                };
            };
            group_members: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    name: string;
                    role: 'admin' | 'member';
                    joined_at: string;
                    last_modified_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    user_id: string;
                    name: string;
                    role?: 'admin' | 'member';
                    joined_at?: string;
                    last_modified_at?: string;
                };
                Update: {
                    id?: string;
                    group_id?: string;
                    user_id?: string;
                    name?: string;
                    role?: 'admin' | 'member';
                    joined_at?: string;
                    last_modified_at?: string;
                };
            };
            expenses: {
                Row: {
                    id: string;
                    title: string;
                    amount: number;
                    currency: string;
                    category: string | null;
                    paid_by: string;
                    date: string;
                    group_id: string;
                    split_type: 'equal' | 'custom';
                    created_by: string;
                    created_at: string;
                    last_modified_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    amount: number;
                    currency?: string;
                    category?: string | null;
                    paid_by: string;
                    date?: string;
                    group_id: string;
                    split_type?: 'equal' | 'custom';
                    created_by: string;
                    created_at?: string;
                    last_modified_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    amount?: number;
                    currency?: string;
                    category?: string | null;
                    paid_by?: string;
                    date?: string;
                    group_id?: string;
                    split_type?: 'equal' | 'custom';
                    created_by?: string;
                    created_at?: string;
                    last_modified_at?: string;
                };
            };
            expense_splits: {
                Row: {
                    id: string;
                    expense_id: string;
                    user_id: string;
                    user_name: string;
                    amount: number;
                    is_paid: boolean;
                    last_modified_at: string;
                };
                Insert: {
                    id?: string;
                    expense_id: string;
                    user_id: string;
                    user_name: string;
                    amount: number;
                    is_paid?: boolean;
                    last_modified_at?: string;
                };
                Update: {
                    id?: string;
                    expense_id?: string;
                    user_id?: string;
                    user_name?: string;
                    amount?: number;
                    is_paid?: boolean;
                    last_modified_at?: string;
                };
            };
            settlements: {
                Row: {
                    id: string;
                    group_id: string;
                    from_user: string;
                    to_user: string;
                    amount: number;
                    is_paid: boolean;
                    paid_at: string | null;
                    created_at: string;
                    last_modified_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    from_user: string;
                    to_user: string;
                    amount: number;
                    is_paid?: boolean;
                    paid_at?: string | null;
                    created_at?: string;
                    last_modified_at?: string;
                };
                Update: {
                    id?: string;
                    group_id?: string;
                    from_user?: string;
                    to_user?: string;
                    amount?: number;
                    is_paid?: boolean;
                    paid_at?: string | null;
                    created_at?: string;
                    last_modified_at?: string;
                };
            };
            sync_queue: {
                Row: {
                    id: string;
                    user_id: string;
                    table_name: string;
                    operation: 'insert' | 'update' | 'delete';
                    record_id: string;
                    data: any;
                    created_at: string;
                    synced_at: string | null;
                    error: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    table_name: string;
                    operation: 'insert' | 'update' | 'delete';
                    record_id: string;
                    data: any;
                    created_at?: string;
                    synced_at?: string | null;
                    error?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    table_name?: string;
                    operation?: 'insert' | 'update' | 'delete';
                    record_id?: string;
                    data?: any;
                    created_at?: string;
                    synced_at?: string | null;
                    error?: string | null;
                };
            };
        };
    };
}
