import { Router } from "express";
import { authenticate } from "../middlewares";
import { WorkspaceController } from "../controllers";


const routes = Router();

routes.get("/buscar", authenticate, WorkspaceController.buscarWorkspaces);
routes.get("/buscarWorkspaceStatus", authenticate, WorkspaceController.buscarWorkspaceStatus);
routes.get("/buscarID/:id", WorkspaceController.buscarWorkspaceByID);
routes.put('/workspaces/:id/change-status/:idTarefa', WorkspaceController.changeStatusWorkspace);



export default routes;