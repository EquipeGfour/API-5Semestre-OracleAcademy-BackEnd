import { Router } from "express";
import { authenticate } from "../middlewares";
import { WorkspaceController } from "../controllers";


const routes = Router();

routes.get("/buscar", authenticate, WorkspaceController.buscarWorkspaces);
routes.get("/buscarWorkspaceUsuario", authenticate, WorkspaceController.buscarWorkspaceUsuario);
routes.get("/buscarWorkspaceProprietario", authenticate, WorkspaceController.buscarWorkspacesByOwner);

export default routes;