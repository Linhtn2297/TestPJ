//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : index.model.ts                                                                                                  *
//* Function     : Index model                                                                                                     *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import mongoose from "mongoose";
import User, { IUser } from './user.model';
import Hatu, { IHatu } from "./hatu.model";
import Role, { IRole } from "./role.model";
// #endregion Import

// #region Interface
/**
 * Database context interface
*/
interface IDB {
    mongoose: typeof mongoose;
    users: mongoose.Model<IUser>;
    hatus: mongoose.Model<IHatu>;
    roles: mongoose.Model<IRole>;
}
// #endregion Interface

// #region Export
/**
 * Datase context
 */
const db: IDB = {
    mongoose: mongoose,
    users: User({ mongoose }),
    hatus: Hatu({ mongoose }),
    roles: Role({ mongoose })
}

export default db;
// #endregion Export
