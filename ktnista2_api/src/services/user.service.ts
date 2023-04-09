import db from "../models/index.model"
import { IUser } from "../models/user.model"

export default {
    get: async (): Promise<IUser[]> => {
        const users: IUser[] = await db.users.find({});
        return users;
    }
}