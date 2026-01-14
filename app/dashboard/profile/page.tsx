'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
            <h1 className="text-4xl font-bold text-vintage-amber mb-8">Profile</h1>

            <div className="space-y-6">
                {/* User Info Card */}
                <Card>
                    <div className="flex items-start gap-6">
                        <div className="p-4 bg-vintage-amber/20 rounded-vintage">
                            <User className="w-12 h-12 text-vintage-amber" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-vintage-black mb-2">
                                {user?.user_metadata?.name || 'User'}
                            </h2>
                            <p className="text-vintage-black/70">{user?.email}</p>
                            <p className="text-sm text-vintage-black/50 mt-2">
                                Member since {user?.created_at && formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Sync Status Card */}
                <Card>
                    <h3 className="text-xl font-semibold text-vintage-black mb-4">Sync Status</h3>

                    <div className="space-y-4">
                        {/* Online Status */}
                        <div className="flex items-center justify-between p-4 bg-vintage-cream/50 rounded-vintage">
                            <div className="flex items-center gap-3">
                                {isOnline ? (
                                    <>
                                        <Wifi className="w-5 h-5 text-green-600" />
                                        <span className="text-vintage-black">Online</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-5 h-5 text-red-600" />
                                        <span className="text-vintage-black">Offline</span>
                                    </>
                                )}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        </div>

                        {/* Sync Status */}
                        {isSyncing && (
                            <div className="flex items-center gap-3 p-4 bg-vintage-amber/10 rounded-vintage">
                                <RefreshCw className="w-5 h-5 text-vintage-amber animate-spin" />
                                <span className="text-vintage-black">Syncing data...</span>
                            </div>
                        )}

                        {/* Last Sync */}
                        {lastSyncTime && (
                            <div className="flex items-center gap-3 p-4 bg-vintage-cream/50 rounded-vintage">
                                <Clock className="w-5 h-5 text-vintage-black/60" />
                                <div>
                                    <p className="text-sm text-vintage-black/60">Last synced</p>
                                    <p className="text-vintage-black font-medium">
                                        {formatDistanceToNow(lastSyncTime, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pending Changes */}
                        {pendingChanges > 0 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-vintage">
                                <p className="text-sm text-yellow-800">
                                    <strong>{pendingChanges}</strong> change{pendingChanges > 1 ? 's' : ''} pending sync
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">
                                    Changes will sync automatically when you're online
                                </p>
                            </div>
                        )}

                        {!isSyncing && pendingChanges === 0 && isOnline && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-vintage">
                                <p className="text-sm text-green-800">
                                    ✓ All data is synced
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* App Info Card */}
                <Card>
                    <h3 className="text-xl font-semibold text-vintage-black mb-4">About</h3>
                    <div className="space-y-2 text-sm text-vintage-black/70">
                        <p><strong>App:</strong> SettleUp</p>
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Storage:</strong> IndexedDB (Offline-first)</p>
                        <p><strong>Cloud Sync:</strong> Supabase</p>
                    </div>
                </Card>

                {/* Sign Out */}
                <Card>
                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 border-red-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </Card>
            </div>
        </div>
    );
}
