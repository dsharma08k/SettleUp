import { useSyncStore } from '@/stores/syncStore';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SyncStatusBadge() {
    const { isOnline, isSyncing, lastSyncTime, pendingChanges } = useSyncStore();

    return (
        <div className="flex items-center gap-3">
            {/* Online/Offline Indicator */}
            <div className="flex items-center gap-2">
                {isOnline ? (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <Wifi className="w-4 h-4 text-green-600" />
                    </>
                ) : (
                    <>
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <WifiOff className="w-4 h-4 text-red-600" />
                    </>
                )}
            </div>

            {/* Sync Status */}
            {isSyncing && (
                <div className="flex items-center gap-2 text-vintage-amber">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Syncing...</span>
                </div>
            )}

            {/* Pending Changes */}
            {pendingChanges > 0 && !isSyncing && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-vintage-amber">
                        {pendingChanges} pending
                    </span>
                </div>
            )}

            {/* Last Sync Time */}
            {lastSyncTime && !isSyncing && (
                <span className="text-xs text-vintage-black/60">
                    Last synced {formatDistanceToNow(lastSyncTime, { addSuffix: true })}
                </span>
            )}
        </div>
    );
}
