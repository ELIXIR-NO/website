import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DomPurify from 'dompurify';

const ignoredPaths = /^\/news\/?$/;
const DEBOUNCE_MS = 200;

interface SearchResult {
    url: string;
    title: string;
    excerpt: string;
}

// NOTE: dangerouslySetInnerHTML below is safe — all content is sanitized
// through DomPurify.sanitize() before rendering. The excerpts come from
// Pagefind (our own build-time index) and contain <mark> tags for highlights.

export default function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const shouldReduceMotion = useReducedMotion();

    // Lock body scroll without jitter — compensate for scrollbar width
    useEffect(() => {
        if (!open) return;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [open]);

    // Focus input on open
    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    // CMD+K / Ctrl+K global shortcut
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(!open);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, setOpen]);

    const close = useCallback(() => {
        setOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(0);
    }, [setOpen]);

    const navigate = useCallback((url: string) => {
        close();
        window.location.href = url;
    }, [close]);

    const search = useCallback(async (term: string) => {
        if (!term.trim() || !(window as any)?.pagefind) {
            setResults([]);
            return;
        }
        const { results: raw } = await (window as any).pagefind.search(term);
        const items: SearchResult[] = [];
        for (const r of raw) {
            const data = await r.data();
            if (!ignoredPaths.test(data.url)) {
                items.push({ url: data.url, title: data.meta?.title, excerpt: data.excerpt });
            }
        }
        setResults(items);
        setActiveIndex(0);
    }, []);

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(val), DEBOUNCE_MS);
    }, [search]);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
        if (e.key === 'Enter' && results[activeIndex]) { navigate(results[activeIndex].url); }
    }, [close, navigate, results, activeIndex]);

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    if (!open) return null;

    const hasQuery = query.trim().length > 0;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[999]" role="dialog" aria-modal="true" aria-label="Search">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={close}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <div className="relative flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
                        <motion.div
                            className="w-full max-w-lg rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-dark-surface shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden"
                            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96, y: -8 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            {/* Input */}
                            <div className="flex items-center gap-3 px-4 border-b border-gray-200/60 dark:border-gray-700/40">
                                <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={onInputChange}
                                    onKeyDown={onKeyDown}
                                    placeholder="Search pages, services, people..."
                                    className="flex-1 h-12 bg-transparent border-0 text-sm text-brand-primary dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none ring-0 focus:ring-0 focus:outline-none"
                                    aria-label="Search"
                                    aria-autocomplete="list"
                                    aria-controls="search-results"
                                    aria-activedescendant={results[activeIndex] ? `search-result-${activeIndex}` : undefined}
                                />
                                <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-gray-200/60 dark:border-gray-700/40 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            {hasQuery && results.length > 0 && (
                                <div
                                    id="search-results"
                                    ref={listRef}
                                    role="listbox"
                                    className="max-h-80 overflow-y-auto overscroll-contain p-2"
                                >
                                    {results.map((item, i) => (
                                        <div
                                            key={item.url}
                                            id={`search-result-${i}`}
                                            role="option"
                                            aria-selected={i === activeIndex}
                                            onClick={() => navigate(item.url)}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            className={`flex flex-col gap-1 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                                                i === activeIndex
                                                    ? 'bg-brand-secondary/10 dark:bg-brand-secondary/10'
                                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <span className={`text-sm font-medium ${
                                                i === activeIndex
                                                    ? 'text-brand-primary dark:text-white'
                                                    : 'text-brand-grey dark:text-gray-300'
                                            }`}>
                                                {item.title}
                                            </span>
                                            <span
                                                className="text-xs text-brand-grey/60 dark:text-gray-500 line-clamp-2 [&_mark]:bg-brand-secondary/20 [&_mark]:text-brand-primary dark:[&_mark]:text-white [&_mark]:rounded-sm [&_mark]:px-0.5"
                                                dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(item.excerpt) }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {hasQuery && results.length === 0 && (
                                <div className="px-4 py-12 text-center">
                                    <p className="text-sm font-medium text-brand-grey dark:text-gray-400">No results found</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different search term</p>
                                </div>
                            )}

                            {/* Hint when empty */}
                            {!hasQuery && (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Start typing to search across all pages</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
