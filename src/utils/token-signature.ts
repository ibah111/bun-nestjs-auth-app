import { node_env } from '@/main';
import { UnauthorizedException } from '@nestjs/common';

export const TOKEN_SIGNATURE_SUFFIX = '.bo';

export const REGIONS = ['ru', 'uk', 'eu'] as const;
export type RegionCode = typeof REGIONS[number];
export const DEFAULT_REGION: RegionCode = 'ru';

const resolveRegionSuffixLength = (region: RegionCode): number => {
    return `${TOKEN_SIGNATURE_SUFFIX}.${region}`.length;
};

export const appendTokenSignature = (
    token: string,
    region: RegionCode = DEFAULT_REGION,
): string => {
    return `${token}${TOKEN_SIGNATURE_SUFFIX}.${region}`;
};

export const normalizeSignedToken = (token: string | null | undefined): string => {
    if (!token) {
        throw new UnauthorizedException('Токен не предоставлен');
    }

    if (node_env === 'development' && token.includes('qbeek-dev-test-token')) {
        return token;
    }

    const matchedRegion = REGIONS.find((region) =>
        token.endsWith(`${TOKEN_SIGNATURE_SUFFIX}.${region}`),
    );

    if (!matchedRegion) {
        throw new UnauthorizedException('Токен не подходит по структуре к этому приложению');
    }

    return token.slice(0, -resolveRegionSuffixLength(matchedRegion));
};

