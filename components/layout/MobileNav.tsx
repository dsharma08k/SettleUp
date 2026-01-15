'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User } from 'lucide-react';

import { useAuth } from '@/lib/auth/AuthContext';

export default function MobileNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/groups', label: 'Groups', icon: Users },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-50 shadow-lg">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors
                                ${isActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-text-dim hover:text-primary'
                                }
                            `}
                        >
                            {item.label === 'Profile' && user?.user_metadata?.avatar_url ? (
                                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-current">
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <Icon className="w-5 h-5" />
                            )}
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
