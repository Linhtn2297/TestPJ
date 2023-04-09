//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : logger.ts                                                                                                       *
//* Function     : Write log system                                                                                                *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import fs from 'fs';
// #endregion Import mudule

// #region Functions
const writeLog = async (fileNm: string, data: string) => {
    if (fs.existsSync('./log/' + fileNm)) {
        await fs.appendFile('./log/' + fileNm, data, (err) => {
            if (err) throw err;
        });
    } else {
        await fs.writeFile('./log/' + fileNm, data, (err) => {
            if (err) throw err;
        });
    }
}
// #endregion Functions

// #region Exports
export default class {
    static info = async (str: string) => {
        const date = new Date();
        const fileNm = 'normalLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';
        await writeLog(fileNm, date.toUTCString() + ': ' + str + '\n');
    }

    static error = async (err: Error, stack?: string) => {
        const date = new Date();
        const mes = date.toUTCString() + ': ' + stack?.split("at ")[1] + ': ' + err.message;
        const fileNm = 'errLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';
        
        console.error(mes);
        await writeLog(fileNm, mes + '\n');
    }

    static debug = async (requestInfo: string) => {
        const date = new Date();
        const fileNm = 'errLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';

        await writeLog(fileNm, requestInfo);
    }
}
// #endregion Exports