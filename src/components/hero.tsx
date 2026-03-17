import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';

const HeroScene = lazy(() => import('./hero-scene'));

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function SceneFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <img
                src={`${BASE}/assets/logos/elixir-no-dark.svg`}
                alt="ELIXIR Norway"
                className="h-32 w-auto opacity-20 dark:invert-85"
            />
        </div>
    );
}

const ROTATING_WORDS = ['life science', 'genomics', 'bioinformatics', 'biomedical', 'proteomics'];
const ROTATE_INTERVAL = 3000;

function RotatingWord({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
    const [index, setIndex] = useState(0);

    const next = useCallback(() => {
        setIndex(i => (i + 1) % ROTATING_WORDS.length);
    }, []);

    useEffect(() => {
        if (shouldReduceMotion) return;
        const id = setInterval(next, ROTATE_INTERVAL);
        return () => clearInterval(id);
    }, [shouldReduceMotion, next]);

    const word = ROTATING_WORDS[index];

    if (shouldReduceMotion) {
        return <span className="text-accent">{word}</span>;
    }

    return (
        <span className="inline-block relative overflow-clip leading-[inherit]" style={{ height: 'calc(1lh + 0.15em)' }}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={word}
                    className="inline-block text-accent"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                    {word}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

function ScrollCue({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY < 100);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClick = () => {
        const hero = document.querySelector('section');
        if (hero?.nextElementSibling) {
            hero.nextElementSibling.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            aria-label="Scroll to content"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 1 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 p-2 text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-full"
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
                animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
                transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </motion.svg>
        </motion.button>
    );
}

export function Hero() {
    const shouldReduceMotion = useReducedMotion();

    const fadeUp = shouldReduceMotion
        ? {}
        : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

    return (
        <section className="relative -mt-[84px] overflow-hidden lg:min-h-screen">
            <div
                className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.03] via-transparent to-brand-secondary/[0.03] dark:from-brand-primary/20 dark:via-dark-background dark:to-brand-secondary/10"
                aria-hidden="true"
            />

            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="hidden lg:block absolute inset-y-0 right-0 w-[55%] xl:w-[60%]"
            >
                <Suspense fallback={<SceneFallback />}>
                    <HeroScene />
                </Suspense>
            </motion.div>

            <div className="relative min-h-screen flex items-center pt-[84px] pb-12 sm:pb-16 lg:pb-16 z-10 pointer-events-none">
                <div className="w-full px-6 sm:px-8 lg:max-w-7xl lg:mx-auto lg:px-12 pointer-events-auto">
                    <div className="max-w-xl text-balance">
                        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                            <a
                                href="https://elixir-europe.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                            >
                                Part of the European ELIXIR infrastructure
                                <svg className="ml-1.5 h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </motion.div>

                        <motion.h1
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-brand-primary dark:text-white leading-[1.1]"
                        >
                            Research infrastructure for{' '}
                            <RotatingWord shouldReduceMotion={shouldReduceMotion} />
                        </motion.h1>

                        <motion.p
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-brand-grey dark:text-gray-300"
                        >
                            ELIXIR Norway supports Norwegian life science researchers with
                            bioinformatics services, data management tools, and secure
                            e-infrastructure — connecting Norway to Europe's leading
                            bioinformatics network.
                        </motion.p>

                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
                        >
                            <a
                                href={`${BASE}/services`}
                                className="group inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-brand-primary text-white font-bold text-sm hover:bg-brand-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                            >
                                Explore services
                                <svg className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                            <a
                                href={`${BASE}/research-support`}
                                className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-brand-grey dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                            >
                                Get support
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            <ScrollCue shouldReduceMotion={shouldReduceMotion} />
        </section>
    );
}

export default Hero;
