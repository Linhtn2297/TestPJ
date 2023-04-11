declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            DB_CONNECT: string,
            REDIS_URL: string,
            NODE_ENV: 'development' | 'production'
        };
    };

    var cronJobDelLoginSession: string
}

export {}