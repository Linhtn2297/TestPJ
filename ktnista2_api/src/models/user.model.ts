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
// #region Import
import { Document } from "mongoose";
import { MongooseInput } from "../commons/types";
// #endregion Import

// #region Export
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
        /** user code */
        user_cd: {
            type: String,
            required: true,
            length: 10
        },
        /** user name */
        user_nm: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 30
        },
        /** password */
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 100
        },
        /** email */
        email: {
            type: String,
            required: true,
            maxlength: 30
        },
        /** role */
        role: {
            type: Number,
            ref: 'role',
            required: true
        },
        /** delete flag */
        del_fg: {
            type: Number,
            default: 0
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

    return mongoose.model<IUser>('User', schema);
}
// #endregion Export