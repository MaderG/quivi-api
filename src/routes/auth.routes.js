import { Router } from 'express';
import AuthController from '../controller/auth.controller.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.authenticate);

export default authRouter;
