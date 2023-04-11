import { CHECK_AUTH_TYPE, CHECK_BODY_TYPE, ROLE_TYPE } from "./defind";

export class AccessInfo {
    public apiName: string;
    public requireRole: ROLE_TYPE;
    public checkBodyType: CHECK_BODY_TYPE;
    public checkAuthType: CHECK_AUTH_TYPE;
    public tableName: string;

    constructor (
        _apiName: string,
        _requireRole: ROLE_TYPE,
        _checkBodyType: CHECK_BODY_TYPE,
        _checkAuthType: CHECK_AUTH_TYPE,
        _tableName: string) {
        this.apiName = _apiName;
        this.requireRole = _requireRole;
        this.checkBodyType = _checkBodyType;
        this.checkAuthType = _checkAuthType;
        this.tableName = _tableName;
    }
}