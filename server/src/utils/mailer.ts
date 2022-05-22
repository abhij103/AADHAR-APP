import 'dotenv/config'
import nodemailer from 'nodemailer';

export class Mailer{
    private static transporter:any;
    static async init():Promise<any>{
         Mailer.transporter = nodemailer.createTransport({
             service:process.env.MAIL_SERVICE,
             auth:{
                 user:process.env.MAIL_USER,
                 pass:process.env.MAIL_PASSWORD
             }
         });
         return;
    }
    static getMailerInstance():any{
     return Mailer.transporter;
    }
}