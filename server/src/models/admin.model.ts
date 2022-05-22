import { DbConnect } from "../utils/database";
import { User } from "./user.model";

export class Admin{
    constructor(private email:string, private password:any, private name:string) {}

    addAdminDb():Promise<any>  {
        const db = DbConnect.getDbInstance();
        return db
          .collection('admins')
          .insertOne(this)
       }
       static async findAdminByEmail(searchEmail:string):Promise<any>{
        const db = DbConnect.getDbInstance();
        const user = await db.collection('admins').findOne({ email : searchEmail });
        return Promise.resolve(user);
       }
       static async addUserDb(user:User):Promise<any>{
        const db = DbConnect.getDbInstance();
        return db
        .collection('users')
        .insertOne(user);
       }
}