import type { ICache, IKey } from "@/interface/cache.interface";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, isNumber, ValidateIf } from 'class-validator'

export class CacheKeyDto implements IKey {

    @ApiProperty({ example: "test" })
    @IsString()
    key!: string;

}

export class CacheSetDto implements ICache {

    @ApiProperty({ example: { value: "test" } })
    value: any;

    @ApiPropertyOptional({ example: 60 })
    @ValidateIf((obj: CacheSetDto) => obj.ttl !== undefined)
    @IsNumber()
    ttl?: number | undefined;

}