import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@/databases/postgresql/repositories/user.repository';
import { HashService } from '@/modules/hash/hash.service';
import type { Tokens } from '@/types/jwt-payload.type';
import type { ILogin } from '@/interface/login.interface';
import type { ApiResponce } from '@/types/api-responce.type';
import { TokenService } from '../token/token.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) { }

  public async login({ email, password }: ILogin, user_agent?: string | null): Promise<ApiResponce<Tokens>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const is_password_valid = await this.hashService.compare(
      password,
      user.password_hash,
    );

    if (!is_password_valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.tokenService.generateTokens(user.id!, user.email, user_agent);

    return {
      success: true,
      message: 'Login successfully',
      data: tokens
    }
  }

  public async deactivate(id: string): Promise<ApiResponce> {
    return {
      success: true,
      message: 'Deactivate logic is empty'
    }
  }
}

