import type { JwtPayload } from '@/types/jwt-payload.type';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { normalizeToken } from '@/utils/token-signature';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const tokenExtractor = (req: Request): string | null => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        return null;
      }
      return normalizeToken(token);
    };
    super({
      jwtFromRequest: tokenExtractor,
      secretOrKey: (process.env.JWT_ACCESS_SECRET || 'jwt_access_secret') as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
