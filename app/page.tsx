'use client';

import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center space-y-8">
                {/* Logo/Title */}
                <h1 className="text-6xl sm:text-7xl font-bold text-gradient mb-12">
                    SettleUp
                </h1>

                {/* Buttons */}
                <div className="flex flex-col gap-4 min-w-[280px]">
                    <Link
                        href="/signup"
                        className="px-8 py-4 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 text-center"
                    >
                        SettleUp
                    </Link>

                    <Link
                        href="/login"
                        className="px-8 py-4 bg-surface hover:bg-surface-light text-text font-semibold rounded-lg border border-border transition-all duration-200 text-center"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
