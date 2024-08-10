import { Router } from 'express';
import AdminController from '../controller/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const adminRouter = Router();
const adminController = new AdminController();


adminRouter.use('/api/admin', Router()
  .use(authMiddleware, roleMiddleware(['ADMIN']))
  .post('/create', adminController.createAdmin)
  .get('/users', adminController.getAllUsers)
  .get('/users/:id', adminController.getUserById)
  .delete('/users/:id', adminController.deleteUser)
);

export default adminRouter;
