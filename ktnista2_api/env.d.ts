declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            DB_CONNECT: string,
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}