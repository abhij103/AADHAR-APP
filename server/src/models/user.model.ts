import { ObjectId } from "mongodb";
import { DbConnect } from "../utils/database";

export class User{
    constructor(private email:string, private password:any, private fname:string,private lname:string,
               private creator:ObjectId,private address:string,private mobno:string,private aadharno:string) {}

       static async findUserByMob(searchMobNo:string):Promise<any>{
        const db = DbConnect.getDbInstance();
        const user = await db.collection('users').findOne({ mobno : searchMobNo });
        return Promise.resolve(user);
       }
       static async findUserById(uid:ObjectId):Promise<any>{
        const db = DbConnect.getDbInstance();
        const user = await db.collection('users').findOne({ _id: uid });
        return Promise.resolve(user);
       }
       static async findUserByEmail(email:string):Promise<any>{
        const db = DbConnect.getDbInstance();
        const user = await db.collection('users').findOne({ email : email });
        return Promise.resolve(user);
       }
}