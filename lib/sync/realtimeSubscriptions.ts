import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../supabase/client';
import { db } from '../db';
import toast from 'react-hot-toast';
import { useSyncStore } from '@/stores/syncStore';

/**
 * Real-time subscriptions hook
 * Listens for changes from Supabase and updates IndexedDB
 */
export function useRealtimeSubscriptions() {
    const { user } = useAuth();
    const { isOnline } = useSyncStore();

    useEffect(() => {
        if (!user || !isOnline) return;

        // Subscribe to all tables that the user has access to
        const subscriptions: any[] = [];

        // Groups subscription
        const groupsSub = supabase
            .channel('groups_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'groups',
                },
                async (payload) => {
                    // Skip if this change originated from current user
                    if ((payload.new as any)?.created_by === user.id) return;

                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const existing = await db.groups.get(payload.new.id);
                        // Only update if remote is newer or doesn't exist
                        if (!existing || new Date(payload.new.last_modified_at) > new Date(existing.last_modified_at)) {
                            await db.groups.put(payload.new);
                            toast(`📥 Group "${payload.new.name}" updated`, { icon: '🔄' });
                        }
                    } else if (payload.eventType === 'DELETE') {
                        await db.groups.delete(payload.old.id);
                        toast(`Group "${payload.old.name}" was deleted`, { icon: '🗑️' });
                    }
                }
            )
            .subscribe();

        subscriptions.push(groupsSub);

        // Group Members subscription
        const membersSub = supabase
            .channel('group_members_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'group_members',
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const existing = await db.group_members.get(payload.new.id);
                        if (!existing || new Date(payload.new.last_modified_at) > new Date(existing.last_modified_at)) {
                            await db.group_members.put(payload.new);

                            // Only show toast if this affects current user's groups
                            const isMember = await db.group_members
                                .where(['group_id', 'user_id'])
                                .equals([payload.new.group_id, user.id])
                                .first();

                            if (isMember && payload.new.user_id !== user.id) {
                                toast(`📥 ${payload.new.name} joined a group`, { icon: '👤' });
                            }
                        }
                    } else if (payload.eventType === 'DELETE') {
                        await db.group_members.delete(payload.old.id);
                    }
                }
            )
            .subscribe();

        subscriptions.push(membersSub);

        // Expenses subscription
        const expensesSub = supabase
            .channel('expenses_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'expenses',
                },
                async (payload) => {
                    if (payload.new?.created_by === user.id) return; // Skip own changes

                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const existing = await db.expenses.get(payload.new.id);
                        if (!existing || new Date(payload.new.last_modified_at) > new Date(existing.last_modified_at)) {
                            await db.expenses.put(payload.new);

                            if (payload.eventType === 'INSERT') {
                                toast(`📥 New expense: ${payload.new.title}`, { icon: '💰', duration: 4000 });
                            }
                        }
                    } else if (payload.eventType === 'DELETE') {
                        await db.expenses.delete(payload.old.id);
                    }
                }
            )
            .subscribe();

        subscriptions.push(expensesSub);

        // Expense Splits subscription
        const splitsSub = supabase
            .channel('expense_splits_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'expense_splits',
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const existing = await db.expense_splits.get(payload.new.id);
                        if (!existing || new Date(payload.new.last_modified_at) > new Date(existing.last_modified_at)) {
                            await db.expense_splits.put(payload.new);
                        }
                    } else if (payload.eventType === 'DELETE') {
                        await db.expense_splits.delete(payload.old.id);
                    }
                }
            )
            .subscribe();

        subscriptions.push(splitsSub);

        console.log('✅ Real-time subscriptions active');

        // Cleanup
        return () => {
            console.log('🔌 Disconnecting real-time subscriptions');
            subscriptions.forEach((sub) => {
                supabase.removeChannel(sub);
            });
        };
    }, [user, isOnline]);
}
