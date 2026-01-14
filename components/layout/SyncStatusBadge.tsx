'use client';

import { useSyncStore } from '@/stores/syncStore';
import { CheckCircle2, RefreshCw, WifiOff, Cloud } from 'lucide-react';

export default function SyncStatusBadge() {
    const { isOnline, isSyncing, lastSyncTime } = useSyncStore();

    if (!isOnline) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-light border border-border rounded-lg">
                <WifiOff className="w-4 h-4 text-text-dim" />
                <span className="text-sm text-text-dim">Offline</span>
            </div>
        );
    }

    if (isSyncing) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-primary">Syncing...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Cloud className="w-4 h-4 text-green-400" />
            <div className="flex flex-col">
                <span className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Synced
                </span>
                {lastSyncTime && (
                    <span className="text-xs text-text-dim">
                        {new Date(lastSyncTime).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}
