//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : adminSession.service.js                                                                                         *
//* Function     : Admin session service                                                                                           *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/18                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import bcrypt from 'bcrypt';

import * as redis from '../commons/redis.module';
import DEFINE from '../commons/define';

import logger from '../commons/logger';
import { AdminSession } from '../commons/types';
// #endregion Import

// #region Export
/**
 * Get admin session by user_cd
 * @param user_cd: user code
 * @return admin session
 */
export const get = async (user_cd: string): Promise<AdminSession | null> => {
    try {
        // Get all data from redis base on ADMIN_SESSION_REDIS_ID and user_cd
        let sess = await redis.getRedis(DEFINE.ADMIN_SESSION_REDIS_ID, user_cd);
        if (sess !== null) {
            return JSON.parse(sess);
        }
    }
    catch (err) {
        logger.error(err, (new Error().stack));
    }

    return null;
}

/**
 * Delete all expire admin session
 * @returns true: delete success | false: delete failed
 */
export const delExpireSession = async (): Promise<boolean> => {
    try {
        // Get all key from redis base on ADMIN_SESSION_REDIS_ID
        let keys = await redis.getKeysRedis(DEFINE.ADMIN_SESSION_REDIS_ID);
        if (keys.length > 0) {
            keys.forEach(async (key: string) => {
                try {
                    let user_cd = key.split(':')[1];
                    // Get session
                    let sess = await get(user_cd);
                    if (sess !== null) {
                        // Datetime expire as milisecond
                        let expiresIn = (new Date(sess.insertYmdHms)).getTime() + Number(process.env.ADMIN_TOKEN_TIMEOUT) * 1000;
                        // Datetime now as minlisecond
                        let datetimeNow = (new Date()).getTime();

                        if (expiresIn < datetimeNow) {
                            // Delete session
                            del(user_cd);
                        }
                    }
                }
                catch (err) {
                    logger.error(err, (new Error().stack));
                }
            });
        }

        return true;
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        return false;
    }
};

/**
 * Create admin session
 * @param user_cd: user code
 * @param role: user role
 * @param token: access token
 * @return true: create success | false: create failed
 */
export const create = async (
    { user_cd, role, token }: { user_cd: string, role: number, token: string }
): Promise<boolean> => {
    try {
        // Hash token
        let salt = await bcrypt.genSalt(10);
        token = await bcrypt.hash(token?.split('.')[2], salt);
        let adminSession: AdminSession = { role, token, insertYmdHms: new Date() }
        // Save session to redis
        await redis.setRedis(DEFINE.ADMIN_SESSION_REDIS_ID, user_cd, JSON.stringify(adminSession));

        return true;
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        return false;
    }
};

/**
 * Check admin session
 * @param user_cd: user code
 * @param token: access token
 * @return admin session: same | null: not same
 */
export const compare = async (user_cd: string, token: string | undefined): Promise<AdminSession | null> => {
    try {
        if (token === undefined) return null;

        // Get session by user_cd
        let sess = await get(user_cd);
        // Check exist and compare token
        if (sess !== null && (await bcrypt.compare(token?.split('.')[2], sess.token))) {
            return sess;
        }
    }
    catch (err) {
        logger.error(err, (new Error().stack));
    }

    return null;
};

/**
 * Delete admin session
 * @param user_cd: user code
 * @return true: delete success | false: delete failed
 */
export const del = async (user_cd: string): Promise<boolean> => {
    try {
        // Delete session base on ADMIN_SESSION_REDIS_ID and user_cd
        await redis.delRedis(DEFINE.ADMIN_SESSION_REDIS_ID, user_cd);
        return true;
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        return false;
    }
}
// #endregion Exports