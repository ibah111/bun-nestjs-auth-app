declare module 'bun' {
  interface Env {
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DATABASE: string;
    JWT_ACCESS_SECRET: string;
    RT_SECRET: string;
    ROUNDS: string;
  }
}
