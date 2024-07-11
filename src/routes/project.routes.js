import { Router } from 'express';
import ProjectController from '../controller/project.controller';

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.use(
  '/api/projects',
  Router()
    .get('/', projectController.index)
    .post('/create', projectController.create)
    .get('/:id', projectController.show)
    .put('/:id', projectController.update)
    .delete('/:id', projectController.delete)
);

export default projectRouter;