//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : base.middleware.ts                                                                                              *
//* Function     : Check body format of request                                                                                    *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/17                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import { NextFunction, Request, Response } from 'express';
import sanitize from 'mongo-sanitize';

import { createResponseMessage, getType } from '../commons/common';
import MESSAGE from '../commons/message';
import DEFINE, { CHECK_BODY_TYPE, DATA_TYPE, ROLE_TYPE } from '../commons/define';
import { DataQuery, OpertorQuery, QueryInput } from '../commons/types';

const logger = require('../commons/logger');
// #endregion Import

// #region Functions
/**
 * Check request body for api GET
 * @param body: body data
 * @param apiName: api name
 * @returns true: body valid | false: invalid
 */
const checkGetBody = (body: QueryInput, apiName: string) => {
    let bodyData = body[apiName];
    if (bodyData !== undefined) {
        // Check type of body data
        if (getType(bodyData) !== DATA_TYPE.OBJECT) return false;
        // No check if empty query condition
        if (Object.keys(bodyData).length === 0) return true;

        // Get query fields
        let { offset, limit, sort, fields, data } = bodyData;
        // Get fields name of db table
        let fieldsProt = Object.getOwnPropertyNames(DEFINE.INPUT_VALIDATE_PROTOTYPE[apiName]);
        fieldsProt = fieldsProt.concat(['del_fg', 'insertYmdHms', 'updateYmdHms']);

        // Check data to create detail get query
        if (data !== undefined) {
            if (getType(data) !== DATA_TYPE.ARRAY || data.length === 0) return false;

            for (let i = 0; i < data.length; i++) {
                if (getType(data[i]) !== DATA_TYPE.OBJECT) return false;

                let { name, value, operator }: DataQuery = data[i];
                // Check required fields
                if (name === undefined || value === undefined || operator === undefined) return false;
                // Check invalid value
                let operatorProt: OpertorQuery[] = ['=', '>', '>=', '<', '<=', 'in', 'like'];    // Operator value
                if (fieldsProt.indexOf(name) === -1 || operatorProt.indexOf(operator) === -1) {
                    return false;
                }
            }
        }

        // Check offset
        if (offset !== undefined && (getType(offset) !== DATA_TYPE.NUMBER || offset > Number.MAX_SAFE_INTEGER || offset < 0)) {
            return false;
        }

        // Check limit
        if (limit !== undefined && (getType(limit) !== DATA_TYPE.NUMBER || limit > Number.MAX_SAFE_INTEGER || limit < 0)) {
            return false;
        }

        // Check sort condition
        if (sort !== undefined) {
            if (getType(sort) !== DATA_TYPE.OBJECT) return false;

            // Get sort fields
            let sortFields = Object.getOwnPropertyNames(sort);
            // Check invalid sort fields and sort value
            for (let i = 0; i < sortFields.length; i++) {
                let field = sortFields[i];
                if (fieldsProt.indexOf(field) === -1) return false;

                // sort value only equal -1 or 1
                if (sort[field] !== -1 && sort[field] !== 1) return false;
            }
        }

        // Check fields to get
        if (fields !== undefined) {
            if (getType(fields) !== DATA_TYPE.OBJECT) return false;

            // Get fields fields
            let fieldFields = Object.getOwnPropertyNames(fields);
            let fieldValuefixed;
            // Check invalid fields and value of fields
            for (let i = 0; i < fieldFields.length; i++) {
                let field = fieldFields[i];
                if (fieldsProt.indexOf(field) === -1) return false;

                let fieldValue = fields[field];
                // field value only equal -1 or 1
                if (fieldValue !== 0 && fieldValue !== 1) return false;

                // values must be same (all equal 1 or equal 0)
                if (fieldValuefixed !== undefined && fieldValuefixed !== fieldValue) return false;
                fieldValuefixed = fieldValue;
            }
        }

        // Get relate table
        let { relateTables } = DEFINE.REQUEST_GET_PROTOTYPE[apiName];
        // Check relate table
        for (let i = 0; i < relateTables.length; i++) {
            let result = checkGetBody(bodyData, relateTables[i].tableNm);
            if (!result) return false;
        }
    }

    return true;
}
// #endregion Functions

// #region Export
/**
 * Check body format middleware
 */
export default (req: Request, res: Response, next: NextFunction) => {
    // If there was a previous error, it will be forwarded
    if (res.result?.status !== MESSAGE.OK.STATUS) {
        return next();
    }

    try {
        let { apiName, checkBodyType, requiredRole } = req.accessInfo;   // Api name, body format type for check
        let body = req.body;                                             // Request body

        if (checkBodyType !== CHECK_BODY_TYPE.NO_CHECK) {
            // Body request must be object type and has property apiName
            if (getType(body) !== DATA_TYPE.OBJECT || !body.hasOwnProperty(apiName)) {
                res.result = createResponseMessage([], '', '', MESSAGE.ERR_INVALID_FORMAT_BODY);
                return next();
            }

            let bodyData = body[apiName];
            // Clear body (clear some special char for security)
            bodyData = sanitize(bodyData);

            if (checkBodyType === CHECK_BODY_TYPE.CHECK_JSON) {
                // Only check json format body
                if (getType(bodyData) !== DATA_TYPE.OBJECT) {
                    res.result = createResponseMessage([], '', '', MESSAGE.ERR_INVALID_FORMAT_BODY);
                    return next();
                }

                // Fields can not change by client
                if (req.method !== 'GET') {
                    delete bodyData?._id;
                    if (requiredRole < ROLE_TYPE.SUPER_ADMIN) delete bodyData.del_fg;
                }
            }
            else {
                // Check array format body
                if (getType(bodyData) !== DATA_TYPE.ARRAY || bodyData.length === 0) {
                    res.result = createResponseMessage([], '', '', MESSAGE.ERR_INVALID_FORMAT_BODY);
                    return next();
                }

                if (bodyData.length > 1) {
                    // If inserting many, there must be have sequence number
                    for (var i = 0; i < bodyData.length; i++) {
                        if (bodyData[i].no === undefined || bodyData[i].no !== i + 1) {
                            res.result = createResponseMessage([], '', '', MESSAGE.ERR_INVALID_FORMAT_BODY);
                        }

                        // Fields can not change by client
                        if (req.method !== 'GET') {
                            delete bodyData[i]?._id;
                            if (requiredRole < ROLE_TYPE.SUPER_ADMIN) delete bodyData[i]?.del_fg;
                        }
                    }
                }
                else {
                    // Fields can not change by client
                    if (req.method !== 'GET') {
                        delete bodyData[0]?._id;
                        if (requiredRole < ROLE_TYPE.SUPER_ADMIN) delete bodyData[0]?.del_fg;
                    }
                }
            }

            // Check format body for API GET
            if (req.method === 'GET' && !checkGetBody(body, apiName)) {
                res.result = createResponseMessage([], '', '', MESSAGE.ERR_INVALID_FORMAT_BODY);
            }
        }
    }
    catch (err) {
        logger.error(err, (new Error().stack));
        res.result = createResponseMessage([], '', '', MESSAGE.ERR_EXCEPTION);
    }

    return next();
}
// #endregion Exports