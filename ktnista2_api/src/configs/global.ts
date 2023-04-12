declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            DB_CONNECT: string,
            REDIS_URL: string,
            JWT_TOKEN: string,
            JWT_REFRESH_TOKEN: string,
            NODE_ENV: 'development' | 'production'
        }
    }

    var isStartCronJobDelLoginSession: boolean;
}

export { }