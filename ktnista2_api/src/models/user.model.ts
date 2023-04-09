//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : user.model.ts                                                                                                   *
//* Function     : User model                                                                                                      *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************
import { Document } from "mongoose";
import { MongooseInput } from "../commons/types";

// #region Exports
export interface IUser extends Document {
    user_cd: String;
    user_nm: String;
    password: String;
    email: String;
    role: Number;
    del_fg: Number;
    insertYmdHms: Date;
    updateYmdHms: Date;
}

export default ({mongoose}: MongooseInput) => {
    var schema = new mongoose.Schema({
        user_cd: {
            type: String,
            required: true,
            length: 10
        },
        user_nm: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            maxlength: 30
        },
        role: {
            type: Number,
            ref: 'role',
            required: true
        },
        del_fg: {
            type: Number,
            default: 0
        },
        insertYmdHms: {
            type: Date,
            default: new Date()
        },
        updateYmdHms: {
            type: Date,
            default: new Date()
        }
    });

    return mongoose.model<IUser>('User', schema);
}
// #endregion Exports