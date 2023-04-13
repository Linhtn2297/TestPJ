//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : role.model.ts                                                                                                   *
//* Function     : Role model                                                                                                      *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 12/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************
// #region Import
import { Document } from "mongoose";
import { MongooseInput } from "../commons/types";
// #endregion Import

// #region Interface
/**
 * Hatu document interface
*/
export interface IRole extends Document {
    key_nm: String;
    key_value: number;
}
// #endregion Interface

// #region Export
/**
 * Hatu schema
 */
export default ({ mongoose }: MongooseInput) => {
    let schema = new mongoose.Schema({
        /** Role id */
        role_id: {
            type: Number,
            required: true
        },
        /** Role name */
        role_nm: {
            type: String,
            required: true
        },
        /** Del flag */
        del_fg: {
            type: Number,
            default: 1
        },
        /** datetime create */
        insertYmdHms: {
            type: Date,
            default: new Date()
        },
        /** datetime update */
        updateYmdHms: {
            type: Date,
            default: new Date()
        }
    });

    return mongoose.model<IRole>('Hatu', schema);
}
// #endregion Export