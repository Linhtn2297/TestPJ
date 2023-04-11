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
/**
 * Write log to file
 * @param fileNm: file name
 * @param data: data to save
 */
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
/**
 * Logger class
 */
export default class {
    /**
     * Write tracking log
     * @param str: data so save
     */
    static info = async (str: string) => {
        const date = new Date();
        const fileNm = 'normalLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';
        await writeLog(fileNm, date.toUTCString() + ': ' + str + '\n');
    }

    /**
     * Write error log
     * @param err: error
     * @param stack: stack error
     */
    static error = async (err: any, stack?: string) => {
        const date = new Date();
        const mes = date.toUTCString() + ': ' + stack?.split("at ")[1] + ': ' + err.message;
        const fileNm = 'errLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';
        
        console.error(mes);
        await writeLog(fileNm, mes + '\n');
    }

    /**
     * Write debug log
     * @param requestInfo: request data
     */
    static debug = async (requestInfo: string) => {
        const date = new Date();
        const fileNm = 'errLog_' + date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear() + '.txt';

        await writeLog(fileNm, requestInfo);
    }
}
// #endregion Exports