interface IEnv {
    app: {
        jwt_access_secret: string,
        rt_secret: string,
        rounds: number
    },
    database: {
        host: string
        port: number
        username: string
        password: string
        database: string
    }
}

export const envConfig = (): IEnv => ({
    app: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET || 'jwt_access_secret',
        rt_secret: process.env.RT_SECRET || 'rt-secret-key-change-in-production',
        rounds: Number(process.env.ROUNDS) || 12
    },
    database: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) ?? 5432,
        username: process.env.POSTGRES_USER || 'USER',
        password: process.env.POSTGRES_PASSWORD || 'PASSWORD',
        database: process.env.POSTGRES_DATABASE || 'BASE',
    }
})