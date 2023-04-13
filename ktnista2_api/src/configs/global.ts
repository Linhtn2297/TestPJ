//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : global.ts                                                                                                       *
//* Function     : Declare some global data                                                                                        *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 11/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /** Port to open server */
            PORT: number,
            /** Database connection string */
            DB_CONNECT: string,
            /** Redis connection url */
            REDIS_URL: string,
            /** Jsonwebtoken key */
            JWT_TOKEN: string,
            /** Token timeout */
            ADMIN_TOKEN_TIMEOUT: number,
            /** Jsonwebtoken refresh key */
            JWT_REFRESH_TOKEN: string,
            /** Refresh token timeout */
            ADMIN_R_TOKEN_TIMEOUT: number,
            /** environment */
            NODE_ENV: 'development' | 'production'
        }
    }

    /** Is start cron job to delete login session */
    var isStartCronJobDelLoginSession: boolean;
}

export { }