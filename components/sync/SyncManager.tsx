'use client';

import { useBackgroundSync } from '@/lib/sync/backgroundSync';

/**
 * Empty component that initializes the background sync engine
 * Must be placed inside AuthProvider
 */
export default function SyncManager() {
    useBackgroundSync();
    return null;
}
