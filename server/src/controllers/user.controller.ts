import { compare } from "bcryptjs";
import { NextFunction, Response } from "express";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { User } from "../models/user.model";
import { UserRequest } from "../utils/constants";

export class UserController {
    static getUser = async (req: UserRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findUserById(new ObjectId(req.userId));
            res.status(200).json({
                message: "success",
                user: user
            })

        } catch (err: any) {
            next(err);
        }


    }
    static login = async (req: UserRequest, res: Response, next: NextFunction) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findUserByEmail(email);
            if (!user) {
                throw { statusCode: 401, message: 'A user with this email could not be found.' };
            }
            const areEqual = await compare(password, user.password);
            if (!areEqual) {
                throw { statusCode: 401, message: 'Wrong password' };
            }
            const token = sign(
                {
                    email: user.email,
                    userId: user._id.toString()
                },
                'usersecretkey',
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: user._id.toString() });
        }
        catch (err: any) {
            next(err);
        }
    }
}