import express,{ json, NextFunction, Response, urlencoded } from "express";
import { UserRequest } from "./utils/constants";
import { DbConnect } from "./utils/database";
import cors from 'cors';
import { adminRoutes } from "./routes/admin.routes";
import { userRoutes } from "./routes/user.route";
import { Mailer } from "./utils/mailer";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({extended:false}));
app.use('/admin',adminRoutes)
app.use('/user', userRoutes);

app.use((error:any, req:UserRequest, res:Response, next:NextFunction) => { //will only come here when error occursss.
    const status = error?.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
const main = async()=> {
    try{
      await DbConnect.connectToDb();
      await Mailer.init();
      app.listen(process.env.PORT || 3000,()=>{
       console.log('running on 3000');
   });
    }catch(err){
       console.log('Error connecting to Database/Mailer');
    }
}

main();