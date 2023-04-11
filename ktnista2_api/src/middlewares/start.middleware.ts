//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : start.middleware.ts                                                                                             *
//* Function     : Start middleware (First processing after receiving the request)                                                 *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 10/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cron from 'node-cron';

import { AccessInfo } from "../commons/model_data";
import { API_INFO } from "../commons/defind";
import MESSAGE from '../commons/message';
import { createResponseMessage } from "../commons/common";
import logger from "../commons/logger";

// const adminSession = require('../services/admin_sessions.service');
// #endregion Import mudule

// #region Exports
/**
 * Middleware to setup some common data before to process
 * */
export default async (req: Request, res: Response, next: NextFunction) => {
    res.result = { status: MESSAGE.OK.STATUS };

    try {
        let route = req.url.split('/api')[1];
        if (route === undefined) {
            // Invalid url
            res.result = createResponseMessage([], '', '', MESSAGE.ERR_API_NOT_FOUND);
            return next();
        }
        else {
            // Override http-method
            if (req.header('Http-Method') === 'GET') {
                req.method = 'GET';
            }

            // Get require role, check body format type, check authentication type
            let accessInfo: AccessInfo = API_INFO[route][req.method];
            if (accessInfo === undefined) {
                // Not found Api
                res.result = createResponseMessage([], '', '', MESSAGE.ERR_API_NOT_FOUND);
                return next();
            }
            else {
                // Save require role and api name to access
                req.accessInfo = accessInfo;
            }
        }

        // Start mongoose session DB
        let session = await mongoose.startSession();
        session.startTransaction();
        req.session = session;

        // // Create cron job to delete expire login session
        // if (global.cronJobDelLoginSession === undefined) {
        //     global.cronJobDelLoginSession = 'Start';
        //     cron.schedule('00 00 * * 1', () => {
        //         adminSession.delExpireSession();
        //     });
        //     // stop cron job https://stackoverflow.com/questions/53684668/how-to-stop-a-node-cron-job
        // }
    }
    catch (err: any) {
        logger.error(err, (new Error().stack));
        res.result = createResponseMessage([], '', '', MESSAGE.ERR_EXCEPTION);
    }

    return next();
}
// #endregion Exports