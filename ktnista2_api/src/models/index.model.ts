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
import User from './user.model';
// #endregion Import

// #region Set model
interface IDB {
    mongoose: typeof mongoose;
    users: any;
}

const db: IDB = {
    mongoose: mongoose,
    users: User({ mongoose })
}
// #endregion Set model

// #region Export
export default db;
// #endregion Export
