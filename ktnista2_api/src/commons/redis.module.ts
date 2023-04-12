//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : redis.service.ts                                                                                                *
//* Function     : Redis service                                                                                                   *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 11/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
const client = require('../configs/redis.config');
// #endregion Import mudule

// #region Export
/**
 * Save string value to redis with key and id
 * @key primary key
 * @id base key
 * @value value to save
 */
export const setRedis = async (key: string, id: string, value: string): Promise<string | null> => {
    key = key + ':' + id;
    return new Promise((isOK, isErr) => {
        client.set(key, value, (err: Error, rs: string) => {
            return !err ? isOK(rs) : isErr(err);
        });
    });
};

/**
 * Get string value from redis
 * @param primaryKey: primary key
 * @param baseKey: base key
 */
export const getRedis = async (primaryKey: string, baseKey: string): Promise<string | null> => {
    return new Promise((isOK, isErr) => {
        client.get(primaryKey + baseKey, (err: Error, rs: string) => {
            return !err ? isOK(rs) : isErr(err);
        });
    });
};

/**
 * Get keys with key pattern
 * @param primaryKey: primary key
 */
export const getKeysRedis = async (primaryKey: string): Promise<string[]> => {
    return new Promise((isOK, isErr) => {
        return new Promise((isOK, isErr) => {
            client.keys(primaryKey + ':*', (err: Error, rs: string[]) => {
                return !err ? isOK(rs) : isErr(err);
            });
        });
    });
};

/**
 * Delete from redis with key
 * @param primaryKey: primary key
 * @param baseKey: base key
 */
export const delRedis = async (key: string, id: string): Promise<number> => {
    key = key + ':' + id;
    return new Promise((isOK, isErr) => {
        return new Promise((isOK, isErr) => {
            client.del(key, (err: Error, rs: number) => {
                return !err ? isOK(rs) : isErr(err);
            });
        });
    });
}
// #endregion

