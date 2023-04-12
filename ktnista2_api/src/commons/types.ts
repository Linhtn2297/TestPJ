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
// #endregion