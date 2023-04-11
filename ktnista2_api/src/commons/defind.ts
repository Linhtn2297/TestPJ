//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : defind.ts                                                                                                       *
//* Function     : Defind (Definitions used in the system)                                                                         *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

import { AccessInfo } from "./model_data";

// #region Definitions
/// User code length
const USR_CD_LENGTH = 8;

/// Role for authorize
export enum ROLE_TYPE {
    SUPER_ADMIN = 99,
    ADMIN = 98,
    USER = 97,
    CUSTOMER = 7,
    UNIDENTIFIED = 0
};

/// Check body format type
export enum CHECK_BODY_TYPE {
    NO_CHECK = 0,        // No need check
    CHECK_JSON = 1,      // Check json format
    CHECK_ARRAY = 2      // Check array format
};

/// Check authentication type
export enum CHECK_AUTH_TYPE {
    CHECK_COOKIE = 0,    // Check cookie in header
    CHECK_TOKEN = 1      // Check token in header
};

export enum FIELD_TYPE {
    STRING = 'String',
    NUMBER = 'Number',
    ARRAY = 'Array',
    OBJECT = 'Object',
    NULL = 'Null'
}

/// Action mode
export enum CHECK_MODE {
    INSERT = 1,  // Use for create data
    UPDATE = 2,  // Use for update data
    DELETE = 3   // Use for delete data
}

/// API info for check authorize, body format, ...
export const API_INFO: any = {
    '/users': {
        GET: new AccessInfo('users', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_JSON, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users'),
        POST: new AccessInfo('users', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users'),
        PUT: new AccessInfo('users', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users'),
        DELETE: new AccessInfo('users', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users')
    },
    '/user': {
        GET: new AccessInfo('user', ROLE_TYPE.USER, CHECK_BODY_TYPE.NO_CHECK, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users')
    },
    '/user/login': {
        POST: new AccessInfo('user', ROLE_TYPE.UNIDENTIFIED, CHECK_BODY_TYPE.CHECK_JSON, CHECK_AUTH_TYPE.CHECK_TOKEN, 'users')
    },
    '/user/logout': {
        GET: new AccessInfo('user', ROLE_TYPE.USER, CHECK_BODY_TYPE.NO_CHECK, CHECK_AUTH_TYPE.CHECK_COOKIE, 'users')
    },
    '/user/refresh_token': {
        GET: new AccessInfo('user', ROLE_TYPE.USER, CHECK_BODY_TYPE.NO_CHECK, CHECK_AUTH_TYPE.CHECK_COOKIE, 'users')
    },
    '/roles': {
        GET: new AccessInfo('roles', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_JSON, CHECK_AUTH_TYPE.CHECK_TOKEN, 'roles'),
        POST: new AccessInfo('roles', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'roles'),
        PUT: new AccessInfo('roles', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'roles'),
        DELETE: new AccessInfo('roles', ROLE_TYPE.SUPER_ADMIN, CHECK_BODY_TYPE.CHECK_ARRAY, CHECK_AUTH_TYPE.CHECK_TOKEN, 'roles')
    }
};

/// Prototype for validate input
//  name: Name of field
//  isPrimaryKey: Is primary key field
//  isRequrie: Is required field
//  isString: Is string type field
//  isNumber: Is number type field
//  isPassword: Is password field
//  isEmail: Is email field
//  minLength: Min of length
//  maxLength: Max of legnth
export const INPUT_VALIDATE_PROTOTYPE = {
//  table nam: { field name: { properties: } }
    users: {
        user_cd: { name: 'User code', isPrimaryKey: true, isString: true, minLength: USR_CD_LENGTH, maxLength: USR_CD_LENGTH },
        user_nm: { name: 'User name', isRequired: true, isString: true, minLength: 2, maxLength: 30, isNotContainSpacialChar: true },
        password: { name: 'Password', isRequired: true, isString: true, minLength: 8, maxLength: 20, isPassword: true },
        password_confirm: { name: 'Password confirm', isRequired: true, isString: true, minLength: 8, maxLength: 20 },
        email: { name: 'Email', isRequired: true, isString: true, minLength: 0, maxLength: 30, isEmail: true },
        role: { name: 'Role', isRequired: true, isNumber: true, minValue: 0, maxValue: 99 }
    },
    roles: {
        role_id: { name: 'Role id', isPrimaryKey: true, isNumber: true, minValue: 0, maxValue: 99 },
        role_nm: { name: 'Role name', isRequired: true, isString: true, minLength: 2, maxLength: 30, isNotContainSpacialChar: true }
    },
    user_auth: {
        user_nm: { name: 'User name', isRequired: true, isString: true },
        password: { name: 'Password', isRequired: true, isString: true }
    },
};

/// Prototype for check logic input
//  name: Name of field to show
//  isPrimaryKey: Is primary key field
//  isUnique: Value of field is unique in db
//  foreignField: field is foreign key field
//  tableNm: table name reflect foreign key
//  fieldNm: field name in table reflect foreign key
export const LOGIC_VALIDATE_PROTOTYPE = {
    //  api name: { field name: { properties: } } }
    users: {
        user_cd: { name: 'User code', isPrimaryKey: true },
        email: { name: 'Email', isUnique: true },
        role: { name: 'Role', foreignField: { tableNm: 'roles', fieldNm: 'role_id' } }
    },
    roles: {
        role_id: { name: 'Role id', isPrimaryKey: true }
    }
};

/// Request GET prototype
export const REQUEST_GET_PROTOTYPE = {
    users: { defaultSort: { user_cd: 1 }, relateTables: [{ tableNm: 'roles', localField: 'role', foreignField: 'role_id' }] },
    roles: { defaultSort: { role_id: 1 }, relateTables: [{ tableNm: 'users', localField: 'role_id', foreignField: 'role' }, { tableNm: 'hatus', localField: 'hatu', foreignField: 'key_nm' }] },
    hatus: { defaultSort: { key_nm: 1 }, relateTables: [] }
};
// #endregion Definitions

// #region Exports
export default {
    /// Key name for get auth token
    HEADER_AUTH_NM: 'ktnista-auth-token',
    /// User code base
    USR_CD_BASE: 'KTAD',
    /// User code length
    USR_CD_LENGTH,
    /// Customer code base
    CUS_CD_BASE: 'KTCT',
    /// Customer code length
    CUS_CD_LENGTH: 10,
    /// Order code base
    ORD_CD_BASE: 'KTOR',
    /// Order code length
    ORD_CD_LENGTH: 12,
    /// Image max size
    IMAGE_MAX_SIZE: 1920 * 1080,
    /// Admin session redis id
    ADMIN_SESSION_REDIS_ID: 'ADMIN_SESSION'
}
// #endregion Exports