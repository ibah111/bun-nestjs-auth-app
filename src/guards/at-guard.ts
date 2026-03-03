import { node_env } from '@/main';
import { CacheService } from '@/modules/cache/cache.service';
import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { JwtPayload } from '@/types/jwt-payload.type';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private cacheService: CacheService,
    ) {
        super();
    }
    private readonly logger = new Logger(AtGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            this.logger.log('Публичный маршрут, guard пропущен');
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (node_env === 'development') {
            const TEST_DEV_TOKEN = 'qbeek-dev-test-token';
            const authHeader: string | undefined = request.headers['authorization'];

            if (authHeader === `Bearer ${TEST_DEV_TOKEN}`) {
                this.logger.warn('Использован dev-тестовый токен qbeek-dev-test-token, проверки JWT пропущены');

                const testUser: JwtPayload = {
                    user_id: 1,
                    email: 'user@example.com',
                };

                request.user = testUser;
                return true;
            }
        }

        const canActivate = await super.canActivate(context);
        if (!canActivate) {
            return false;
        }

        const user = request.user;
        console.log({ guard_user: user });

        if (user && user.jti) {
            const is_revoked = await this.cacheService.isAccessTokenRevoked(user.jti);
            if (is_revoked) {
                this.logger.log(`Обнаружен отозванный access token ${user.jti}`);
                throw new UnauthorizedException('Токен отозван');
            }
        } else {
            this.logger.log('payload не содержит jti');
        }

        return true;
    }
}
