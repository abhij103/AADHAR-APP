import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserRequest } from "../utils/constants";

export const isUserAuthenticated = (req:UserRequest, res:Response, next:NextFunction) => {
    const authHeader =  req.get('Authorization');
  if (!authHeader) {
    throw {statusCode:401,message:'No Auth Header Provided'};
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = verify(token, 'usersecretkey') as any;
  } catch (err) {
    throw {statusCode:401,message:'Invalid token'};
  }
  if (!decodedToken) {
    throw {statusCode:401,message:'Invalid token'};
  }
  req.userId = decodedToken.userId;
  next();
}