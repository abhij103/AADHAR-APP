import {Router} from 'express';
import { UserController } from '../controllers/user.controller';
import { isUserAuthenticated } from '../validators/user.validators';

 const router = Router();
 router.post('/login', UserController.login);
router.get('/details',isUserAuthenticated,UserController.getUser);

 export {router as userRoutes};