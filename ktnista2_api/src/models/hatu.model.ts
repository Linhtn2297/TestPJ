//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : hatu.model.ts                                                                                                   *
//* Function     : Hatu model                                                                                                      *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 12/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************
// #region Import
import { Document } from "mongoose";
import { MongooseInput } from "../commons/types";
// #endregion Import

// #region Export
export interface IHatu extends Document {
    key_nm: String;
    key_value: number;
}

export default ({ mongoose }: MongooseInput) => {
    let schema = new mongoose.Schema({
        /** Key name */
        key_nm: {
            type: String,
            required: true
        },
        /** Key value */
        key_value: {
            type: Number,
            required: true
        }
    });

    return mongoose.model<IHatu>('Hatu', schema);
}
// #endregion Exports