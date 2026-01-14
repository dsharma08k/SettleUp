'use client';

import { Home, Users, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Home', icon: Home },
        { href: '/dashboard/groups', label: 'Groups', icon: Users },
        { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-vintage-amber/20 md:hidden z-50">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-vintage transition-colors ${isActive
                                    ? 'text-vintage-amber bg-vintage-amber/10'
                                    : 'text-vintage-black/60 hover:text-vintage-amber'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
