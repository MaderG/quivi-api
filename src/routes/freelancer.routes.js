import { Router } from 'express';
import FreelancerController from '../controller/freelancer.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import  roleMiddleware  from '../middlewares/role.middleware.js';

const freelancerRouter = Router();
const freelancerController = new FreelancerController();


freelancerRouter.use('/api/freelancers', Router())

freelancerRouter.use('/api/freelancers', Router().use(authMiddleware, roleMiddleware(['ADMIN', 'FREELANCER']))
  .get('/', freelancerController.index)
  .get('/:id', freelancerController.show)
  .put('/:id', freelancerController.update)
  .delete('/:id', freelancerController.delete)
)

export default freelancerRouter;
