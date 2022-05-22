import 'dotenv/config'
import {MongoClient} from 'mongodb';

export class DbConnect{
    private static db:any;
    static async connectToDb():Promise<any>{
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.zwbuo.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
          );
        DbConnect.db = client.db();
         return;
    }
    static getDbInstance():any{
     return DbConnect.db;
    }
}