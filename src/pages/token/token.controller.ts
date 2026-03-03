import { Controller, Post, Body, Version, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { type Request } from 'express'
import { RefreshTokenDTO } from './token.input';
import type { ApiResponce } from '@/types/api-responce.type';
import type { Tokens, JwtPayload } from '@/types/jwt-payload.type';
import { Public } from '@/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Token')
@Controller('/token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    private readonly accessToken = (req: Request): string => req.headers.authorization?.replace('Bearer ', '').trim() || '';

    @Public()
    @ApiOperation({ summary: 'Refresh token' })
    @Version('1')
    @Post('/refresh')
    async refresh(@Body() body: RefreshTokenDTO, @Req() req: Request): Promise<ApiResponce<Tokens>> {
        const userAgent = req.headers['user-agent']?.toString() || null;
        const tokens = await this.tokenService.refresh(body.refresh_token, userAgent);
        return {
            success: true,
            message: 'Tokens refreshed successfully',
            data: tokens
        };
    }

    @ApiOperation({ summary: 'Revoke current bearer token' })
    @Version('1')
    @Post('/revoke')
    async revoke(@Req() req: Request): Promise<ApiResponce> {
        await this.tokenService.revoke(this.accessToken(req));
        return {
            success: true,
            message: 'Token revoked successfully'
        };
    }

    @ApiOperation({ summary: 'Validate token', description: 'Using this endpoint for validating tokens.' })
    @ApiBearerAuth()
    @Version('1')
    @Post('/validate')
    async validate(@Req() req: Request): Promise<ApiResponce<JwtPayload>> {
        const payload = await this.tokenService.validate(this.accessToken(req));
        return {
            success: true,
            message: 'Token is valid',
            data: payload
        };
    }
}

