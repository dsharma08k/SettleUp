import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import SyncManager from "@/components/sync/SyncManager";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: 'SettleUp - Offline-First Expense Tracking & Settlement',
    description: 'Modern offline-first expense tracking and settlement app with vintage aesthetic. Track shared expenses, calculate optimal settlements, and work completely offline.',
    keywords: ['expense tracker', 'settle up', 'split bills', 'expense splitting', 'group expenses', 'settlement calculator', 'offline app', 'PWA'],
    authors: [{ name: 'SettleUp Team' }],
    creator: 'SettleUp',
    publisher: 'SettleUp',
    metadataBase: new URL('https://settleup.vercel.app'), // Update with your actual domain
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'SettleUp - Offline-First Expense Tracking',
        description: 'Track shared expenses and calculate optimal settlements with our vintage-themed offline-first app',
        url: 'https://settleup.vercel.app',
        siteName: 'SettleUp',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'SettleUp - Expense Tracking App',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SettleUp - Offline-First Expense Tracking',
        description: 'Track shared expenses and calculate optimal settlements',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#d4a574',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <AuthProvider>
                    <SyncManager />
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#f5ebe0',
                                color: '#1a1614',
                                border: '1px solid #d4a574',
                                borderRadius: '12px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#d4a574',
                                    secondary: '#f5ebe0',
                                },
                            },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
