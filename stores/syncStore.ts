import { create } from 'zustand';

interface SyncState {
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncTime: Date | null;
    pendingChanges: number;
    setOnline: (online: boolean) => void;
    setSyncing: (syncing: boolean) => void;
    setLastSyncTime: (time: Date) => void;
    setPendingChanges: (count: number) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    setOnline: (online) => set({ isOnline: online }),
    setSyncing: (syncing) => set({ isSyncing: syncing }),
    setLastSyncTime: (time) => set({ lastSyncTime: time }),
    setPendingChanges: (count) => set({ pendingChanges: count }),
}));

// Hook to monitor online/offline status
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        useSyncStore.getState().setOnline(true);
    });

    window.addEventListener('offline', () => {
        useSyncStore.getState().setOnline(false);
    });
}
