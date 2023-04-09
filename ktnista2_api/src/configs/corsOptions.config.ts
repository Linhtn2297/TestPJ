//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : corsOptions.config.ts                                                                                           *
//* Function     : CORS setting                                                                                                    *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import module
import cors from "cors";
import allowedOrigins from "./allowedOrigins";
// #endregion Import module

// options for cors midddleware
const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    //credentials: true,
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

// #region Exports
export default options
// #endregion Exports