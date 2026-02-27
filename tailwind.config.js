/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Syne', 'sans-serif'],
            },
            colors: {
                ink: '#0d0f1a',
                paper: '#f7f6f2',
                canvas: '#ede9e0',
                accent: { DEFAULT: '#4f46e5', dark: '#3730a3', light: '#818cf8' },
                violet: { DEFAULT: '#7c3aed', dark: '#5b21b6', light: '#a78bfa' },
                amber: { DEFAULT: '#f59e0b', dark: '#b45309', light: '#fcd34d' },
                rose: { DEFAULT: '#f43f5e', dark: '#be123c', light: '#fda4af' },
                sage: { DEFAULT: '#10b981', dark: '#065f46', light: '#6ee7b7' },
            },
            borderRadius: {
                card: '18px',
                xl2: '20px',
            },
            boxShadow: {
                card: '0 2px 12px -3px rgba(13,15,26,0.08), 0 1px 4px -2px rgba(13,15,26,0.06)',
                lift: '0 12px 32px -8px rgba(13,15,26,0.14), 0 4px 12px -4px rgba(13,15,26,0.08)',
                glow: '0 6px 20px -4px rgba(79,70,229,0.45)',
                inner: 'inset 0 1px 3px rgba(13,15,26,0.08)',
            },
        },
    },
    plugins: [],
}
