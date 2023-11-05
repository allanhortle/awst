export function sortBy<T>(
    array: T[],
    predicate: (item: T) => string | number | boolean | Date,
    descending = false
): T[] {
    return [...array].sort((aa, bb) => {
        const aValue = descending ? predicate(bb) : predicate(aa);
        const bValue = descending ? predicate(aa) : predicate(bb);
        if (typeof aValue === 'number' && typeof bValue === 'number') return aValue - bValue;
        return String(aValue).localeCompare(String(bValue));
    });
}
