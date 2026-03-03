export interface IRTCreate {
    user_id: number,
    token_hash: string,
    expires_at: Date,
    user_agent?: string | null,
    ip_address?: string | null,
}