//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : users.service.ts                                                                                                *
//* Function     : Users service                                                                                                   *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 13/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../models/index.model';
import { IUser, IUserData } from '../models/user.model';
const userDB = db.users;

import * as adminSessionService from './admin_sessions.service';
import { createResponseMessage, createErrResponseMessage, isNullOrEmpty } from '../commons/common';
import MESSAGE from '../commons/message';
import DEFINE, { CHECK_MODE } from '../commons/define';
import BaseService from './base.service';

import logger from '../commons/logger';
import { Request, Response } from 'express';
import { DataResponse, ErrorItem } from '../commons/types';
// #endregion Import mudule

// #region Export
/**
 * Users service class
 */
class UsersService extends BaseService<IUser> {
    /**
     * Check logic
     * @param data: input datda
     * @param user: user data in db
     * @returns MESSAGE.OK: no exception | exception
     */
    public checkLogic = async (data: IUserData, user: IUser): Promise<MESSAGE> => {
        try {
            let password: string | Buffer = data.password ?? '';
            if (user === undefined || !(await bcrypt.compare(password, user.password))) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(password, salt);
            }
            else {
                delete data.password;
            }

            return MESSAGE.OK;
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return MESSAGE.ERR_EXCEPTION;
        }
    }

    /**
     * Get your infomation
     * @param req: Request
     * @returns your infomation
     */
    public getYour = async (req: Request): Promise<DataResponse> => {
        let { apiName, user } = req.accessInfo;       // Get info access

        try {
            // Create request body
            req.body = {
                'users': {
                    data: [{
                            name: 'user_cd',
                            operator: '=',
                            value: user.user_cd
                        }]
                },
                'roles': { fields: { insertYmdHms: 0, updateYmdHms: 0 } }
            }

            var result = await this.getCommon(req);
            if (result.status === MESSAGE.OK.STATUS) {
                result[apiName] = result[apiName][0];
            }

            return result;
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'get ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    }

    /**
     * User login
     * @param req: http request
     * @param res: http response
     * @returns response data
     */
    public login = async (req: Request, res: Response): Promise<DataResponse> => {
        let { apiName } = req.accessInfo;                   // API name

        try {
            let { user_nm, password } = req.body[apiName];  // Request body data
            let errLst: ErrorItem[] = [];                                // Error list

            // Check input
            // let exError = checkInputCommon(apiName + '_auth', { user_nm, password }, CHECK_MODE.INSERT, errLst);
            // if (exError.STATUS !== MESSAGE.OK.STATUS) {
            //     // Create error response
            //     return createResponseMessage([], '', 'login', exError);
            // }

            // Check logic
            let users: IUser[] = [];
            if (errLst.length === 0) {
                // Get user with user_cd or email
                users = await userDB.find({ $or: [{ user_cd: user_nm }, { email: user_nm }] });
                if (users.length === 0) {
                    createErrResponseMessage(errLst, 'user_nm', user_nm, 'User code or email', MESSAGE.ERR_DATA_NO_EXIST);
                }
                else if (!(await bcrypt.compare(password, users[0].password))) {
                    createErrResponseMessage(errLst, 'password', password, 'Password', MESSAGE.ERR_INVALID_ITEM);
                }
            }

            if (errLst.length === 0) {
                let { user_cd, role } = users[0];                           // Login user info
                let timeout = process.env.ADMIN_TOKEN_TIMEOUT || 86400      // Time for token expire (second)
                // Create and assign a token
                let token = jwt.sign(
                    { user_cd, role },
                    process.env.JWT_TOKEN,
                    { expiresIn: timeout + 's' }
                );

                // Save login session
                if (!(await adminSessionService.create({ user_cd, role, token }))) {
                    return createResponseMessage([], '', 'login', MESSAGE.ERR_EXCEPTION);
                }

                // Send cookie to client
                res.cookie(DEFINE.HEADER_AUTH_NM, token,
                    { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 24 * 60 * 60 * 1000 });

                // Create success response message
                return createResponseMessage({ user_cd, role }, apiName, '', MESSAGE.LOGIN_SUCCESSFUL);
            }
            else {
                // Create error response message
                return createResponseMessage({ error: errLst }, apiName, '', MESSAGE.ERR_LOGIN_FAIL);
            }
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'login', MESSAGE.ERR_EXCEPTION);
        }
    }

    /**
     * Get refresh token
     * @param req: http request
     * @returns refresh token
     */
    public refresh_token = async (req: Request): Promise<DataResponse> => {
        try {
            let { user_cd, role } = req.accessInfo.user;                   // Get access info
            let timeout = process.env.ADMIN_R_TOKEN_TIMEOUT || 30          // Time for token expire (second)
            // Create and assign a token
            let refreshToken = jwt.sign(
                { user_cd, role },
                process.env.JWT_REFRESH_TOKEN,
                { expiresIn: timeout + 's' }
            );

            // Create response message
            return createResponseMessage(refreshToken, 'token', '', MESSAGE.REFRESH_TOKEN_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'refreshing token', MESSAGE.ERR_EXCEPTION);
        }
    }

    /**
     * User logout
     * @param req: http request
     * @param res: http response
     * @returns response data
     */
    public logout = async (req: Request, res: Response): Promise<DataResponse> => {
        let { apiName, user } = req.accessInfo;        // Get access info

        try {
            // Delete login session
            if (!(await adminSessionService.del(user.user_cd))) {
                return createResponseMessage([], apiName, 'logout', MESSAGE.ERR_EXCEPTION);
            }

            // Delete cookie of client
            res.clearCookie(DEFINE.HEADER_AUTH_NM, { httpOnly: true, sameSite: 'strict', secure: true });

            // Create response message
            return createResponseMessage({}, apiName, '', MESSAGE.LOGOUT_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'logout', MESSAGE.ERR_EXCEPTION);
        }
    }
}
// #endregion Export