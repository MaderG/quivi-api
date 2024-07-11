import { Router } from 'express';
import FreelancerController from '../controller/freelancer.controller';

const freelancerRouter = Router();
const freelancerController = new FreelancerController();

freelancerRouter.use(
  '/api/freelancers',
  Router()
    .get('/', freelancerController.index)
    .post('/create', freelancerController.create)
    .get('/:id', freelancerController.show)
    .put('/:id', freelancerController.update)
    .delete('/:id', freelancerController.delete)
);
