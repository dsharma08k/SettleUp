'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import SyncStatusBadge from './SyncStatusBadge';

export default function DesktopSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/groups', label: 'Groups', icon: Users },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside className="hidden md:flex md:flex-col w-64 bg-surface border-r border-border min-h-screen">
            <div className="p-6 border-b border-border">
                <h1 className="text-3xl font-bold text-gradient mb-2">SettleUp</h1>
                <p className="text-sm text-text-muted">Expense Tracker</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-primary text-background shadow-lg shadow-primary/20'
                                    : 'text-text-muted hover:bg-surface-light hover:text-primary'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-3">
                <SyncStatusBadge />
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
