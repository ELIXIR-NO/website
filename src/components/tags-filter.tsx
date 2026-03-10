import React, { useEffect, useState, useCallback } from 'react';

export type Tag = {
    id: string;
    label: string;
    count: number;
};

export default function TagsFilter({ tags = [] }: { tags: Tag[] }) {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.getAll('tags');
        if (fromUrl.length) setSelected(new Set(fromUrl));
    }, []);

    const notify = useCallback((next: Set<string>) => {
        const params = new URLSearchParams();
        next.forEach(t => params.append('tags', t));
        const qs = params.toString();
        window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
        window.dispatchEvent(new CustomEvent('tags-changed', { detail: [...next] }));
    }, []);

    const handleToggle = useCallback((id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            notify(next);
            return next;
        });
    }, [notify]);

    const handleClear = useCallback(() => {
        setSelected(new Set());
        notify(new Set());
    }, [notify]);

    const isAllSelected = selected.size === 0;

    return (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
            <button
                onClick={handleClear}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                    isAllSelected
                        ? 'bg-brand-primary text-white dark:bg-brand-secondary dark:text-white'
                        : 'border border-gray-200/60 dark:border-gray-700/30 text-brand-grey dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-pressed={isAllSelected}
            >
                All
            </button>
            {tags.map(tag => {
                const isActive = selected.has(tag.id);
                return (
                    <button
                        key={tag.id}
                        onClick={() => handleToggle(tag.id)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                            isActive
                                ? 'bg-brand-primary text-white dark:bg-brand-secondary dark:text-white'
                                : 'border border-gray-200/60 dark:border-gray-700/30 text-brand-grey dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        aria-pressed={isActive}
                    >
                        {tag.label}
                        <span className={`ml-1.5 text-xs ${isActive ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                            {tag.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
