import { Mongoose } from "mongoose";
import { CHECK_AUTH_TYPE, CHECK_BODY_TYPE, ROLE_TYPE } from "./defind";

export type MongooseInput = { mongoose: Mongoose };
export type Message = { STATUS: number, TEXT: string };
export type DataResponse = { status: number, message?: string, count?: number, [key: string]: any; };
export type ErrorItem = { itemName: string, itemValue: any, errCode: number, errMsg: string };
export type AccessInfo = { apiName: string, requireRole: ROLE_TYPE, checkBodyType: CHECK_BODY_TYPE, checkAuthType: CHECK_AUTH_TYPE, tableName: string };
export type AdminSession = { role: ROLE_TYPE, token: string, insertYmdHms: Date }