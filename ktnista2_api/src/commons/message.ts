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

// #region Export
/**
 * Message item class
 */
export class MSG {
    /** status code */
    public STATUS: number;
    /** message text */
    public TEXT: string;

    constructor (_status: number, _text: string) {
        this.STATUS = _status;
        this.TEXT = _text;
    }
}

/**
 * Message class
 */
export default class {
    // #region Success message
    /** Successful message */
    public static readonly OK = new MSG(0, '');
    /** Ready server message */
    public static readonly SERVER_READY = new MSG(200, 'KTnista API server is ready!');
    /** Successful get message */
    public static readonly GET_SUCCESSFUL = new MSG(0, '');
    /** Successful create message */
    public static readonly CREATE_SUCCESSFUL = new MSG(0, '{0} created successfully!');
    /** Successful update message */
    public static readonly UPDATE_SUCCESSFUL = new MSG(0, '{0} updated successfully!');
    /** Successful delete message */
    public static readonly DELETE_SUCCESSFUL = new MSG(0, '{0} deleted successfully!');
    /** Successful login message */
    public static readonly LOGIN_SUCCESSFUL = new MSG(0, 'Login successful!');
    /** Successful logout message */
    public static readonly LOGOUT_SUCCESSFUL = new MSG(0, 'Logout successful!');
    /** Successful get refresh token message */
    public static readonly REFRESH_TOKEN_SUCCESSFUL = new MSG(0, 'Refresh Token successful!');
    /** Successful upload image message */
    public static readonly UPLOAD_IMAGE_SUCCESSFUL = new MSG(0, 'Upload image successful!');
    // #endregion Success message
    
    // #region Error message
    /** Error api not found message */
    public static readonly ERR_API_NOT_FOUND = new MSG(404, 'API not found!');
    /** Error invalid format body message */
    public static readonly ERR_INVALID_FORMAT_BODY = new MSG(400, 'Body format is invalid!');
    /** Error not authorized message */
    public static readonly ERR_UNAUTHORIZED = new MSG(401, 'You must authenticate to access this content!');
    /** Error access denied message */
    public static readonly ERR_ACCESS_DENIED = new MSG(403, 'You do not have permission to access this content!');
    /** Error session expired message */
    public static readonly ERR_SESSION_EXPIRED = new MSG(440, 'Your session has expired!');
    /** Error exception message */
    public static readonly ERR_EXCEPTION = new MSG(500, 'Error while {0}!');
    /** Error exception message */
    public static readonly ERR_EXCEPTION_V2 = new MSG(500, 'Something went wrong!');
    /** Error login not successful message */
    public static readonly ERR_LOGIN_FAIL = new MSG(1002, 'Login unsuccessful!');
    /** Error create data not successful message */
    public static readonly ERR_INSERT_FAIL = new MSG(1003, 'Create {0} not successful!');
    /** Error update data not successful message */
    public static readonly ERR_UPDATE_FAIL = new MSG(1004, 'Update {0} not successful!');
    /** Error delete data not successful message */
    public static readonly ERR_DELETE_FAIL = new MSG(1005, 'Delete {0} not successful!');
    /** Error item is required message */
    public static readonly ERR_IS_REQUIRED = new MSG(1006, '{0} is required!');
    /** Error item can not be empty message */
    public static readonly ERR_ITEM_CANNOT_BE_EMPTY = new MSG(1007, '{0} cannot be empty!');
    /** Error data already exist message */
    public static readonly ERR_DATA_EXIST = new MSG(1008, '{0} already exists!');
    /** Error data not exist message */
    public static readonly ERR_DATA_NO_EXIST = new MSG(1009, '{0} is not exists!');
    /** Error invalid passsword message */
    public static readonly ERR_INVALID_PASSWORD = new MSG(1010, 'Password must contain at least 1 upper case, 1 lower case, 1 special character and 1 number!');
    /** Error invalid item message */
    public static readonly ERR_INVALID_ITEM = new MSG(1011, '{0} is invalid!');
    /** Error upload image fail message */
    public static readonly ERR_UPLOAD_IMAGE_FAIL = new MSG(1012, 'Upload image fail!');
    /** Error exceeds specified size message */
    public static readonly ERR_LIMIT_FILE_SIZE = new MSG(1013, 'Cannot upload images larger than 1920x1080!');
    /** Error larger than specified length message */
    public static readonly ERR_MIN_LENGTH = new MSG(1014, '{0} should contain a minimum of {1} characters!');
    /** Error exceeds the specified length message */
    public static readonly ERR_MAX_LENGTH = new MSG(1015, '{0} should contain a maximum of {1} characters!');
    /** Error less than the minimum value message */
    public static readonly ERR_MIN_VALUE = new MSG(1016, '{0} should be above {1}!');
    /** Error exceeds max value message */
    public static readonly ERR_MAX_VALUE = new MSG(1017, '{0} should be below {1}!');
    // #endregion Error message
}
// #endregion Export