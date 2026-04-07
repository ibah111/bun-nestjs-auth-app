import { UnauthorizedException } from '@nestjs/common';

const LEGACY_TOKEN_SUFFIX_PATTERN = /\.bo\.[a-z]{2}$/i;

export const normalizeToken = (token: string | null | undefined): string => {
    if (!token) {
        throw new UnauthorizedException('Токен не предоставлен');
    }
    return token.replace(LEGACY_TOKEN_SUFFIX_PATTERN, '');
};

