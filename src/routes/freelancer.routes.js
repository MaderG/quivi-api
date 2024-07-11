import { Router } from 'express';
import FreelancerController from '../controller/freelancer.controller';

const freelancerRouter = Router();
const freelancerController = new FreelancerController();

freelancerRouter.use('/api/freelncers', freelancerRouter);