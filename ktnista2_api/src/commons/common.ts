//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : common.js                                                                                                       *
//* Function     : Functions are shared a lot in the system                                                                        *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/18                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import module
import format from 'string-format';

import { Message, DataResponse, ErrorItem } from './types';
import MESSAGE from './message';
import DEFIND from './defind';
// #endregion Import module

// #region Exports
/// Get type of data
export const getType = (data: any): string => {
    return Object.prototype.toString.call(data).slice(8, -1);
}

/// Check field undefined, null or empty string
export const isNullOrEmpty = (data: string): boolean => {
    if (data === undefined || data === '' || data === null) {
        return true;
    }

    return false;
};

/// Check is json data
export const isJson = (data: object): boolean => {
    return Object.keys(data).length > 0;
};

/// Check user password field
export const checkPassword = (str: string): boolean => {
    let specialChars = /[`!@#$%^&*()_+\-=/[\]{};':"\\|,.<>\t/?~]/;
    let lowerCaseLetter = /[a-z]/g;
    let upperCaseLetter = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if (str.match(specialChars)?.length === 0 ||
        str.match(lowerCaseLetter)?.length === 0 ||
        str.match(upperCaseLetter)?.length === 0 ||
        str.match(numbers)?.length === 0) return false;

    return true;
}

/// Create response message body
export const createResponseMessage = (
    data: any,
    apiNm: string,
    tblNm: string,
    message: Message,
    error?: Error): DataResponse => {
    let dataResponse: DataResponse = {
        status: message.STATUS,
        message: format(message.TEXT, tblNm)
    }

    if (message.STATUS === MESSAGE.ERR_EXCEPTION.STATUS && (isNullOrEmpty(tblNm) || tblNm.indexOf('undefined') !== -1)) {
        dataResponse.message = MESSAGE.ERR_EXCEPTION_V2.TEXT;
        dataResponse.message += error !== undefined ? '(' + error?.message + ')' : '';
    }

    if (getType(data) === DEFIND.FIELD_TYPE.OBJECT || data.length > 0 || message.STATUS === 0) {
        if (Array.isArray(data)) {
            dataResponse.count = data.length;
            // If is Api GET
            if (data[0].metadata !== undefined) {
                dataResponse.count = data[0].data.length;
            }

        }

        dataResponse[apiNm] = data;
    }

    return dataResponse;
}

/// Create error response
export const createErrResponseMessage = (
    errLst: Array<ErrorItem>,
    propNm: string,
    propValue: any,
    itemNm: string,
    message: Message): Array<ErrorItem> => {
    errLst.push({
        itemName: propNm,
        itemValue: propValue,
        errCode: message.STATUS,
        errMsg: format(message.TEXT, itemNm)
    });

    return errLst;
}
// #endregion Exports