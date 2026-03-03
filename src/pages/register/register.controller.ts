import { Controller, Post, Body, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { RegisterDto } from './register.dto';
import { Public } from '@/decorators/public.decorator';
import { ApiResponce } from '@/types/api-responce.type';
import { User } from '@/databases/postgresql/models/user.model';

@ApiTags('Register')
@Controller('/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @ApiOperation({ summary: 'Register new User' })
  @Public()
  @Version('1')
  @Post('/')
  async register(@Body() body: RegisterDto): Promise<ApiResponce<User>> {
    return await this.registerService.register(body);
  }
}

