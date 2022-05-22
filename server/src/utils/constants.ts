import { Request } from "express";

export interface UserRequest extends Request{
    userId?:any;
}

export type AdminPostBody = {
    email:string,
    password:string,
    name:string
}
export type UserPostBody = {
     email:string,
     password:string, 
     fname:string, 
     lname:string,
     address:string,
     mobno:string
}