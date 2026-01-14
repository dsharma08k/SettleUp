'use client';

import { MobileNav } from '@/components/layout/MobileNav';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { SyncStatusBadge } from '@/components/layout/SyncStatusBadge';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <DesktopSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header with Sync Status */}
                <header className="bg-white border-b border-vintage-amber/20 px-4 py-4 md:px-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-vintage-black md:hidden">
                            SettleUp
                        </h2>
                        <SyncStatusBadge />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
                    {children}
                </main>

                <MobileNav />
            </div>
        </div>
    );
}
