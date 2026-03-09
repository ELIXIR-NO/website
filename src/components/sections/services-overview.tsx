import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

interface Service {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    href: string;
}

const services: Service[] = [
    {
        title: 'Research Support',
        description: 'Short and long-term support with bioinformatics analyses, programming and data management tasks.',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>,
        color: '#3b82f6',
        href: `${BASE}/research-support`,
    },
    {
        title: 'Services',
        description: 'Analysis and management of life science data within marine, health, genomics, proteomics and more.',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>,
        color: '#f47d20',
        href: `${BASE}/services`,
    },
    {
        title: 'e-Infrastructure',
        description: 'NeLS, the Norwegian e-Infrastructure for Life Sciences, for analysis, sharing, management and storage of life science data.',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>,
        color: '#10b981',
        href: `${BASE}/e-infrastructure`,
    },
    {
        title: 'Sensitive Data',
        description: 'Archiving solutions for potentially identifiable human data with support on TSD, HUNT Cloud and SAFE.',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.51 3.75-3.3 3.09-1.63 6.83-1.63 9.92 0 1.5.79 2.76 1.9 3.75 3.3.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.27-3.39-2.98-2.8-1.47-6.18-1.47-8.98 0-1.35.71-2.49 1.72-3.39 2.98-.1.15-.27.21-.43.21zM12 21c-.17 0-.34-.09-.42-.25-.14-.25-.05-.56.2-.68.66-.36 1.14-.93 1.31-1.55.12-.42.09-.83-.05-1.05-.19-.29-.61-.39-1.06-.39-.71 0-1.86.41-2.72 1.35-.17.19-.47.2-.66.04-.19-.17-.2-.47-.04-.66 1.04-1.14 2.44-1.73 3.42-1.73.74 0 1.43.28 1.8.84.3.47.38 1.1.2 1.77-.23.81-.82 1.52-1.63 1.97-.11.06-.23.09-.35.09z"/><path d="M12 21c-.12 0-.23-.03-.35-.09-.8-.45-1.39-1.16-1.63-1.97-.18-.67-.1-1.3.2-1.77.37-.56 1.06-.84 1.8-.84.98 0 2.38.59 3.42 1.73.17.19.15.49-.04.66-.19.17-.49.15-.66-.04-.86-.94-2.01-1.35-2.72-1.35-.45 0-.87.1-1.06.39-.14.22-.17.63-.05 1.05.17.62.65 1.19 1.31 1.55.25.12.34.43.2.68-.1.16-.25.25-.42.25z"/></svg>,
        color: '#8b5cf6',
        href: `${BASE}/sensitive-data`,
    },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
};

export default function ServicesOverview() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    {/* Left — heading */}
                    <motion.div
                        className="lg:col-span-2 lg:sticky lg:top-32"
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-brand-primary dark:text-white sm:text-4xl">
                            Unlock the Power of Your Data
                        </h2>
                        <p className="mt-4 text-lg text-brand-grey dark:text-gray-300 leading-relaxed">
                            From comprehensive data management and analysis to secure storage and specialised support — everything you need to propel your life science research forward.
                        </p>
                        <a
                            href={`${BASE}/services`}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary dark:text-brand-secondary hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                        >
                            Explore all services
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Right — cards */}
                    <motion.div
                        className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5"
                        variants={shouldReduceMotion ? undefined : container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {services.map((svc) => (
                            <motion.a
                                key={svc.title}
                                href={svc.href}
                                variants={shouldReduceMotion ? undefined : item}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="group relative px-5 py-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-transparent transition-[border-color,box-shadow,background-color] duration-200 hover:bg-white hover:border-gray-200/80 dark:hover:bg-dark-surface dark:hover:border-gray-700/50 hover:shadow-[0_0_0_3px_rgba(244,125,32,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `${svc.color}12` }}
                                >
                                    <span style={{ color: svc.color }}>{svc.icon}</span>
                                </div>
                                <h3 className="text-base font-semibold tracking-wide uppercase text-brand-primary dark:text-white mb-2">
                                    {svc.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-brand-grey dark:text-gray-400">
                                    {svc.description}
                                </p>
                                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-grey/50 dark:text-gray-500 transition-colors group-hover:text-brand-secondary">
                                    Learn more
                                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
