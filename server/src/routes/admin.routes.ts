import {Router} from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAdminAuthenticated, signUpChecker, userChecker } from '../validators/admin.validator';

 const router = Router();

router.post('/signup',signUpChecker ,AdminController.createAdmin);
router.post('/add-user', isAdminAuthenticated ,userChecker,AdminController.createUser)
 router.post('/login', AdminController.login);
 export {router as adminRoutes};