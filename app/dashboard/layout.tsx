import DesktopSidebar from '@/components/layout/DesktopSidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <DesktopSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-surface border-b border-border px-4 py-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Add any header content here if needed */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileNav />
        </div>
    );
}
