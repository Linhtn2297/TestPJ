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