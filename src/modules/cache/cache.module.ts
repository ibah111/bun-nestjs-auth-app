import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheModule } from '@nestjs/cache-manager';
import { DEFAULT_TTL } from "@/consts/application";
import { CacheController } from "./cache.controller";

@Global()
@Module({
    controllers: [CacheController],
    providers: [CacheService],
    exports: [CacheService],
    imports: [
        CacheModule.register({
            isGlobal: true,
            host: 'localhost',
            port: 6379,
            ttl: DEFAULT_TTL * 1000
        }),
    ],
})

export class RedisCacheModule { }