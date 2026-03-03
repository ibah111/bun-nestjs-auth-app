import { Controller, Post, Patch, Body, Version, Headers, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';
import type { ApiResponce } from '@/types/api-responce.type';
import type { JwtPayload, Tokens } from '@/types/jwt-payload.type';
import { Public } from '@/decorators/public.decorator';
import type { Request } from 'express';

@ApiTags('Login')
@Controller('/login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @ApiOperation({
        summary: 'User Log in ',
        description: 'Enter login + password, to get access + refresh tokens'
    })
    @Public()
    @Version('1')
    @Post('/')
    async login(@Body() body: LoginDto, @Req() req: Request): Promise<ApiResponce<Tokens>> {
        const userAgent = req.headers['user-agent']?.toString() || null;
        return await this.loginService.login(body, userAgent);
    }

    @ApiOperation({
        deprecated: true
    })
    @Version('1')
    @Patch('/deactivate')
    async deactivate(@Body() body: { id: string }): Promise<ApiResponce> {
        return await this.loginService.deactivate(body.id);
    }
}

