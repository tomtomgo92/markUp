/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#482AA2',
                secondary: '#8b5cf6',
                dark: '#0f172a',
                light: '#f8fafc',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
}
