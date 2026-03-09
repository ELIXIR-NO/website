import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const universities = [
    { name: 'University of Bergen', location: 'Bergen', logo: `${BASE}/assets/logos/orgs/uib.svg`, href: `${BASE}/about/bergen`, color: '#dc3545' },
    { name: 'University of Oslo', location: 'Oslo', logo: `${BASE}/assets/logos/orgs/uio.svg`, href: `${BASE}/about/oslo`, color: '#c8102e' },
    { name: 'UiT The Arctic University of Norway', location: 'Troms\u00f8', logo: `${BASE}/assets/logos/orgs/uit.svg`, href: `${BASE}/about/tromso`, color: '#003349' },
    { name: 'Norwegian University of Life Sciences', location: '\u00c5s', logo: `${BASE}/assets/logos/orgs/nmbu.svg`, href: `${BASE}/about/aas`, color: '#005f3b' },
    { name: 'Norwegian University of Science and Technology', location: 'Trondheim', logo: `${BASE}/assets/logos/orgs/ntnu.svg`, href: `${BASE}/about/trondheim`, color: '#00509e' },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Universities() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-16 lg:gap-x-20"
            variants={shouldReduceMotion ? undefined : container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
        >
            {universities.map((uni) => (
                <motion.a
                    key={uni.location}
                    href={uni.href}
                    variants={shouldReduceMotion ? undefined : item}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="group flex flex-col items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-4 rounded-lg"
                >
                    <img
                        src={uni.logo}
                        alt={`${uni.name} logo`}
                        className="h-20 sm:h-24 w-auto object-contain grayscale opacity-50 dark:invert-85 dark:opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                        loading="lazy"
                    />
                    <span className="relative text-sm font-semibold text-brand-grey/60 dark:text-gray-500 transition-colors duration-300 group-hover:text-brand-primary dark:group-hover:text-white pb-1">
                        {uni.location}
                        <span
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100"
                            style={{ backgroundColor: uni.color }}
                            aria-hidden="true"
                        />
                    </span>
                </motion.a>
            ))}
        </motion.div>
    );
}
