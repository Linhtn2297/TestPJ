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

// #region Import module
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import corsOptions from './configs/corsOptions.config';
import dbConnect from './configs/dbConnect.config';
import { createResponseMessage } from '../src/commons/common';
import MESSAGE from './commons/message';
import logger from './commons/logger';
// #endregion Import module

const app: Application = express();

/// DB connection
dbConnect();

/// Using body json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/// Cross origin resource sharing
app.use(cors(corsOptions));

/// Check server status
app.get('/', async (req: Request, res: Response) => {
    res.send('KTnista API server is ready!');
});

// Exception error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err, (new Error().stack));
    return res.status(500).json(createResponseMessage([], '', '', MESSAGE.ERR_EXCEPTION, err));
});

// #region Start server
const port = process.env.PORT || 10197;
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`KTnista API listening at http://localhost:${port}`);
});
// #endregion Start server

