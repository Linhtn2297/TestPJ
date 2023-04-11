//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : auth.middleware.ts                                                                                              *
//* Function     : Authen and authorize                                                                                            *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 11/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import module
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import * as adminSession from '../services/admin_sessions.service';
import { createResponseMessage } from '../commons/common';
import DEFINE, { ROLE_TYPE, CHECK_AUTH_TYPE } from '../commons/defind';
import MESSAGE from '../commons/message';
import { isNullOrEmpty } from '../commons/common';

import logger from '../commons/logger';
// #endregion Import module

// #region Exports
/**
 * Middleware for verify access
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    // If there was a previous error, it will be forwarded
    if (res.result?.status !== MESSAGE.OK.STATUS) {
        return next();
    }

    try {
        // Role required, authenication type
        let { requireRole, checkAuthType } = req.accessInfo;
        if (requireRole !== ROLE_TYPE.UNIDENTIFIED) {
            // Key for decode token use for authorize
            let key = process.env.JWT_REFRESH_TOKEN ?? 'KTnistaRF2023Token';
            // Get token from header
            let token = req.header(DEFINE.HEADER_AUTH_NM) ?? '';
            // If check cookie type, token will be get from cookie
            if (checkAuthType === CHECK_AUTH_TYPE.CHECK_COOKIE) {
                token = req.cookies[DEFINE.HEADER_AUTH_NM];
                // Key for decode token use for authen
                key = process.env.JWT_TOKEN ?? 'KTnista2023Token';
            }

            // Check not exist token
            if (isNullOrEmpty(token)) {
                res.result = createResponseMessage([], '', '', MESSAGE.ERR_UNAUTHORIZED);
                return next();
            }

            // Verify and check token payload
            let verified: any;
            if (requireRole >= ROLE_TYPE.USER) {
                // For users
                // Decode user access token
                verified = jwt.verify(token, key);
                // Check invalid token
                if (isNullOrEmpty(verified.user_cd)) {
                    res.result = createResponseMessage([], '', 'Token', MESSAGE.ERR_INVALID_ITEM);
                }
                else {
                    // Check user access exist
                    let sess = checkAuthType === CHECK_AUTH_TYPE.CHECK_COOKIE
                        ? await adminSession.compare(verified.user_cd, token)
                        : await adminSession.get(verified.user_cd);
                    if (sess === null) {
                        res.result = createResponseMessage([], '', '', MESSAGE.ERR_UNAUTHORIZED);
                    }
                    // Check invalid role
                    else if (sess.role < requireRole) {
                        res.result = createResponseMessage([], '', '', MESSAGE.ERR_ACCESS_DENIED);
                    }
                    else {
                        // Save user access
                        //req.accessInfo = { user: verified, ...req.accessInfo };
                    }
                }
            }
            // else {
            //     // For customers
            //     // Decode customer access token
            //     verified = jwt.verify(token, process.env.JWT_CUS_TOKEN);
            //     // Check invalid token
            //     if (isNullOrEmpty(verified.customer_cd)) {
            //         res.result = createResponseMessage([], '', 'Token', MESSAGE.ERR_INVALID_ITEM);
            //     }
            //     else {
            //         // Check customer access exist
            //         let customer = await Customer.findOne({ customer_cd: verified.customer_cd });
            //         if (customer === null) {
            //             res.result = createResponseMessage([], '', 'Customer', MESSAGE.ERR_DATA_NO_EXIST);
            //         }
            //         // Check invalid role
            //         else if (customer.role < requireRole) {
            //             res.result = createResponseMessage([], '', '', MESSAGE.ERR_ACCESS_DENIED);
            //         }
            //         else {
            //             // Save user access
            //             verified = { token, ...verified }
            //             req.access_info = { customer: verified, ...req.access_info };
            //         }
            //     }
            // }
        }
    }
    catch (err: any) {
        // Check token expire or invalid
        if (err.name == 'TokenExpiredError') {
            res.result = createResponseMessage([], '', '', MESSAGE.ERR_SESSION_EXPIRED);
        }
        else if (err.name == 'JsonWebTokenError') {
            res.result = createResponseMessage([], '', 'Token', MESSAGE.ERR_INVALID_ITEM);
        }
        else {
            logger.error(err, (new Error().stack));
            res.result = createResponseMessage([], '', 'authenticating', MESSAGE.ERR_EXCEPTION);
        }
    }

    return next();
}
// #endregion Exports