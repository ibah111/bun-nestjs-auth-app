import { Body, Controller, Delete, Get, Param, Post, Version } from "@nestjs/common";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CacheService } from "./cache.service";
import { CacheKeyDto, CacheSetDto } from "./cache.input";
import type { ApiResponce } from "@/types/api-responce.type";

@ApiTags('Cache')
@Controller('/cache')
export class CacheController {
    constructor(
        private readonly cacheService: CacheService
    ) { }

    @Version('1')
    @Get('/:key')
    async get(@Param() param: CacheKeyDto): Promise<ApiResponce<any>> {
        const value = await this.cacheService.get(param.key);
        return {
            success: true,
            message: 'Cache value retrieved successfully',
            data: value
        };
    }

    @Version('1')
    @Post('/:key')
    async set(@Param() { key }: CacheKeyDto, @Body() { value, ttl }: CacheSetDto): Promise<ApiResponce<any>> {
        const data = await this.cacheService.set({ key, value, ttl });
        return {
            success: true,
            message: 'Cache value set successfully',
            data
        };
    }

    @Version('1')
    @Delete('/:key')
    async del(@Param() param: CacheKeyDto): Promise<ApiResponce> {
        await this.cacheService.del(param.key);
        return {
            success: true,
            message: 'Cache value deleted successfully'
        };
    }
} 
