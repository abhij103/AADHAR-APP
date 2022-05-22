import { compare, hash } from "bcryptjs";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { Admin } from "../models/admin.model";
import { User } from "../models/user.model";
import { AdminPostBody, UserPostBody, UserRequest } from "../utils/constants";
import randomstring from 'randomstring'
import { sign } from "jsonwebtoken";
import { Mailer } from "../utils/mailer";
// import * as dotenv from "dotenv";
// dotenv.config({ path: __dirname+'../.env' });
export class AdminController {
    static createAdmin = async (req: UserRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw { statusCode: 422, message: errors.array({ onlyFirstError: true })[0].msg };
            }
            const body = req.body as AdminPostBody;
            const hashkey:any = process.env.HASH_KEY;
            const hashedPw = await hash(body.password, +hashkey);
            const admin = new Admin(body.email, hashedPw, body.name);
            await admin.addAdminDb();
            res.status(201).json({
                message: 'Admin created successfully!'
            });
        }
        catch (err: any) {
            next(err);
        }

    }
    static createUser = async (req: UserRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw { statusCode: 422, message: errors.array({ onlyFirstError: true })[0].msg };
            }
            const body = req.body as UserPostBody;
            const hashkey:any = process.env.HASH_KEY;
            const hashedPw = await hash(body.password, +hashkey);
            const aadharNum = randomstring.generate({
                length:12,
                charset: '0123456789'
              });
            const user = new User(body.email, hashedPw, body.fname, body.lname, new ObjectId(req.userId),
                 body.address,body.mobno,aadharNum);
            await Admin.addUserDb(user);
            const transporter = Mailer.getMailerInstance();
            transporter.sendMail({
                to:body.email,
                from:'ajaadharservices@outlook.com',
                subject:'Aadhar Card Created Successfully',
                text:`Login via below credentials
                      Email:${body.email}
                      Password:${body.password}`
            })
            res.status(201).json({
                message: 'User created successfully!'
            });
        }
        catch (err: any) {
            next(err);
        }
    }
    static login = async (req: UserRequest, res: Response, next: NextFunction) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            const user = await Admin.findAdminByEmail(email);
            if (!user) {
                throw { statusCode: 401, message: 'A user with this email could not be found.' };
              }
              const areEqual = await compare(password, user.password);
              if (!areEqual) {
                throw { statusCode: 401, message: 'Wrong password' };
              }
              const adminkey:any = process.env.ADMIN_KEY;
              const token = sign(
                {
                  email: user.email,
                  userId: user._id.toString()
                },
                adminkey,
                { expiresIn: '1h' }
              );
              res.status(200).json({ token: token, userId: user._id.toString() });
            }
            catch(err:any){
                  next(err);
            }
    }
}