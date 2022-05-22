import { NextFunction, Response } from 'express';
import {body} from 'express-validator';
import { Admin } from '../models/admin.model';
import { User } from '../models/user.model';
import { UserRequest } from '../utils/constants';
 import jwt from 'jsonwebtoken';
 import 'dotenv/config'
export const signUpChecker = [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email.')
    .normalizeEmail({gmail_remove_dots:false})
    .custom(async(value) => {
        const user = await Admin.findAdminByEmail(value);
        if(user){
       //     return Promise.reject({ stausCode: 422, message:'E-Mail address already exists!'});   
           return Promise.reject('E-Mail address already exists!');
        }
    }),
  body('password').trim().isLength({min:5}).withMessage('Password should be of minimum 5 chars'),
 body('name').trim().isLength({min:3}).withMessage('Name should be of minimum 3 chars')
]

export const userChecker = [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email.')
    .normalizeEmail({gmail_remove_dots:false})
    .custom(async(value) => {
        const user = await User.findUserByEmail(value);
        if(user){   
           return Promise.reject('E-Mail address already in use');
        }
    })
    ,
    body('mobno').trim().matches(/^[0-9]{10}$/).withMessage('Provide valid 10 digit number').custom(
        async(value) =>{
            const user = await User.findUserByMob(value);
            if(user){
                    return Promise.reject('Mob Number already in use');
                 }
        }
    ),
    body('fname').trim().isLength({min:3}).withMessage('First name should be of minimum 3 chars'),
    body('lname').trim().isLength({min:3}).withMessage('Lirst name should be of minimum 3 chars'),
    body('password').trim().isLength({min:5}).withMessage('Password should be of minimum 3 chars'),
    body('address').trim().isLength({min:10}).withMessage('Address should be of minimum 10 chars')
]
export const isAdminAuthenticated = (req:UserRequest, res:Response, next:NextFunction) => {
    const authHeader =  req.get('Authorization');
  if (!authHeader) {
    throw {statusCode:401,message:'No Auth Header Provided'};
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    const adminkey:any = process.env.ADMIN_KEY;
    decodedToken = jwt.verify(token, adminkey) as any;
  } catch (err) {
    throw {statusCode:401,message:'Invalid token'};
  }
  if (!decodedToken) {
    throw {statusCode:401,message:'Invalid token'};
  }
  req.userId = decodedToken.userId;
  next();
}