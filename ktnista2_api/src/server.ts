//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : servier.ts                                                                                                      *
//* Function     : Server setup                                                                                                    *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 08/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import express, { Request, Response, NextFunction, Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import start from './middlewares/start.middleware';
import auth from './middlewares/auth.middleware';
import checkBody from './middlewares/base.middleware';
import end from './middlewares/end.middleware';
import corsOptions from './configs/cors_options.config';
import dbConnect from './configs/db_connect.config';
import { createResponseMessage } from '../src/commons/common';
import MESSAGE from './commons/message';
import logger from './commons/logger';
// #endregion Import

/** Express application */
const app: Application = express();

/** DB connection */
dbConnect();

/** Check server status */
app.get('/', async (req: Request, res: Response) => {
    return res.send(createResponseMessage([], '', '', MESSAGE.SERVER_READY));
});

//#region Add middleware to pipeline
/** Using body json */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Cross origin resource sharing */
app.use(cors(corsOptions));

/** Setup some common data before to process */
app.use(start);

/** Add authen and authorize middleware */
app.use(auth);

/** Add check body format */
app.use(checkBody);

/** Exception error */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err, (new Error().stack));
    res.result = createResponseMessage([], '', '', MESSAGE.ERR_EXCEPTION, err);
    next();
});

/** Setup some data before send to client */
app.use(end);
//#endregion  Add middleware to pipeline

/** Start server */
const port = process.env.PORT || 10197;
app.listen(port, '0.0.0.0', () => {
    console.log(`KTnista API listening at http://localhost:${port}`);
});

