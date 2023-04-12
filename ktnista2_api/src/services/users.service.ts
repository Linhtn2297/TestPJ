//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : users.service.js                                                                                                *
//* Function     : Users service                                                                                                   *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/18                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../models/index.model';
const userDB = db.users;

import * as adminSessionService from './admin_sessions.service';
import { createResponseMessage, createErrResponseMessage, isNullOrEmpty } from '../commons/common';
import MESSAGE from '../commons/message';
import DEFINE, { CHECK_MODE } from '../commons/define';
const { getCommon, checkInputCommon } = require('./base.service');

import logger from '../commons/logger';
// #endregion Import mudule

// #region Exports
module.exports = {
    /// Check logic
    checkLogic: async (data, user) => {
        try {
            if (user === undefined || await bcrypt.compare(data.password, user.password)) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.password, salt);
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
    },

    /// Get your info
    getYour: async (req) => {
        try {
            let { apiName, user } = req.access_info;       // Get info access
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

            var result = await getCommon(req);
            if (result.status === MESSAGE.OK.STATUS) {
                result[apiName] = result[apiName][0];
            }

            return result;
        }
        catch (err) {
            logger.error(err, (new Error().stack), req);
            return createResponseMessage([], '', 'get ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    },

    /// User login
    login: async (req, res) => {
        try {
            let { apiName } = req.access_info;              // API name
            let { user_nm, password } = req.body[apiName];  // Request body data
            let errLst = [];                                // Error list

            // Check input
            let exError = checkInputCommon(apiName + '_auth', { user_nm, password }, CHECK_MODE.INSERT, errLst);
            if (exError.STATUS !== MESSAGE.OK.STATUS) {
                // Create error response
                return createResponseMessage([], '', 'login', exError);
            }

            // Check logic
            if (errLst.length === 0) {
                // Get user with user_cd or email
                var users = await User.find({ $or: [{ user_cd: user_nm }, { email: user_nm }] });
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
                if (!(await adminSession.create({ user_cd, role, token }))) {
                    return createResponseMessage([], '', 'login', MESSAGE.ERR_EXCEPTION);
                }

                // Send cookie to client
                res.cookie(HEADER_AUTH_NM, token,
                    { httpOnly: true, sameSite: 'Strict', secure: true, maxAge: 24 * 60 * 60 * 1000 });

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
    },

    /// Refresh token
    refresh_token: async (req) => {
        try {
            let { user_cd, role } = req.access_info.user;                  // Get access info
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
    },

    /// User logout
    logout: async (req, res) => {
        try {
            let { apiName, user } = req.access_info;        // Get access info
            // Delete login session
            if (!(await adminSession.del(user.user_cd))) {
                return createResponseMessage([], apiName, 'logout', MESSAGE.ERR_EXCEPTION);
            }

            // Delete cookie of client
            res.clearCookie(HEADER_AUTH_NM, { httpOnly: true, sameSite: 'Strict', secure: true });

            // Create response message
            return createResponseMessage({}, apiName, '', MESSAGE.LOGOUT_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'logout', MESSAGE.ERR_EXCEPTION);
        }
    }
}
// #endregion Exports