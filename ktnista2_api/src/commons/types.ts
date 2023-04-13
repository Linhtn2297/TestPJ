//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : type.ts                                                                                                         *
//* Function     : Types are shared a lot in the system                                                                            *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 10/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import { Mongoose } from "mongoose";
import { ROLE_TYPE } from "./define";
// #endregion

// #region Export
/** Mongoose input type */
export type MongooseInput = { mongoose: Mongoose };
/** Data response type */
export type DataResponse = { status: number, message?: string, count?: number, [key: string]: any; };
/** Error item type */
export type ErrorItem = { itemName: string, itemValue: any, errCode: number, errMsg: string };
/** Admin session type */
export type AdminSession = { role: ROLE_TYPE, token: string, insertYmdHms: Date };
/** Sort type in mongo */
export type MongoSort = 1 | -1;
/** Mongo filter field type */
export type MongoFilterField = 1 | 0;
/** Operator query type */
export type OpertorQuery = '=' | '>' | '>=' | '<' | '<=' | 'in' | 'like';
/** Data query type */
export type DataQuery = { name: string, operator: OpertorQuery, value: any };
/** Mongo query input type */
export type QueryInput = {
    [key: string]:
    {
        offset: number, limit: number, sort: { [key: string]: MongoSort },
        fields: { [key: string]: MongoFilterField }, data: DataQuery[], [key: string]: any
    }
};
/** KTnista database table type */
export type KTnistaDBTable = 'users' | 'hatus' | 'roles';
/** Delete flag type */
export type DelFg = 0 | 1;
// #endregion