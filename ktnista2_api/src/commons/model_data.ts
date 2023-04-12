//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : model_data.ts                                                                                                   *
//* Function     : Models data are shared in the system                                                                            *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 12/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import
import { CHECK_AUTH_TYPE, CHECK_BODY_TYPE, ROLE_TYPE } from "./define";
import { AdminSession } from "./types";
// #endregion Import

// #region Export

/**
 * Access infomation class
 */
export class AccessInfo {
    /** Api name */
    public apiName: string;
    /** Required role */
    public requiredRole: ROLE_TYPE;
    /** Body format type for check */
    public checkBodyType: CHECK_BODY_TYPE;
    /** Authentication type for check */
    public checkAuthType: CHECK_AUTH_TYPE;
    /** Table name to handle with database */
    public tableName: string;
    /** user access info  */
    public user?: any;

    constructor (
        _apiName: string,
        _requiredRole: ROLE_TYPE,
        _checkBodyType: CHECK_BODY_TYPE,
        _checkAuthType: CHECK_AUTH_TYPE,
        _tableName: string,
        _user?: any) {
        this.apiName = _apiName;
        this.requiredRole = _requiredRole;
        this.checkBodyType = _checkBodyType;
        this.checkAuthType = _checkAuthType;
        this.tableName = _tableName;
        this.user = _user;
    }
}

// #endregion Export