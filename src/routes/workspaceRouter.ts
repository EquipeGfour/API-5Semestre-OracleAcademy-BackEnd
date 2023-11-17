import { Router } from "express";
import { authenticate } from "../middlewares";
import { WorkspaceController } from "../controllers";
import { authenticateAsADM } from "../middlewares/authMiddleware";


const routes = Router();

routes.get("/buscar", authenticate, WorkspaceController.buscarWorkspaces);
routes.get("/buscarID/:id", WorkspaceController.buscarWorkspaceByID);
routes.put('/changestatus', authenticate, WorkspaceController.changeStatusWorkspace);
routes.get("/buscarWorkspaceUsuario", authenticate, WorkspaceController.buscarWorkspaceUsuario);
routes.get("/buscarWorkspaceProprietario", authenticate, WorkspaceController.buscarWorkspacesByOwner);
routes.get('/buscaStatus/:workspaceId/atrasadas', WorkspaceController.countDelayedTasksWorkspace);
routes.get('/buscaTempo/:workspaceId', WorkspaceController.countWorkedHours);
routes.get('/buscaEmAndamento', authenticate, WorkspaceController.countInProgressTasks);


export default routes;