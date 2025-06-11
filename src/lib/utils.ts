export const slugToTitleCase = (slug: string) => slug
    .toLowerCase()
    .split(/[-_.\s]/)
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(' ');

export const sortStringsByLength = (strings: string[]): string[] => {
    return strings.sort((a, b) => a.length - b.length);
};

export const classNames = (...classes): string => {
    return classes.filter(Boolean).join(' ')
}

export const stringToKebabCase = (str: string) => {
    return str
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9\s]/g, '') // remove non-alphanumeric characters except spaces
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, '-'); // replace spaces with hyphens
};

export const truncateStringToLength = (string: string, length: number) => {
    return (string.length > length)
        ? `${string.substring(0, length).trim()}...`
        : string
};
