export function keyBy<T extends Record<string, any>, Q extends keyof T>(objects: readonly T[], key: Q)
: Record<T[Q], T> {
    return objects
        .reduce((acc, v) => {
            acc[v[key]] = v;
            return acc;
        }, {} as Record<T[typeof key], T>);
}
