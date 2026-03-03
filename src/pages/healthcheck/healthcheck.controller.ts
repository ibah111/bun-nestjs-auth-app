import { Controller, Get, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthcheckService } from './healthcheck.service';
import { Public } from '@/decorators/public.decorator';
import type { ApiResponce } from '@/types/api-responce.type';

@ApiTags('Healthcheck')
@Controller('/healthcheck')
export class HealthcheckController {
    constructor(private readonly healthcheckService: HealthcheckService) { }

    @ApiOperation({ summary: 'Application healthcheck' })
    @Public()
    @Version('1')
    @Get('/')
    async getHealthcheck(): Promise<ApiResponce<any>> {
        return await this.healthcheckService.getHealthcheck();
    }
}

