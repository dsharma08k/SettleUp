'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useSyncStore } from '@/stores/syncStore';
import { User, LogOut, Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { isOnline, isSyncing, lastSyncTime, pendingChanges } = useSyncStore();

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out successfully');
        router.push('/login');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-text mb-2">
                <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-text-muted mb-8">Manage your account and sync settings</p>

            <div className="space-y-6">
                {/* User Info Card */}
                <Card>
                    <div className="flex items-start gap-6">
                        <div className="p-4 bg-primary/10 rounded-lg">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-text mb-2">
                                {user?.user_metadata?.name || 'User'}
                            </h2>
                            <p className="text-text-muted">{user?.email}</p>
                            <p className="text-sm text-text-dim mt-2">
                                Member since {user?.created_at && formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Sync Status Card */}
                <Card>
                    <h3 className="text-xl font-semibold text-text mb-4">Sync Status</h3>

                    <div className="space-y-4">
                        {/* Online Status */}
                        <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                                {isOnline ? (
                                    <>
                                        <Wifi className="w-5 h-5 text-green-400" />
                                        <span className="text-text">Online</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-5 h-5 text-red-400" />
                                        <span className="text-text">Offline</span>
                                    </>
                                )}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                        </div>

                        {/* Sync Status */}
                        {isSyncing && (
                            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                                <span className="text-text">Syncing data...</span>
                            </div>
                        )}

                        {/* Last Sync */}
                        {lastSyncTime && (
                            <div className="flex items-center gap-3 p-4 bg-surface-light rounded-lg border border-border">
                                <Clock className="w-5 h-5 text-text-dim" />
                                <div>
                                    <p className="text-sm text-text-dim">Last synced</p>
                                    <p className="text-text font-medium">
                                        {formatDistanceToNow(lastSyncTime, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pending Changes */}
                        {pendingChanges > 0 && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-sm text-yellow-400">
                                    <strong>{pendingChanges}</strong> change{pendingChanges > 1 ? 's' : ''} pending sync
                                </p>
                                <p className="text-xs text-yellow-400/70 mt-1">
                                    Changes will sync automatically when you&apos;re online
                                </p>
                            </div>
                        )}

                        {!isSyncing && pendingChanges === 0 && isOnline && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-sm text-green-400">
                                    ✓ All data is synced
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* App Info Card */}
                <Card>
                    <h3 className="text-xl font-semibold text-text mb-4">About</h3>
                    <div className="space-y-2 text-sm text-text-muted">
                        <p><strong className="text-text">App:</strong> SettleUp</p>
                        <p><strong className="text-text">Version:</strong> 1.0.0</p>
                        <p><strong className="text-text">Storage:</strong> IndexedDB (Offline-first)</p>
                        <p><strong className="text-text">Cloud Sync:</strong> Supabase</p>
                    </div>
                </Card>

                {/* Sign Out */}
                <Card>
                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 text-red-400 hover:bg-red-500/10 border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </Card>
            </div>
        </div>
    );
}
