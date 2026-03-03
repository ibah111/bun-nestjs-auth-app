export interface IKey {
    key: string;
}

export interface ICache {
    value: any,
    ttl?: number | undefined
}

export type CacheSetType = IKey & ICache