import React, { useEffect, useState } from "react";

export type FilterValue = {
    id: string | number;
    value: string;
    label: string;
};

export type FilterGroup = {
    name: string;
    type?: "input" | "checkbox";
    values: FilterValue[];
};

export default function MetadataFilter({ filters = [] }: { filters: FilterGroup[] }) {

    const [selectedFilters, setSelectedFilters] = useState<Record<string, (number | string)[]>>({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialSelections: Record<string, (number | string)[]> = {};
        filters.forEach(({ name, type, values }) => {
            const selectedFromUrl = params.getAll(name);
            if (selectedFromUrl.length > 0) {
                // Convert URL strings back to their original types by matching with available values
                const convertedValues = selectedFromUrl.map(urlValue => {
                    const matchingValue = values.find(v => v.value === urlValue || v.id.toString() === urlValue);
                    return matchingValue ? matchingValue.id : urlValue;
                }).filter(Boolean);

                if (convertedValues.length > 0) {
                    initialSelections[name] = convertedValues;
                }
            }
        });

        setSelectedFilters(initialSelections);
    }, [filters]);

    const updateUrl = (newSelectedFilters: Record<string, (number | string)[]>) => {
        const params = new URLSearchParams();
        Object.entries(newSelectedFilters).forEach(([filterName, selectedValues]) => {
            // Find the filter group to get the actual values
            const filterGroup = filters.find(f => f.name === filterName);
            if (filterGroup) {
                selectedValues.forEach(selectedId => {
                    const matchingValue = filterGroup.values.find(v => v.id === selectedId);
                    if (matchingValue) {
                        params.append(filterName, matchingValue.value);
                    }
                });
            }
        });
        window.history.replaceState(
            null,
            '',
            `${window.location.pathname}?${params.toString()}`
        );
        // Dispatch a custom event to notify anyone about the URL change
        window.dispatchEvent(new Event('url-change'));
    };

    const toggleFilter = (filterName: string, id: number | string) => {
        setSelectedFilters((prevSelectedFilters) => {
            const currentSelected = prevSelectedFilters[filterName] || [];
            const newSelected = currentSelected.includes(id)
                ? currentSelected.filter((filterId) => filterId !== id)
                : [...currentSelected, id];

            const newSelectedFilters = {
                ...prevSelectedFilters,
                [filterName]: newSelected
            };
            // Remove empty filter groups from the object
            if (newSelected.length === 0) {
                delete newSelectedFilters[filterName];
            }
            // Update URL with new selected filters
            updateUrl(newSelectedFilters);
            return newSelectedFilters;
        });
    };

    return (
        <div className="mt-6 space-y-6">
            {filters.map(({ name, type, values }) => (
                <div key={name} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <form className="flex flex-wrap gap-2">
                        {values.map(({ id, label, value }) => {
                            const isSelected = selectedFilters[name]?.includes(id) || false;
                            return (
                                <div key={`${name}-${id}`}>
                                    <label
                                        onClick={() => toggleFilter(name, id)}
                                        className={`items-center py-1 px-3 inline-flex flex-shrink-0 rounded-full cursor-pointer text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-700 has-[:checked]:border-brand-primary bg-slate-50 dark:bg-dark-surface has-[:checked]:dark:bg-brand-primary/50`}>
                                        {label}
                                        {isSelected && (
                                            <span
                                                className="ml-2 hover:scale-105 hover:font-bold"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFilter(name, id);                                                }}>✕
                                            </span>
                                        )}
                                        <input
                                            id={`${name}-filter-${id}`}
                                            name={name}
                                            value={value}
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleFilter(name, id)}
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                            );
                        })}
                    </form>
                </div>
            ))}
        </div>
    );
}