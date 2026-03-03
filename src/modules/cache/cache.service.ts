import { DEFAULT_TTL } from "@/consts/application";
import type { CacheSetType } from "@/interface/cache.interface";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) { }

    async get(key: string) {
        if (await this.cache.get(key)) {
            return await this.cache.get(key)
        }
        throw new NotFoundException('Cache value not found');
    }

    async set(body: CacheSetType) {
        console.log(body)
        const { key, ttl, value } = body
        const effective_ttl = ttl ? ttl : DEFAULT_TTL
        await this.cache.set(key, value, effective_ttl * 1000)
        const data = await this.cache.get(key)
        return data;
    }

    async del(key: string) {
        return await this.cache.del(key)
    }

    async setRevokedAccessToken(jti: string, ttl_seconds: number): Promise<void> {
        const key = `deny:acc:${jti}`;
        await this.cache.set(key, true, ttl_seconds * 1000);
    }

    async isAccessTokenRevoked(jti: string): Promise<boolean> {
        const key = `deny:acc:${jti}`;
        const value = await this.cache.get(key);
        return value === true;
    }
}