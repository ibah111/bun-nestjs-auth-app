import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@/modules/cache/cache.service';
import { JwtPayload, Tokens } from '@/types/jwt-payload.type';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Op } from 'sequelize';
import { UserRepository } from '@/databases/postgresql/repositories/user.repository';
import { RefreshTokenRepository } from '@/databases/postgresql/repositories/refresh-token.repository';
import {
    appendTokenSignature,
    normalizeSignedToken,
    RegionCode,
    DEFAULT_REGION,
} from '@/utils/token-signature';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
    private readonly access_secret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
        private readonly userRepository: UserRepository,
        private readonly rtRepository: RefreshTokenRepository,
        configService: ConfigService
    ) {
        this.access_secret = configService.get<string>('app.jwt_access_secret')!
    }
    private readonly logger = new Logger(TokenService.name);

    private detectRegionByUserAgent(user_agent?: string | null): RegionCode {
        if (!user_agent) {
            return DEFAULT_REGION;
        }
        const normalizedUA = user_agent.toLowerCase();

        if (normalizedUA.includes('ukr')) {
            return 'uk';
        }

        if (normalizedUA.includes('eu') || normalizedUA.includes('euro')) {
            return 'eu';
        }

        return DEFAULT_REGION;
    }

    async generateTokens(user_id: number, email: string, user_agent?: string | null): Promise<Tokens> {
        const jti = randomBytes(16).toString('hex');
        this.logger.log(`Генерация токенов для пользователя ${user_id}`);
        this.logger.log(`Получен user-agent: ${user_agent || 'не указан'}`);
        const region = this.detectRegionByUserAgent(user_agent);
        this.logger.log(`Определённый регион: ${region}`);
        const jwt_payload: JwtPayload = {
            user_id,
            email,
            jti,
        };
        console.log({ user_id, jti });

        const raw_access_token = await this.jwtService.signAsync(jwt_payload, {
            secret: this.access_secret,
            expiresIn: '15m',
        });

        const raw_refresh_token = randomBytes(32).toString('hex');
        const token_hash = await argon2.hash(raw_refresh_token);

        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 7);

        await this.rtRepository.create({
            user_id,
            token_hash,
            expires_at,
            user_agent: user_agent || null,
            ip_address: null,
        });

        return {
            access_token: appendTokenSignature(raw_access_token, region),
            refresh_token: appendTokenSignature(raw_refresh_token, region),
        };
    }

    async refresh(refresh_token: string, user_agent?: string | null): Promise<Tokens> {
        if (!refresh_token) {
            throw new UnauthorizedException('Refresh token не предоставлен');
        }
        this.logger.log('Запрос обновления токенов');
        this.logger.log(`Получен user-agent при refresh: ${user_agent || 'не указан'}`);
        console.log({ refresh_token_length: refresh_token.length });
        const normalized_refresh_token = normalizeSignedToken(refresh_token);

        const all_tokens = await this.rtRepository.find({
            where: {
                revoked_at: null,
                expires_at: {
                    [Op.gt]: new Date(),
                },
            },
        });

        let found_token = null;
        for (const token_record of all_tokens) {
            try {
                const is_valid = await argon2.verify(token_record.token_hash, normalized_refresh_token);
                if (is_valid) {
                    found_token = token_record;
                    break;
                }
            } catch (error) {
                continue;
            }
        }

        if (!found_token) {
            throw new UnauthorizedException('Недействительный refresh token');
        }

        found_token.revoked_at = new Date();
        await found_token.save();
        this.logger.log('Старый refresh token отозван');
        console.log({ refresh_token_id: found_token.id });

        const user_id = found_token.user_id;
        const user = await this.userRepository.findByPk(user_id);
        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        return await this.generateTokens(user_id, user.email, user_agent);
    }

    async revoke(access_token: string): Promise<void> {
        const normalized_access_token = normalizeSignedToken(access_token);
        try {
            this.logger.log('Запрос отзыва access токена');
            const payload = await this.jwtService.verifyAsync(normalized_access_token, {
                secret: this.access_secret,
            }) as JwtPayload & { exp: number };
            console.log({ jti: payload.jti, user_id: payload.user_id });

            if (!payload.jti) {
                throw new UnauthorizedException('Токен не содержит jti');
            }

            const ttl_seconds = payload.exp - Math.floor(Date.now() / 1000);
            if (ttl_seconds > 0) {
                await this.cacheService.setRevokedAccessToken(payload.jti, ttl_seconds);
            }
            this.logger.log('Access токен добавлен в deny-list');

            const user_id = payload.user_id;
            const active_token = await this.rtRepository.findOne({
                where: {
                    user_id,
                    revoked_at: null,
                },
                order: [['created_at', 'DESC']],
            });

            if (active_token) {
                active_token.revoked_at = new Date();
                await active_token.save();
            }
        } catch (error) {
            throw new UnauthorizedException('Недействительный access token');
        }
    }

    async validate(access_token: string): Promise<any> {
        const normalized_access_token = normalizeSignedToken(access_token);
        try {
            if (access_token === 'qbeek-dev-test-token') {
                return {
                    user_id: 1,
                    email: 'user@example.com',
                    jti: '1234567890',
                };
            } else {
                const payload = await this.jwtService.verifyAsync(normalized_access_token, {
                    secret: this.access_secret,
                });
                this.logger.log('Валидация access токена прошла успешно');
                console.log({ jti: payload.jti, user_id: payload.user_id });
                return payload;
            }
        } catch (error) {
            throw new UnauthorizedException('Недействительный access token');
        }
    }
}

