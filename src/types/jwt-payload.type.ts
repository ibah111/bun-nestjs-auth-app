export type JwtPayload = {
    user_id: number,
    email: string,
    jti?: string
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export interface IAT {
    access_token: string
}

export interface IRT {
    refresh_token: string
}

export type Tokens = IAT & IRT