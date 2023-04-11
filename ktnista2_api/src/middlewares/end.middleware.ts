//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : end.middleware.ts                                                                                               *
//* Function     : End middleware (End processing before send the response)                                                        *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 11/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import { NextFunction, Request, Response } from 'express';
import MESSAGE from '../commons/message';
import { createResponseMessage } from '../commons/common';

import logger from '../commons/logger';
// #endregion Import mudule

// #region Exports
/**
 * Middleware for finish, setup some data before send to client
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        let status = res.result?.status || 500;
        if (!req.session?.hasEnded) {
            if (status === MESSAGE.OK.STATUS) {
                // Commit to change mongo db
                await req.session?.commitTransaction();
            }
            else {
                // Rollback
                await req.session?.abortTransaction();
            }

            // Finish mongoose session
            req.session?.endSession();
            req.session = null;
        }

        // Write request log if exception
        if (status === 500) {
            var requestInfo = 'Headers: ' + JSON.stringify(req.headers) + '\n' + 'Body: ' + JSON.stringify(req.body) + '\n';
            logger.debug(requestInfo);
        }

        // Send to client
        status = status != 0 && status <= 500 ? status : 200;
        res.status(status).send(res.result);
        res.result = null;
    }
    catch (err: any) {
        logger.error(err, (new Error().stack));
        res.status(500).send(createResponseMessage([], '', '', MESSAGE.ERR_EXCEPTION));
    }

    next();
}
// #endregion Exports