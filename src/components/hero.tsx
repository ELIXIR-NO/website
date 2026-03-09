import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { Component, Suspense, lazy, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

const DNAScene = lazy(() => import('./dna-scene'));

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

class SceneErrorBoundary extends Component<
    { fallback: ReactNode; children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) { console.warn('3D scene failed:', error.message); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

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
        return <span className="text-brand-secondary">{word}</span>;
    }

    return (
        <span className="inline-block relative overflow-clip leading-[inherit]" style={{ height: '1lh' }}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={word}
                    className="inline-block text-brand-secondary"
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

export function Hero() {
    const shouldReduceMotion = useReducedMotion();

    const fadeUp = shouldReduceMotion
        ? {}
        : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

    return (
        <section className="relative -mt-[84px] overflow-hidden lg:min-h-screen">
            {/* Background gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.03] via-transparent to-brand-secondary/[0.03] dark:from-brand-primary/20 dark:via-dark-background dark:to-brand-secondary/10"
                aria-hidden="true"
            />

            {/* 3D scene — hidden on mobile, absolute right on desktop */}
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="hidden lg:block absolute inset-y-0 right-0 w-[60%]"
                aria-hidden="true"
            >
                <SceneErrorBoundary fallback={<SceneFallback />}>
                    <Suspense fallback={<SceneFallback />}>
                        <DNAScene />
                    </Suspense>
                </SceneErrorBoundary>
            </motion.div>

            {/* Text content — full width on mobile, left side on desktop */}
            <div className="relative min-h-screen flex items-center pt-[84px] pb-12 sm:pb-16 lg:pb-16 z-10">
                <div className="w-full px-6 sm:px-8 lg:max-w-7xl lg:mx-auto lg:px-12">
                    <div className="max-w-xl text-balance">
                        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20">
                                Part of the European ELIXIR infrastructure
                            </span>
                        </motion.div>

                        <motion.h1
                            {...fadeUp}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-brand-primary dark:text-white leading-[1.1]"
                        >
                            Data infrastructure for{' '}
                            <RotatingWord shouldReduceMotion={shouldReduceMotion} />{' '}
                            research
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
                                className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-brand-primary text-white font-bold text-sm hover:bg-brand-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                            >
                                Explore services
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                            <a
                                href={`${BASE}/research-support`}
                                className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-brand-grey dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                            >
                                Get support
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
