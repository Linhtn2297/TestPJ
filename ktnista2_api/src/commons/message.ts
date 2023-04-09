//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : message.ts                                                                                                      *
//* Function     : Messages are shared in the system                                                                               *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 2023/03/18                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Exports
export default {
    // #region Success message
    OK: {
        STATUS: 0
    },
    GET_SUCCESSFUL: {
        STATUS: 0,
        TEXT: ''
    },
    CREATE_SUCCESSFUL: {
        STATUS: 0,
        TEXT: '{0} created successfully!'
    },
    UPDATE_SUCCESSFUL: {
        STATUS: 0,
        TEXT: '{0} updated successfully!'
    },
    DELETE_SUCCESSFUL: {
        STATUS: 0,
        TEXT: '{0} deleted successfully!'
    },
    LOGIN_SUCCESSFUL: {
        STATUS: 0,
        TEXT: 'Login successful!'
    },
    LOGOUT_SUCCESSFUL: {
        STATUS: 0,
        TEXT: 'Logout successful!'
    },
    REFRESH_TOKEN_SUCCESSFUL: {
        STATUS: 0,
        TEXT: 'Refresh Token successful!'
    },
    UPLOAD_IMAGE_SUCCESSFUL: {
        STATUS: 0,
        TEXT: 'Upload image successful!'
    },
    // #endregion Success message

    // #region Error message
    ERR_API_NOT_FOUND: {
        STATUS: 404,
        TEXT: 'API not found!'
    },
    ERR_INVALID_FORMAT_BODY: {
        STATUS: 400,
        TEXT: 'Body format is invalid!'
    },
    ERR_UNAUTHORIZED: {
        STATUS: 401,
        TEXT: 'You must authenticate to access this content!'
    },
    ERR_ACCESS_DENIED: {
        STATUS: 403,
        TEXT: 'You do not have permission to access this content!'
    },
    ERR_SESSION_EXPIRED: {
        STATUS: 440,
        TEXT: 'Your session has expired!'
    },
    ERR_EXCEPTION: {
        STATUS: 500,
        TEXT: 'Error while {0}'
    },
    ERR_EXCEPTION_V2: {
        STATUS: 500,
        TEXT: 'Something went wrong!'
    },
    ERR_LOGIN_FAIL: {
        STATUS: 1002,
        TEXT: 'Login unsuccessful!'
    },
    ERR_INSERT_FAIL: {
        STATUS: 1003,
        TEXT: 'Create {0} not successful!'
    },
    ERR_UPDATE_FAIL: {
        STATUS: 1004,
        TEXT: 'Update {0} not successful!'
    },
    ERR_DELETE_FAIL: {
        STATUS: 1005,
        TEXT: 'Delete {0} not successful!'
    },
    ERR_IS_REQUIRED: {
        STATUS: 1006,
        TEXT: '{0} is required!'
    },
    ERR_ITEM_CANNOT_BE_EMPTY: {
        STATUS: 1007,
        TEXT: '{0} cannot be empty!'
    },
    ERR_DATA_EXIST: {
        STATUS: 1008,
        TEXT: '{0} already exists!'
    },
    ERR_DATA_NO_EXIST: {
        STATUS: 1009,
        TEXT: '{0} is not exists!'
    },
    ERR_INVALID_PASSWORD: {
        STATUS: 1010,
        TEXT: 'Password must contain at least 1 upper case, 1 lower case, 1 special character and 1 number!'
    },
    ERR_INVALID_ITEM: {
        STATUS: 1011,
        TEXT: '{0} is invalid!'
    },
    ERR_UPLOAD_IMAGE_FAIL: {
        STATUS: 1012,
        TEXT: 'Upload image fail!'
    },
    ERR_LIMIT_FILE_SIZE: {
        STATUS: 1013,
        TEXT: 'Cannot upload images larger than 1920x1080!.'
    },
    ERR_MIN_LENGTH: {
        STATUS: 1014,
        TEXT: '{0} should contain a minimum of {1} characters.'
    },
    ERR_MAX_LENGTH: {
        STATUS: 1015,
        TEXT: '{0} should contain a maximum of {1} characters.'
    },
    ERR_MIN_VALUE: {
        STATUS: 1016,
        TEXT: '{0} should be above {1}.'
    },
    ERR_MAX_VALUE: {
        STATUS: 1017,
        TEXT: '{0} should be below {1}.'
    }
    // #endregion Error message
}
// #endregion Exports