import { db } from '../db';
import { supabase } from '../supabase/client';
import { useSyncStore } from '@/stores/syncStore';
import toast from 'react-hot-toast';

interface SyncQueueItem {
    id: string;
    user_id: string;
    table_name: string;
    operation: 'insert' | 'update' | 'delete';
    record_id: string;
    data: any;
    created_at: string;
}

/**
 * Push local changes from sync_queue to Supabase
 */
export async function pushToSupabase(userId: string): Promise<{ success: boolean; synced: number; errors: number }> {
    let syncedCount = 0;
    let errorCount = 0;

    try {
        // Get all pending changes for this user
        const queueItems = await db.sync_queue
            .where('user_id')
            .equals(userId)
            .sortBy('created_at');

        if (queueItems.length === 0) {
            return { success: true, synced: 0, errors: 0 };
        }

        // Process each queue item
        for (const item of queueItems) {
            try {
                const tableName = item.table_name;
                let success = false;

                switch (item.operation) {
                    case 'insert':
                    case 'update':
                        // Upsert (insert or update)
                        const { error: upsertError } = await supabase
                            .from(tableName)
                            .upsert(item.data, { onConflict: 'id' });

                        if (!upsertError) {
                            success = true;
                        } else {
                            console.error(`Error upserting to ${tableName}:`, JSON.stringify(upsertError, null, 2));
                            errorCount++;
                        }
                        break;

                    case 'delete':
                        const { error: deleteError } = await supabase
                            .from(tableName)
                            .delete()
                            .eq('id', item.record_id);

                        if (!deleteError) {
                            success = true;
                        } else {
                            console.error(`Error deleting from ${tableName}:`, deleteError);
                            errorCount++;
                        }
                        break;
                }

                // Remove from queue if successful
                if (success) {
                    await db.sync_queue.delete(item.id);
                    syncedCount++;
                }
            } catch (error) {
                console.error('Error processing queue item:', error);
                errorCount++;
            }
        }

        return { success: errorCount === 0, synced: syncedCount, errors: errorCount };
    } catch (error) {
        console.error('Error in pushToSupabase:', error);
        return { success: false, synced: syncedCount, errors: errorCount + 1 };
    }
}

/**
 * Pull remote changes from Supabase to IndexedDB
 * Uses last-write-wins conflict resolution
 */
export async function pullFromSupabase(userId: string): Promise<{ success: boolean; pulled: number }> {
    let pulledCount = 0;

    try {
        // Get user's groups
        const { data: groupMembers } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', userId);

        if (!groupMembers || groupMembers.length === 0) {
            return { success: true, pulled: 0 };
        }

        const groupIds = groupMembers.map((gm) => gm.group_id);

        // Pull groups
        const { data: groups, error: groupsError } = await supabase
            .from('groups')
            .select('*')
            .in('id', groupIds);

        if (!groupsError && groups) {
            for (const group of groups) {
                const existing = await db.groups.get(group.id);
                // Last-write-wins: only update if remote is newer or doesn't exist
                // Use getTime() for accurate comparison
                const remoteTime = new Date(group.last_modified_at).getTime();
                const localTime = existing ? new Date(existing.last_modified_at).getTime() : 0;

                if (!existing || remoteTime > localTime) {
                    await db.groups.put(group);
                    pulledCount++;
                }
            }
        }

        // Pull group members
        const { data: members, error: membersError } = await supabase
            .from('group_members')
            .select('*')
            .in('group_id', groupIds);

        if (!membersError && members) {
            for (const member of members) {
                const existing = await db.group_members.get(member.id);
                const remoteTime = new Date(member.last_modified_at).getTime();
                const localTime = existing ? new Date(existing.last_modified_at).getTime() : 0;

                if (!existing || remoteTime > localTime) {
                    await db.group_members.put(member as any); // Cast to any to avoid type complaints with Dexie interfaces
                    pulledCount++;
                }
            }
        }

        // Pull expenses
        const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .in('group_id', groupIds);

        if (!expensesError && expenses) {
            for (const expense of expenses) {
                const existing = await db.expenses.get(expense.id);
                const remoteTime = new Date(expense.last_modified_at).getTime();
                const localTime = existing ? new Date(existing.last_modified_at).getTime() : 0;

                if (!existing || remoteTime > localTime) {
                    await db.expenses.put(expense);
                    pulledCount++;
                }
            }
        }

        // Pull expense splits
        if (expenses && expenses.length > 0) {
            const expenseIds = expenses.map((e) => e.id);
            const { data: splits, error: splitsError } = await supabase
                .from('expense_splits')
                .select('*')
                .in('expense_id', expenseIds);

            if (!splitsError && splits) {
                for (const split of splits) {
                    const existing = await db.expense_splits.get(split.id);
                    const remoteTime = new Date(split.last_modified_at).getTime();
                    const localTime = existing ? new Date(existing.last_modified_at).getTime() : 0;

                    if (!existing || remoteTime > localTime) {
                        await db.expense_splits.put(split);
                        pulledCount++;
                    }
                }
            }
        }

        return { success: true, pulled: pulledCount };
    } catch (error) {
        console.error('Error in pullFromSupabase:', error);
        return { success: false, pulled: pulledCount };
    }
}

/**
 * Full bidirectional sync
 */
export async function syncAll(userId: string): Promise<{ success: boolean; message: string }> {
    const syncState = useSyncStore.getState();

    // Don't sync if already syncing
    if (syncState.isSyncing) {
        return { success: false, message: 'Sync already in progress' };
    }

    // Don't sync if offline
    if (!syncState.isOnline) {
        return { success: false, message: 'Cannot sync while offline' };
    }

    try {
        syncState.setSyncing(true);

        // Push local changes first
        const pushResult = await pushToSupabase(userId);

        // Then pull remote changes
        const pullResult = await pullFromSupabase(userId);

        // Update sync store
        syncState.setLastSyncTime(new Date());
        const pendingCount = await db.sync_queue.where('user_id').equals(userId).count();
        syncState.setPendingChanges(pendingCount);

        syncState.setSyncing(false);

        // Show success toast
        const totalChanges = pushResult.synced + pullResult.pulled;
        if (totalChanges > 0) {
            toast.success(`✓ Synced ${totalChanges} change${totalChanges > 1 ? 's' : ''}`);
            return { success: true, message: `Synced ${totalChanges} changes` };
        } else if (pushResult.errors > 0) {
            toast.error(`⚠ Sync errors: ${pushResult.errors} failed`);
            return { success: false, message: `${pushResult.errors} errors` };
        } else {
            return { success: true, message: 'Already up to date' };
        }
    } catch (error: any) {
        syncState.setSyncing(false);
        console.error('Sync error:', error);
        toast.error('⚠ Sync failed - will retry');
        return { success: false, message: error.message || 'Sync failed' };
    }
}
