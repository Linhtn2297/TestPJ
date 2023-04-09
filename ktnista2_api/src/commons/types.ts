import { Mongoose } from "mongoose";

export type MongooseInput = { mongoose: Mongoose };
export type Message = { STATUS: number, TEXT: string };
export type DataResponse = { status: number, message: string, count?: number, [key: string]: any; };
export type ErrorItem = { itemName: string, itemValue: any, errCode: number, errMsg: string };