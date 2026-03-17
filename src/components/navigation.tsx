import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import React, { Fragment, useEffect, useState, useCallback } from "react";
import CommandPalette from "./command-palette.tsx";
import ThemeToggle from "./theme-toggle.tsx";

const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const navigation = [
    { href: `${BASE}/about`, name: "About" },
    { href: `${BASE}/research-support`, name: "Research Support" },
    { href: `${BASE}/services`, name: "Services" },
    { href: `${BASE}/events`, name: "Events" },
    { href: `${BASE}/training`, name: "Training" },
    { href: `${BASE}/funding-and-projects`, name: "Funding & Projects" },
    { href: `${BASE}/news`, name: "News" },
];

const useScrolled = (threshold = 20) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);
    return scrolled;
};

export const Navigation = ({ pathname }: { pathname: string }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const scrolled = useScrolled();
    const shouldReduceMotion = useReducedMotion();

    const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileMenuOpen) closeMobile();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileMenuOpen, closeMobile]);

    return (
        <Fragment>
            <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
            <header className="fixed top-3 inset-x-3 sm:inset-x-5 lg:inset-x-8 z-50">
                <div
                    className={`rounded-2xl transition-all duration-300 ${
                        scrolled
                            ? 'bg-white/80 dark:bg-dark-background/80 backdrop-blur-xl shadow-lg shadow-black/[0.08] dark:shadow-black/30 border border-gray-200/60 dark:border-gray-700/60'
                            : 'bg-white/40 dark:bg-dark-background/40 backdrop-blur-md border border-white/40 dark:border-white/10'
                    }`}
                >
                    <nav
                        aria-label="Main navigation"
                        className="flex items-center justify-between px-5 py-3 lg:px-6"
                    >

                        {/* Logo */}
                        <div className="flex shrink-0">
                            <a href={`${BASE}/`} className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg">
                                <span className="sr-only">ELIXIR Norway</span>
                                <img
                                    alt="ELIXIR Norway logo"
                                    src={`${BASE}/assets/logos/elixir-no-light.svg`}
                                    className="hidden dark:block h-14 w-auto"
                                    width="120"
                                    height="48"
                                />
                                <img
                                    alt="ELIXIR Norway logo"
                                    src={`${BASE}/assets/logos/elixir-no-dark.svg`}
                                    className="block dark:hidden h-14 w-auto"
                                    width="120"
                                    height="48"
                                />
                            </a>
                        </div>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex lg:items-center lg:gap-x-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`relative px-3 py-2 text-sm 2xl:text-base font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                            isActive
                                                ? 'text-accent bg-accent/10'
                                                : 'text-brand-grey dark:text-gray-300 hover:text-brand-primary dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                        }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Desktop right actions */}
                        <div className="hidden lg:flex lg:items-center lg:gap-x-1">
                            <ThemeToggle />
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="h-9 w-9 flex items-center justify-center rounded-xl text-brand-grey dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="Search (Ctrl+K)"
                            >
                                <SearchIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex lg:hidden items-center gap-x-1">
                            <ThemeToggle />
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 rounded-lg text-brand-grey dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="Open menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-[84px]" aria-hidden="true" />

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
                            onClick={closeMobile}
                            aria-hidden="true"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-white dark:bg-dark-background shadow-2xl lg:hidden"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation"
                        >
                            <div className="flex items-center justify-between px-6 py-4">
                                <a href={`${BASE}/`} className="p-1" onClick={closeMobile}>
                                    <span className="sr-only">ELIXIR Norway</span>
                                    <img
                                        alt="ELIXIR Norway logo"
                                        src={`${BASE}/assets/logos/elixir-no-light.svg`}
                                        className="hidden dark:block h-10 w-auto"
                                        width="100"
                                        height="40"
                                    />
                                    <img
                                        alt="ELIXIR Norway logo"
                                        src={`${BASE}/assets/logos/elixir-no-dark.svg`}
                                        className="block dark:hidden h-10 w-auto"
                                        width="100"
                                        height="40"
                                    />
                                </a>
                                <button
                                    type="button"
                                    onClick={closeMobile}
                                    className="p-2 rounded-lg text-brand-grey dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                    aria-label="Close menu"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="px-6 py-4">
                                <nav aria-label="Mobile navigation">
                                    <ul className="space-y-1">
                                        {navigation.map((item, i) => {
                                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                            return (
                                                <motion.li
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.05 * i }}
                                                >
                                                    <a
                                                        href={item.href}
                                                        onClick={closeMobile}
                                                        className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                                            isActive
                                                                ? 'text-accent bg-accent/10'
                                                                : 'text-brand-grey dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                                        }`}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </a>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </nav>
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => { closeMobile(); setSearchOpen(true); }}
                                        className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-base font-semibold text-brand-grey dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                    >
                                        <SearchIcon className="h-5 w-5" />
                                        Search
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Fragment>
    );
};

export default Navigation;
