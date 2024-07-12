import { Router } from 'express';
import ClientController from '../controller/client.controller.js';

const clientRouter = Router();
const clientController = new ClientController();

clientRouter.use(
  '/api/clients',
  Router()
    .get('/', clientController.index)
    .post('/create', clientController.create)
    .post('/login', clientController.authenticate)
    .get('/:id', clientController.show)
    .put('/:id', clientController.update)
    .delete('/:id', clientController.delete)
);

export default clientRouter;
