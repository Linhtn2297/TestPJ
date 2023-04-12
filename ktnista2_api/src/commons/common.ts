//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : common.ts                                                                                                       *
//* Function     : Functions are shared a lot in the system                                                                        *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import format from 'string-format';

import { DataResponse, ErrorItem } from './types';
import MESSAGE, { MSG } from './message';
import { DATA_TYPE } from './define';
// #endregion Import

// #region Export
/**
 * Get type of data
 * @param data: data to get type
 * @returns type of data as string
 */
export const getType = (data: any): string => {
    return Object.prototype.toString.call(data).slice(8, -1);
}

/**
 * Check field undefined, null or empty string
 * @param data: data to check null or empty or undefined
 * @returns true: is null or empty or undefined | false: is not
 */
export const isNullOrEmpty = (data: string | undefined): boolean => {
    if (data === undefined || data === '' || data === null) {
        return true;
    }

    return false;
};

/**
 * Check user password field
 * @param str: data to check
 * @returns true: valid password | false: invalid
 */
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

/**
 * Create response message body
 * @param data: main data
 * @param apiNm: api name
 * @param titleText: title to replace in text message
 * @param message: message
 * @param error: exception error
 * @returns data response
 */
export const createResponseMessage = (
    data: any,
    apiNm: string,
    titleText: string,
    message: MSG,
    error?: Error): DataResponse => {
    let dataResponse: DataResponse = {
        status: message.STATUS,
        message: format(message.TEXT, titleText)
    }

    if (message.STATUS === MESSAGE.ERR_EXCEPTION.STATUS && (isNullOrEmpty(titleText) || titleText.indexOf('undefined') !== -1)) {
        dataResponse.message = MESSAGE.ERR_EXCEPTION_V2.TEXT;
        dataResponse.message += error !== undefined ? '(' + error?.message + ')' : '';
    }

    if (getType(data) === DATA_TYPE.OBJECT || data.length > 0 || message.STATUS === 0) {
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

/**
 * Create error data
 * @param errLst: list error
 * @param propNm: property name
 * @param propValue: property value
 * @param itemNm: item name to replace in text message
 * @param message: message
 * @returns list error
 */
export const createErrResponseMessage = (
    errLst: Array<ErrorItem>,
    propNm: string,
    propValue: any,
    itemNm: string,
    message: MSG): Array<ErrorItem> => {
    errLst.push({
        itemName: propNm,
        itemValue: propValue,
        errCode: message.STATUS,
        errMsg: format(message.TEXT, itemNm)
    });

    return errLst;
}
// #endregion Export