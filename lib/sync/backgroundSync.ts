import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { syncAll } from './syncEngine';
import { useSyncStore } from '@/stores/syncStore';

/**
 * Background sync hook
 * Handles periodic sync, sync on focus, and sync on reconnect
 */
export function useBackgroundSync() {
    const { user } = useAuth();
    const { isOnline, isSyncing } = useSyncStore();
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const retryCountRef = useRef(0);
    const maxRetries = 5;

    // Calculate backoff delay: 1s, 2s, 4s, 8s, 16s, max 60s
    const getBackoffDelay = (retryCount: number) => {
        return Math.min(Math.pow(2, retryCount) * 1000, 60000);
    };

    // Perform sync with retry logic
    const performSync = async () => {
        if (!user || !isOnline || isSyncing) return;

        const result = await syncAll(user.id);

        if (result.success) {
            retryCountRef.current = 0; // Reset on success
        } else {
            retryCountRef.current++;
            if (retryCountRef.current < maxRetries) {
                const delay = getBackoffDelay(retryCountRef.current);
                console.log(`Sync failed. Retrying in ${delay / 1000}s...`);
                setTimeout(performSync, delay);
            } else {
                console.error('Max retries reached. Giving up.');
                retryCountRef.current = 0; // Reset for next interval
            }
        }
    };

    useEffect(() => {
        if (!user) return;

        // Sync immediately on mount if online
        if (isOnline) {
            performSync();
        }

        // Set up periodic sync every 30 seconds
        if (isOnline) {
            syncIntervalRef.current = setInterval(() => {
                performSync();
            }, 30000); // 30 seconds
        } else {
            // Clear interval when offline
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
                syncIntervalRef.current = null;
            }
        }

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [user, isOnline]);

    // Sync on window focus
    useEffect(() => {
        const handleFocus = () => {
            if (user && isOnline && !isSyncing) {
                performSync();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user, isOnline, isSyncing]);

    // Sync when coming back online
    useEffect(() => {
        if (isOnline && user && !isSyncing) {
            performSync();
        }
    }, [isOnline]);
}
