import { Router } from 'express';
import ClientController from '../controller/client.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const clientRouter = Router();
const clientController = new ClientController();

clientRouter.use('/api/clients', Router()
  .post('/create', clientController.create)

  .use(authMiddleware, roleMiddleware(['ADMIN', 'CLIENT']))
  .get('/', clientController.index)
  .get('/:id', clientController.show)
  .patch('/:id', clientController.update)
  .delete('/:id', clientController.delete)
);

export default clientRouter;
