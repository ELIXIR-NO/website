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
                emphasized: ['Sriracha', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                brand: {
                    "primary": "#023452",
                    "secondary": "#F57D20",
                },
                light: {
                    // Basic
                    "background": colors.white,
                    "surface": "#f8f9fa",
                    // Text
                    "on-background": colors.gray["900"],
                    "on-surface": colors.slate["700"],
                    "on-primary": "#F57D20"
                },
                dark: {
                    // Basics
                    "background": "#121212",
                    "surface": "#202020",
                    // Text
                    "on-background": colors.slate["100"],
                    "on-surface": colors.slate["200"],
                    "on-primary": colors.white
                }
            },
            invert: {
                25: '.25',
                50: '.5',
                75: '.75',
                85: '.85',
                95: '.95',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
