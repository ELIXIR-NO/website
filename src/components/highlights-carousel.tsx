import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

interface Slide {
    src: string;
    alt: string;
    caption?: string;
}

export default function HighlightsCarousel({ slides }: { slides: Slide[] }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [direction, setDirection] = useState(1);
    const shouldReduceMotion = useReducedMotion();
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const progressRef = useRef<HTMLDivElement>(null);

    const INTERVAL = 6000;

    const go = useCallback((idx: number) => {
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
    }, [current]);

    const next = useCallback(() => {
        setDirection(1);
        setCurrent(i => (i + 1) % slides.length);
    }, [slides.length]);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent(i => (i - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (paused || shouldReduceMotion) return;
        timerRef.current = setTimeout(next, INTERVAL);
        return () => clearTimeout(timerRef.current);
    }, [current, paused, shouldReduceMotion, next]);

    const slide = slides[current];

    const variants = shouldReduceMotion
        ? { enter: {}, center: {}, exit: {} }
        : {
            enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.5 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0 }),
        };

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-label="Highlights carousel"
            aria-roledescription="carousel"
        >
            {/* Main slide area */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 dark:bg-dark-surface">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src={`${BASE}${slide.src}`}
                            alt={slide.alt}
                            className="w-full h-full object-cover"
                        />
                        {slide.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 sm:px-10 pb-6 sm:pb-8 pt-20">
                                <p className="text-white text-sm sm:text-base leading-relaxed max-w-3xl">
                                    {slide.caption}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Side arrows — visible on hover */}
                <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <button
                        onClick={prev}
                        className="pointer-events-auto p-2.5 rounded-full bg-white/90 dark:bg-black/60 text-gray-800 dark:text-white shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                        aria-label="Previous slide"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="pointer-events-auto p-2.5 rounded-full bg-white/90 dark:bg-black/60 text-gray-800 dark:text-white shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                        aria-label="Next slide"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Progress bar + controls */}
            <div className="mt-5 flex items-center gap-4 max-w-xl mx-auto">
                {/* Segmented progress bar */}
                <div className="flex-1 flex gap-1.5" role="tablist" aria-label="Slide indicators">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            role="tab"
                            aria-selected={i === current}
                            aria-label={`Slide ${i + 1} of ${slides.length}`}
                            className="relative flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                        >
                            {i === current && !paused && !shouldReduceMotion ? (
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-brand-secondary rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                                    key={`progress-${current}`}
                                />
                            ) : (
                                <div
                                    className={`absolute inset-0 rounded-full transition-colors ${
                                        i === current ? 'bg-brand-secondary' : 'bg-transparent'
                                    }`}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Pause */}
                <button
                    onClick={() => setPaused(p => !p)}
                    className="p-1.5 rounded-md text-brand-grey dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                    aria-label={paused ? 'Resume auto-play' : 'Pause auto-play'}
                >
                    {paused ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
