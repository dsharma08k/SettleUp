'use client';

import { Home, Users, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function DesktopSidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();
    const router = useRouter();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/dashboard/groups', label: 'Groups', icon: Users },
        { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
    ];

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out successfully');
        router.push('/login');
    };

    return (
        <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-vintage-amber/20 min-h-screen">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-vintage-amber mb-2">SettleUp</h1>
                <p className="text-sm text-vintage-black/60">
                    {user?.user_metadata?.name || user?.email}
                </p>
            </div>

            <nav className="flex-1 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-vintage mb-2 transition-colors ${isActive
                                    ? 'bg-vintage-amber text-white shadow-vintage'
                                    : 'text-vintage-black/70 hover:bg-vintage-amber/10 hover:text-vintage-amber'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-vintage-amber/20">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-vintage text-vintage-black/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
