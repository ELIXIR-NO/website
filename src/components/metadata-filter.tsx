import React, { useEffect, useState } from "react";

export type FilterValue = {
    id: string | number;
    value: string;
    label: string;
};

export type FilterGroup = {
    name: string;
    values: FilterValue[];
};

export default function MetadataFilter({ filters = [] }: { filters: FilterGroup[] }) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, (number | string)[]>>({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialSelections: Record<string, (number | string)[]> = {};

        filters.forEach(({ name, values }) => {
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
        console.assert(!!id, "TagsFilter: {id} cannot be null|undefined");
        console.log(filterName, id)

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
            console.log(newSelectedFilters)
            return newSelectedFilters;
        });

    };

    return (
        <div className="mt-6 space-y-6">
            {filters.map(({ name, values }) => (
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
                                        className={`
                                            inline-flex items-center py-2 px-3 rounded-full cursor-pointer text-sm font-medium
                                            transition-all duration-200 ease-in-out
                                            border border-gray-300 dark:border-gray-600
                                            bg-white dark:bg-gray-800
                                            text-gray-700 dark:text-gray-300
                                            hover:bg-gray-50 dark:hover:bg-gray-700
                                            hover:border-gray-400 dark:hover:border-gray-500
                                            ${isSelected
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : ''
                                        }
                                        `}>
                                        {label}
                                        {isSelected && (
                                            <span
                                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:scale-110 transition-transform duration-150"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFilter(name, id);
                                                }}>
                                                ✕
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