//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : base.service.ts                                                                                                 *
//* Function     : Functions are shared in services                                                                                *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 13/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import format from 'string-format';
import { Request } from "express";

import db from "../models/index.model";
import { getType, createResponseMessage, createErrResponseMessage, isNullOrEmpty, checkPassword } from "../commons/common";
import MESSAGE from "../commons/message";
import DEFINE, { CHECK_MODE, ROLE_TYPE, DATA_TYPE, DEL_FG } from "../commons/define";

import logger from "../commons/logger";
import { IHatu } from "../models/hatu.model";
import { DataQuery, DataResponse, ErrorItem, KTnistaDBTable, QueryInput } from "../commons/types";

const ObjectId = mongoose.Types.ObjectId;
const hatuDB = db.hatus;
// #endregion Import mudule

// #region Class
/**
 * Base service class
 */
class BaseService<T> {
    /**
     * Create query to get data from db
     * @param data: data in get request body data
     * @param role: role of user access
     * @returns query detail
     */
    private createQuery = (data: DataQuery[], role: ROLE_TYPE) => {
        let query: any = {};
        if (data !== undefined) {
            data.forEach(dt => {
                let { name, operator, value } = dt;
                if (name === '_id') {
                    // Reformat _id as ObjectId
                    value = new ObjectId(value);
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

    /**
     * Create aggregate query
     * @param tableNm: table name to get data
     * @param body: get request body data
     * @param role: role of user access
     * @param pipeline: list aggregate
     */
    private createAggregate = async (tableNm: KTnistaDBTable, body: QueryInput, role: ROLE_TYPE, pipeline: any[]) => {
        let parentData = body[tableNm];
        if (parentData !== undefined) {
            let { data, sort, fields, limit, offset } = parentData;
            pipeline.push({ $match: this.createQuery(data, role) });

            // Offset
            let dataFilter: any = [{ $skip: offset !== undefined ? offset : 0 }];

            // Limit
            if (limit !== undefined) {
                dataFilter.push({ $limit: limit });
            }

            // Sort
            if (sort !== undefined) {
                dataFilter.push({ $sort: sort });
            }

            // Fields in record
            if (fields !== undefined) {
                pipeline.push({ $project: fields });
            }

            // Get relate table
            let relateTables = DEFINE.REQUEST_GET_PROTOTYPE[tableNm].relateTables;
            relateTables.forEach(rTbl => {
                // Create child aggregate query
                let childPipeline: any[] = [];
                this.createAggregate(rTbl.tableNm, body[tableNm], role, childPipeline);
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

    /**
     * Common get function
     * @param req: http request
     * @returns response data
     */
    public getCommon = async (req: Request): Promise<DataResponse> => {
        var { apiName, tableName, user } = req.accessInfo;     // Access info

        try {
            // Create aggregate query
            let aggregate: any[] = [];
            this.createAggregate(tableName, req.body, user.role, aggregate);
            // Get data
            let data: T[] = await db[tableName].aggregate(aggregate);

            // Create response message
            return createResponseMessage(data, apiName, '', MESSAGE.GET_SUCCESSFUL);
        }
        catch (err) {
            logger.error(err, (new Error().stack));
            return createResponseMessage([], '', 'get ' + apiName, MESSAGE.ERR_EXCEPTION);
        }
    }
}

export = BaseService;
// #endregion Class