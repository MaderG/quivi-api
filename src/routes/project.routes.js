import { Router } from 'express';
import ProjectController from '../controller/project.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.use(
  '/api/projects',
  Router()
    .use(authMiddleware)
    .get(
      '/',
      roleMiddleware(['ADMIN', 'CLIENT', 'FREELANCER']),
      projectController.index
    )
    .post(
      '/create',
      roleMiddleware(['ADMIN', 'CLIENT']),
      projectController.create
    )
    .get(
      '/:id',
      roleMiddleware(['ADMIN', 'CLIENT', 'FREELANCER']),
      projectController.show
    )
    .put('/:id', roleMiddleware(['ADMIN', 'CLIENT']), projectController.update)
    .delete(
      '/:id',
      roleMiddleware(['ADMIN', 'CLIENT']),
      projectController.delete
    )
);

export default projectRouter;
