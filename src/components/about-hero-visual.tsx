import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Chip {
    label: string;
    size: 'lg' | 'md' | 'sm';
    x: number;
    y: number;
    color?: string;
    rotate?: number;
}

const CHIPS: Chip[] = [
    { label: 'UiB Bergen', size: 'lg', x: 12, y: 6, color: '#dc3545', rotate: -2 },
    { label: 'UiO Oslo', size: 'lg', x: 60, y: 2, color: '#c8102e', rotate: 1 },
    { label: 'UiT Tromsø', size: 'lg', x: 2, y: 45, color: '#003349', rotate: -1 },
    { label: 'NTNU Trondheim', size: 'lg', x: 48, y: 80, color: '#00509e', rotate: 2 },
    { label: 'NMBU Ås', size: 'lg', x: 70, y: 42, color: '#005f3b', rotate: -1 },
    { label: 'Services', size: 'md', x: 50, y: 26 },
    { label: 'Training', size: 'md', x: 0, y: 76 },
    { label: 'Helpdesk', size: 'md', x: 72, y: 66, rotate: -1 },
    { label: 'NeLS', size: 'md', x: 34, y: 52, rotate: 1 },
    { label: 'Storage', size: 'sm', x: 28, y: 28, rotate: 2 },
    { label: 'Sensitive Data', size: 'sm', x: 16, y: 66, rotate: -2 },
    { label: 'Bioinformatics', size: 'sm', x: 56, y: 56, rotate: 1 },
];

const sizeClasses = {
    lg: 'px-6 py-3 text-base font-bold',
    md: 'px-5 py-2.5 text-sm font-semibold',
    sm: 'px-4 py-2 text-xs font-semibold',
};

const BLOBS = [
    { x: 20, y: 25, size: 220, color: 'from-brand-primary/20 to-brand-secondary/10', delay: 0 },
    { x: 65, y: 60, size: 180, color: 'from-brand-secondary/15 to-orange-300/10', delay: 2 },
    { x: 40, y: 75, size: 140, color: 'from-blue-400/10 to-brand-primary/15', delay: 4 },
];

export default function AboutHeroVisual() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div
            className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:max-w-none"
            style={{ mask: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', maskComposite: 'intersect', WebkitMask: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskComposite: 'source-in' }}
            role="img"
            aria-label="ELIXIR Norway network: five universities and key services"
        >
            {/* Gradient blobs — background depth */}
            {BLOBS.map((blob, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full bg-gradient-to-br ${blob.color} blur-3xl`}
                    style={{
                        left: `${blob.x}%`,
                        top: `${blob.y}%`,
                        width: blob.size,
                        height: blob.size,
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={shouldReduceMotion ? {} : {
                        x: [0, 20, -15, 10, 0],
                        y: [0, -15, 10, -20, 0],
                        scale: [1, 1.1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: 12 + i * 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: blob.delay,
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* Subtle dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06]" aria-hidden="true">
                <defs>
                    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>

            {/* Floating chips */}
            {CHIPS.map((chip, i) => {
                const hasColor = !!chip.color;
                return (
                    <motion.div
                        key={chip.label}
                        className={`absolute rounded-full select-none whitespace-nowrap ${sizeClasses[chip.size]} ${
                            hasColor
                                ? 'text-white shadow-lg'
                                : 'bg-white/90 dark:bg-white/[0.1] text-brand-primary dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/30 backdrop-blur-md shadow-sm'
                        }`}
                        style={{
                            left: `${chip.x}%`,
                            top: `${chip.y}%`,
                            ...(hasColor ? {
                                backgroundColor: chip.color,
                                boxShadow: `0 8px 24px -4px ${chip.color}40`,
                            } : {}),
                        }}
                        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.5, rotate: (chip.rotate || 0) * 3 }}
                        animate={shouldReduceMotion ? { rotate: chip.rotate || 0 } : {
                            opacity: 1,
                            scale: 1,
                            rotate: chip.rotate || 0,
                            y: [0, -(5 + i % 4 * 3), 0, (4 + i % 3 * 2), 0],
                            x: [0, (3 + i % 3 * 2), 0, -(2 + i % 2 * 3), 0],
                        }}
                        transition={shouldReduceMotion ? {} : {
                            opacity: { duration: 0.5, delay: 0.05 + i * 0.06 },
                            scale: { duration: 0.5, delay: 0.05 + i * 0.06, type: 'spring', stiffness: 200 },
                            rotate: { duration: 0.5, delay: 0.05 + i * 0.06 },
                            y: { duration: 6 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
                            x: { duration: 7 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 },
                        }}
                    >
                        {chip.label}
                    </motion.div>
                );
            })}
        </div>
    );
}
