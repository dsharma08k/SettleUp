'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Cloud, Calculator, Lock } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center">
                        {/* Logo/Title */}
                        <h1 className="text-5xl sm:text-7xl font-bold text-text mb-6">
                            <span className="text-gradient">SettleUp</span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-xl sm:text-2xl text-text-muted mb-8 max-w-2xl mx-auto">
                            The smart way to track expenses and settle up with friends.
                            <span className="block mt-2 text-primary">Works offline. Syncs automatically.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/signup"
                                className="group px-8 py-4 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/login"
                                className="px-8 py-4 bg-surface hover:bg-surface-light text-text font-semibold rounded-lg border border-border transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Trust badge */}
                        <p className="mt-8 text-sm text-text-dim">
                            No credit card required • Free forever
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                        Why Choose SettleUp?
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Built for the modern way of sharing expenses with friends and groups
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Cloud className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">Offline First</h3>
                        <p className="text-text-muted">
                            Works completely offline. Add expenses anywhere, sync when you're back online.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">Real-time Sync</h3>
                        <p className="text-text-muted">
                            See updates instantly. Changes from your friends appear in real-time.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Calculator className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">Smart Settlements</h3>
                        <p className="text-text-muted">
                            Optimized algorithm minimizes the number of transactions needed to settle up.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">Secure & Private</h3>
                        <p className="text-text-muted">
                            Your data is encrypted and protected. Only you and your group members can see it.
                        </p>
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-surface/50 border-y border-border py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                            Simple as 1-2-3
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-2">Create a Group</h3>
                            <p className="text-text-muted">
                                Start a group for your trip, roommates, or any shared expenses
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-2">Add Expenses</h3>
                            <p className="text-text-muted">
                                Log expenses as they happen with equal or custom splits
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-2">Settle Up</h3>
                            <p className="text-text-muted">
                                See who owes whom and settle with minimum transactions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                    Ready to simplify expense tracking?
                </h2>
                <p className="text-lg text-text-muted mb-8">
                    Join thousands of users managing their shared expenses with SettleUp
                </p>
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                >
                    Start Tracking Now
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-text-dim text-sm">
                        © 2026 SettleUp. Built with ❤️ for better expense management.
                    </p>
                </div>
            </footer>
        </div>
    );
}
