import { Router } from "express";
import { authenticate } from "../middlewares";
import { ObjetivoController } from "../controllers";


const routes = Router();

routes.get("/buscar", authenticate, ObjetivoController.buscarWorkspaces);



export default routes;