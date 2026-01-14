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
                vintage: {
                    black: "#1a1614",
                    amber: "#d4a574",
                    cream: "#f5ebe0",
                    "amber-light": "#e8c9a0",
                    "amber-dark": "#b38b5c",
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                vintage: "12px",
            },
            boxShadow: {
                vintage: "0 4px 6px rgba(26, 22, 20, 0.1), 0 2px 4px rgba(26, 22, 20, 0.06)",
                "vintage-lg": "0 10px 15px rgba(26, 22, 20, 0.1), 0 4px 6px rgba(26, 22, 20, 0.05)",
            },
        },
    },
    plugins: [],
};
export default config;
