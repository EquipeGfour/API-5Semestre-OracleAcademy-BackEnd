import { Router } from "express";
import { authenticate } from "../middlewares";
import { WorkspaceController } from "../controllers";


const routes = Router();

routes.get("/buscar", authenticate, WorkspaceController.buscarWorkspaces);
routes.get("/buscarWorkspaceStatus", authenticate, WorkspaceController.buscarObjetivoStatus);



export default routes;