//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : base.service.js                                                                                                 *
//* Function     : Functions are shared in services                                                                                *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/18                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import format from 'string-format';
import db from "../models/index.model";

import { getType, createResponseMessage, createErrResponseMessage, isNullOrEmpty, checkPassword } from "../commons/common";
import MESSAGE from "../commons/message";
import DEFINE, {CHECK_MODE, ROLE_TYPE, DATA_TYPE, DEL_FG} from "../commons/define";

import logger from "../commons/logger";
import { IHatu } from "../models/hatu.model";
import { ErrorItem } from "../commons/types";

const ObjectId = mongoose.Types.ObjectId;
const hatuDB = db.hatus;
// #endregion Import mudule

// #region Fuctions
/// Date insert/update datetime for data before save to db
const addDateTime = (data: any, kb: CHECK_MODE, date: Date) => {
    if (kb === CHECK_MODE.INSERT) data.insertYmdHms = date;
    data.updateYmdHms = date;

    return data;
}

/// Map Data
const filterData = (objSrc: any, objPrototype: any) => {
    try {
        Object.keys(objSrc).map((key) => {
            if (objPrototype[key] === undefined) {
                delete objSrc[key];
            }
        });
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        throw err;
    }
}

/// Generate code
const genCd = async (key_nm: string, cdBase: string, cdLength: number, session: mongoose.mongo.ClientSession) => {
    // Code number
    let cdNo = 0;

    // Get user code number
    let hatu: IHatu = await hatuDB.findOne({ key_nm }).session(session);
    if (hatu !== null) {
        cdNo = hatu.key_value;
        // Update new code number (after generate)
        await hatuDB.findOneAndUpdate({ key_nm }, { key_value: ++cdNo }, { session })
    }
    else {
        // Save code number (after generate)
        let hatuInsert = new hatuDB({ key_nm, key_value: ++cdNo });
        await hatuInsert.save({ session });
    }

    // Number of zeros
    let freeLength = cdLength - cdBase.length - cdNo.toString().length;
    let zeroStr = '';

    for (var i = 0; i < freeLength; i++) {
        zeroStr += '0';
    }

    return cdBase + zeroStr + cdNo;
}

/// Get primary key
const getPrimaryKey = (tableNm: string) => {
    // Input prototype for check
    let inputProto = DEFINE.INPUT_VALIDATE_PROTOTYPE[tableNm];
    // Get fields prototype
    let fields = Object.getOwnPropertyNames(inputProto);
    for (let i = 0; i < fields.length; i++) {
        let fieldDBNm = fields[i];                  // field in db name
        if (inputProto[fieldDBNm].isPrimaryKey === true) {
            return fieldDBNm;
        }
    }

    return null;
}

/// Common input check
const checkInputCommon = (apiName: string, data: any, kb: CHECK_MODE, errLst: ErrorItem[]) => {
    try {
        // Input prototype for check
        let inputProto = DEFINE.INPUT_VALIDATE_PROTOTYPE[apiName];
        // Get fields prototype
        let fields = Object.getOwnPropertyNames(inputProto);

        // Check fields
        for (let i = 0; i < fields.length; i++) {
            let fieldDBNm = fields[i];                  // field in db name
            let fieldProto = inputProto[fieldDBNm];     // field prototype for check
            let fieldViewNm = fieldProto.name;          // field name for view
            let fieldValue = data[fieldDBNm];           // field value from input
            let error = MESSAGE.OK;

            /// Check input
            // Check primary key is required
            if (fieldProto.isPrimaryKey === true && isNullOrEmpty(fieldValue)) {
                error = MESSAGE.ERR_IS_REQUIRED;
            }
            else if (kb === CHECK_MODE.INSERT || (kb === CHECK_MODE.UPDATE && fieldValue !== undefined)) {
                // Check field required
                if (fieldProto.isRequired === true && isNullOrEmpty(fieldValue)) {
                    error = MESSAGE.ERR_IS_REQUIRED;
                }
                // Check value
                else if (fieldValue !== undefined) {
                    // #region Check string field
                    if (fieldProto.isString === true) {
                        // Check type
                        if (getType(fieldValue) !== DATA_TYPE.STRING) {
                            error = MESSAGE.ERR_INVALID_ITEM;
                        }
                        // Check min length
                        else if (fieldProto.minLength !== undefined && fieldValue.length < fieldProto.minLength) {
                            error = {
                                STATUS: MESSAGE.ERR_MIN_LENGTH.STATUS,
                                TEXT: format(MESSAGE.ERR_MIN_LENGTH.TEXT, fieldViewNm, fieldProto.minLength)
                            };
                        }
                        // Check max length
                        else if (fieldProto.maxLength !== undefined && fieldValue.length > fieldProto.maxLength) {
                            error = {
                                STATUS: MESSAGE.ERR_MAX_LENGTH.STATUS,
                                TEXT: format(MESSAGE.ERR_MAX_LENGTH.TEXT, fieldViewNm, fieldProto.maxLength)
                            };
                        }
                        else {
                            // Check special field
                            let isInvalidItem = (fieldProto.isNotContainSpacialChar === true && !fieldValue.isNotContainSpecialChar()) ||
                                (fieldProto.isEmail === true && !fieldValue.isEmail());
                            if (isInvalidItem) {
                                error = MESSAGE.ERR_INVALID_ITEM;
                            }
                            // Check password field
                            else if (fieldProto.isPassword === true && !checkPassword(fieldValue)) {
                                error = MESSAGE.ERR_INVALID_PASSWORD;
                            }
                        }
                    }
                    // #endregion Check string field
                    // #region Check number field
                    else if (fieldProto.isNumber === true) {
                        // Check type
                        if (getType(fieldValue) !== DATA_TYPE.NUMBER) {
                            error = MESSAGE.ERR_INVALID_ITEM;
                        }
                        // Check min value
                        else if (fieldProto.minValue !== undefined && fieldValue < fieldProto.minValue) {
                            error = {
                                STATUS: MESSAGE.ERR_MIN_VALUE.STATUS,
                                TEXT: format(MESSAGE.ERR_MIN_VALUE.TEXT, fieldViewNm, fieldProto.minValue)
                            };
                        }
                        // Check max value
                        else if (fieldProto.maxValue !== undefined && fieldValue > fieldProto.maxValue) {
                            error = {
                                STATUS: MESSAGE.ERR_MAX_VALUE.STATUS,
                                TEXT: format(MESSAGE.ERR_MAX_VALUE.TEXT, fieldViewNm, fieldProto.maxValue)
                            };
                        }
                    }
                    // #endregion Check number field
                }
            }

            if (error.STATUS !== MESSAGE.OK.STATUS) {
                createErrResponseMessage(errLst, fieldDBNm, fieldValue, fieldViewNm, error);
            }
        }

        return MESSAGE.OK
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        return MESSAGE.ERR_EXCEPTION;
    }
}

/// Common logic check
const checkLogicCommon = async (apiName: string, tableName: string, dataInput: any, kb: CHECK_MODE,
    errLst: ErrorItem[], privateCheck: any, session: mongoose.mongo.ClientSession) => {
    try {
        // Input prototype for check
        let inputProto = DEFINE.LOGIC_VALIDATE_PROTOTYPE[apiName];
        // Get fields prototype
        let fields = Object.getOwnPropertyNames(inputProto);

        // Check fields
        for (let i = 0; i < fields.length; i++) {
            let fieldDBNm = fields[i];                  // field in db name
            let fieldProto = inputProto[fieldDBNm];     // field prototype for check
            let fieldViewNm = fieldProto.name;          // field name for view
            let fieldValue = dataInput[fieldDBNm];           // field value from input
            let error = MESSAGE.OK;
            // Param for query
            let param: any = {};
            param[fieldDBNm] = fieldValue;

            /// Check logic
            if (fieldProto.isPrimaryKey === true) {
                // Get data by primary key
                var dataByKey = await db[tableName].findOne(param).session(session);
                if (kb === CHECK_MODE.INSERT) {
                    if (dataByKey !== null) {
                        error = MESSAGE.ERR_DATA_EXIST;
                    }
                }
                else if (dataByKey === null) {
                    error = MESSAGE.ERR_DATA_NO_EXIST;
                }
            }
            else if (kb !== CHECK_MODE.DELETE) {
                if (fieldProto.isUnique === true) {
                    // Get data by uniq key
                    let record = await db[tableName].findOne(param).session(session);
                    if (record !== null && (kb === CHECK_MODE.INSERT || (dataByKey !== null && dataByKey[fieldDBNm] !== fieldValue))) {
                        error = MESSAGE.ERR_DATA_EXIST;
                    }
                }
                else if (fieldProto.foreignField !== undefined) {
                    let { tableNm, fieldNm } = fieldProto.foreignField;
                    // Create param for query
                    param = {};
                    param[fieldNm] = fieldValue;

                    // Get data by foreign key
                    let record = await db[tableNm].findOne(param).session(session);
                    if (record === null) {
                        error = MESSAGE.ERR_DATA_NO_EXIST;
                    }
                }
            }

            if (error.STATUS !== MESSAGE.OK.STATUS) {
                // Create error list
                createErrResponseMessage(errLst, fieldDBNm, fieldValue, fieldViewNm, error);
            }
        }


        // Private check
        if (errLst.length === 0) {
            if (privateCheck !== undefined) {
                let exErr = await privateCheck(dataInput, dataByKey, errLst);
                if (exErr.STATUS !== MESSAGE.OK.STATUS) {
                    return MESSAGE.ERR_EXCEPTION;
                }
            }

            if (!isNullOrEmpty(dataByKey)) filterData(dataInput, dataByKey.toJSON());
        }

        return MESSAGE.OK
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        return MESSAGE.ERR_EXCEPTION;
    }
}

/// Create query to get data from db
const createQuery = (data: any, role: ROLE_TYPE) => {
    let query = {};
    if (data !== undefined) {
        data.forEach(dt => {
            let { name, operator, value } = dt;
            if (name === '_id') {
                // Reformat _id as ObjectId
                value = ObjectId(value);
            }

            if (name.indexOf('YmdHms') !== -1) {
                // Reformat datetime field as Date format
                value = new Date(value);
            }

            // Add del_fg = 0 to get data exist logic if not a super admin
            if (role !== ROLE_TYPE.SUPER_ADMIN && name === 'del_fg' && value === DEL_FG.DELETED) {
                value = DEL_FG.INVALID;
            }

            // Create query
            switch (operator) {
                case '=': query[name] = value; break;
                case '>': query[name] = { $gt: value }; break;
                case '>=': query[name] = { $gte: value }; break;
                case '<': query[name] = { $lt: value }; break;
                case '<=': query[name] = { $lte: value }; break;
                case 'in': query[name] = { $in: value }; break;
                default:
                    if (value[value.length - 1] === '%' && value[0] === '%') {
                        query[name] = new RegExp(`${value.slice(1, value.length - 1)}`);
                    }
                    else if (value[value.length - 1] === '%') {
                        query[name] = new RegExp(`^${value.slice(0, value.length - 1)}`);
                    }
                    else if (value[0] === '%') {
                        query[name] = new RegExp(`${value.slice(1, value.length)}$`);
                    }
                    else {
                        query[name] = value;
                    }
            }
        });
    }

    // Add del_fg = 0 to get data exist logic if not a super admin
    if (role !== ROLE_TYPE.SUPER_ADMIN && Object.getOwnPropertyNames(query).indexOf('del_fg') === -1) {
        query['del_fg'] = DEL_FG.EXIST;
    }

    return query;
}

/// Create aggregate query
const createAggregate = async (tableNm, body, role, pipeline) => {
    let parentData = body[tableNm];
    if (parentData !== undefined) {
        let { data, sort, fields, limit, offset } = parentData;
        pipeline.push({ $match: createQuery(data, role) });

        // Offset
        let dataFilter = [{ $skip: offset !== undefined ? offset : 0 }];

        // Limit
        if (limit !== undefined) {
            dataFilter.push({ $limit: limit });
        }

        // Sort
        if (limit !== undefined) {
            dataFilter.push({ $sort: sort });
        }

        // Fields in record
        if (fields !== undefined) {
            pipeline.push({ $project: fields });
        }

        // Get relate table
        let relateTables = REQUEST_GET_PROTOTYPE[tableNm].relateTables;
        relateTables.forEach(rTbl => {
            // Create child aggregate query
            let childPipeline = [];
            createAggregate(rTbl.tableNm, body[tableNm], role, childPipeline);
            if (childPipeline.length > 0) {
                pipeline.push({
                    $lookup: {
                        from: rTbl.tableNm,
                        localField: rTbl.localField,
                        foreignField: rTbl.foreignField,
                        as: rTbl.tableNm,
                        pipeline: childPipeline
                    }
                });
            }
        });

        // Count total, set offset, limit, sort
        pipeline.push({ $facet: { metadata: [{ $count: 'total' }], data: dataFilter } });
    }
}
// #endregion Fuctions

// #region Exports
module.exports = {
    /// Check input common
    checkInputCommon,
    /// Check child body format
    checkChildBody: (body) => {
        if (!Array.isArray(body)) {
            return false;
        }

        if (body.length > 1) {
            for (var i = 0; i < body.length; i++) {
                if (body[i].no === undefined || body[i].no !== i + 1) {
                    return false;
                }
            }
        }

        return true;
    },

    /// Common get service
    getCommon: async (req) => {
        try {
            var { apiName, tableName, user } = req.access_info;     // API name
            // Create aggregate query
            let aggregate = [];
            createAggregate(tableName, req.body, user.role, aggregate);
            // Get data
            let data = await db[tableName].aggregate(aggregate);

            // Create response message
            return createResponseMessage(data, apiName, '', MESSAGE.GET_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'get ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    },

    /// Common create service
    createCommon: async (req) => {
        try {
            var { apiName, tableName } = req.access_info;     // API name
            let inputData = req.body[apiName];     // Data from request
            let date = new Date();                 // Datetime now
            let resultData = [];                   // Successful data response
            let errData = [];                      // Fail data response
            let exError = MESSAGE.OK;              // Exception error

            for (let i = 0; i < inputData.length; i++) {
                let errLst = [];
                let dataInput = inputData[i];
                // Generate code
                switch (apiName) {
                    case 'users':
                        dataInput.user_cd = await genCd('user_cd', USR_CD_BASE, USR_CD_LENGTH, req.session);
                        break;
                }

                // Check input
                exError = checkInputCommon(apiName, dataInput, CHECK_MODE.INSERT, errLst);
                if (exError.STATUS !== MESSAGE.OK.STATUS) {
                    // Create error response
                    return createResponseMessage([], '', 'create ' + apiName, exError);
                }

                // Check logic
                if (errLst.length === 0) {
                    exError = await checkLogicCommon(apiName, tableName, dataInput, CHECK_MODE.INSERT, errLst, req.check, req.session);
                    if (exError.STATUS !== MESSAGE.OK.STATUS) {
                        // Create error response
                        return createResponseMessage([], '', 'create' + apiName, exError);
                    }
                }

                if (errLst.length > 0) {
                    // Add error to list
                    errData.push({ 'no': i + 1, 'error': errLst });
                }
                else if (errData.length === 0) {
                    // Add insert, update time
                    addDateTime(dataInput, CHECK_MODE.INSERT, date);

                    // Insert to db
                    dataInput = new db[tableName](dataInput);
                    dataInput = await dataInput.save({ session: req.session });

                    // Handle data for response
                    dataInput = dataInput.toJSON();
                    dataInput = { no: i + 1, ...dataInput };

                    if (apiName === 'users' || apiName === 'customers') {
                        // Clear password
                        dataInput.password = '**********';
                    }

                    // Add to list for response
                    resultData.push(dataInput);
                }
            }

            if (errData.length > 0) {
                // Create error response
                return createResponseMessage(errData, apiName, apiName, MESSAGE.ERR_INSERT_FAIL);
            }

            // Create success response
            return createResponseMessage(resultData, apiName, apiName.capitalize(), MESSAGE.CREATE_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'create ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    },

    /// Common update service
    updateCommon: async (req) => {
        try {
            var { apiName, tableName } = req.access_info;     // API name
            let inputData = req.body[apiName];     // Data from request
            let date = new Date();                 // Datetime now
            let resultData = [];                   // Successful data response
            let errData = [];                      // Fail data response
            let exError = MESSAGE.OK;              // Exception error

            for (let i = 0; i < inputData.length; i++) {
                let errLst = [];                   // Error list
                let dataInput = inputData[i];

                // Check input
                exError = await checkInputCommon(apiName, dataInput, CHECK_MODE.UPDATE, errLst);
                if (exError.STATUS !== MESSAGE.OK.STATUS) {
                    // Create error response
                    return createResponseMessage([], '', 'update ' + apiName, exError);
                }

                // Check logic
                if (errLst.length === 0) {
                    exError = await checkLogicCommon(apiName, tableName, dataInput, CHECK_MODE.UPDATE, errLst, req.check, req.session);
                    if (exError.STATUS !== MESSAGE.OK.STATUS) {
                        // Create error response
                        return createResponseMessage([], '', 'update ' + apiName, exError);
                    }
                }

                if (errLst.length > 0) {
                    errData.push({
                        'no': i + 1,
                        'error': errLst
                    });
                }
                else if (errData.length === 0) {
                    // Add insert, update time
                    addDateTime(dataInput, CHECK_MODE.UPDATE, date);

                    // Get primary key to update
                    let primaryKey = await getPrimaryKey(apiName);
                    // Query for find record update
                    let param = {};
                    param[primaryKey] = dataInput[primaryKey];

                    // Update to db
                    await db[tableName].findOneAndUpdate(param, dataInput, { session: req.session });
                    // Handle data for response
                    let dataAfterUpdate = await db[tableName].findOne(param).session(req.session);
                    dataAfterUpdate = dataAfterUpdate.toJSON();

                    if (apiName === 'users' || apiName === 'customers') {
                        // Clear password
                        dataAfterUpdate.password = '**********';
                    }

                    // Add sequence number
                    dataAfterUpdate = { no: i + 1, ...dataAfterUpdate };
                    // Add to list for response
                    resultData.push(dataAfterUpdate);
                }
            }

            if (errData.length > 0) {
                // Create error response
                return createResponseMessage(errData, apiName, apiName, MESSAGE.ERR_UPDATE_FAIL);
            }

            // Create success response
            return createResponseMessage(resultData, apiName, apiName.capitalize(), MESSAGE.UPDATE_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'update ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    },

    /// Common delete service
    delCommon: async (req) => {
        try {
            var { apiName, tableName, requireRole } = req.access_info;     // API name
            let inputData = req.body[apiName];                  // Request body
            let errData = [];                                   // Error list
            let exError = MESSAGE.OK;                           // Error exception

            for (let i = 0; i < inputData.length; i++) {
                let errLst = [];
                let dataInput = inputData[i];
                // Check input
                exError = await checkInputCommon(apiName, dataInput, CHECK_MODE.DELETE, errLst);
                if (exError.STATUS !== MESSAGE.OK.STATUS) {
                    // Create error response
                    return createResponseMessage([], '', 'delete ' + apiName, exError);
                }

                // Check logic
                if (errLst.length === 0) {
                    exError = await checkLogicCommon(apiName, tableName, dataInput, CHECK_MODE.DELETE, errLst, req.check, req.session);
                    if (exError.STATUS !== MESSAGE.OK.STATUS) {
                        // Create error response
                        return createResponseMessage([], '', 'delete ' + apiName, exError);
                    }
                }

                if (errLst.length > 0) {
                    // Create error data
                    errData.push({
                        'no': i + 1,
                        'error': errLst
                    });
                }
                else {
                    // Get primary key to update
                    let primaryKey = await getPrimaryKey(apiName);
                    // Query for find record update
                    let param = {};
                    param[primaryKey] = dataDb[primaryKey];

                    // If super admin role, data will be deleted from db, else it will be update del_fg = true
                    if (requireRole === ROLE_TYPE.SUPER_ADMIN) {
                        // Delete from db
                        await db[tableName].findByIdAndDelete(param, { session: req.session });
                    }
                    else {
                        // Update del_fg
                        dataInput.del_fg = true;
                        await db[tableName].findOneAndUpdate(param, dataInput, { session: req.session });
                    }

                    if (apiName === 'users' && !(await adminSession.del(dataInput.user_cd))) {
                        // Create error response
                        return createResponseMessage([], '', 'delete ' + apiName, MESSAGE.ERR_EXCEPTION);
                    }
                }
            }

            if (errData.length > 0) {
                // Create error response
                return createResponseMessage(errData, apiName, apiName, MESSAGE.ERR_DELETE_FAIL);
            }

            // Create success response
            return createResponseMessage([], apiName, apiName.capitalize(), MESSAGE.DELETE_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'delete ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    }
}
// #endregion Exports