//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : cors_options.config.ts                                                                                           *
//* Function     : CORS setting                                                                                                    *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import cors from "cors";
import allowedOrigins from "./allowed_origins";
// #endregion Import

/**
 * Options for cors midddleware
 */
const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'KTnista-Auth-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    origin: (origin: string | undefined, callback: (error: Error | null, isOk?: boolean) => void) => {
        if (origin && allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by KTnista CORS'));
        }
    },
    optionsSuccessStatus: 200
}

/** Export default */
export default options