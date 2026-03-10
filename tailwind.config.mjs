const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    "primary": "#023452",
                    "secondary": "#f47d20",
                    "secondary-text": "#d97016",
                    "grey": "#4d4848",
                    "green": "#bebf32",
                },
                light: {
                    "background": colors.white,
                    "surface": "#f8f9fa",
                    "on-background": "#4d4848",
                    "on-surface": "#4d4848",
                    "on-primary": "#f47d20",
                },
                dark: {
                    "background": "#121212",
                    "surface": "#202020",
                    "on-background": colors.slate["100"],
                    "on-surface": colors.slate["200"],
                    "on-primary": colors.white,
                },
            },
            invert: {
                25: '.25',
                50: '.5',
                75: '.75',
                85: '.85',
                95: '.95',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
