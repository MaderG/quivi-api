import { Router } from "express";
import ClientController from "../controller/client.controller.js";

const clientRouter = Router()
const clientController = new ClientController()

clientRouter.post('/api/register', clientController.create)
clientRouter.get('/api/clients', clientController.index)
clientRouter.get('/api/client/:id', clientController.show)

export default clientRouter