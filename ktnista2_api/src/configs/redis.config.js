//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : redis.config.js                                                                                                 *
//* Function     : Redis connection                                                                                                *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 11/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************
'use strict';

/** Import mudule  */
const { createClient } = require('redis');

/** Create redis client */
const redisClient = createClient({ url: String(process.env.REDIS_URL) });

/** Test ping to redis server */
redisClient.ping((err, result) => console.log(result));

/** Check success connect */
redisClient.on('connect', () => {
    console.log('Redis client connected!');
});

/** Check error connect */
redisClient.on('error', (err) => { console.error(err) });

/** Exports */
module.exports = redisClient;