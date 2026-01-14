import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme colors
                background: "#0f172a", // slate-900
                surface: "#1e293b",    // slate-800
                'surface-light': "#334155", // slate-700
                primary: "#f59e0b",    // amber-500
                'primary-dark': "#d97706", // amber-600
                'primary-light': "#fbbf24", // amber-400
                text: "#f1f5f9",       // slate-100
                'text-muted': "#cbd5e1", // slate-300
                'text-dim': "#64748b",   // slate-500
                border: "#334155",     // slate-700
                accent: "#f59e0b",     // amber-500
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'dark-texture': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [],
};

export default config;
