import { ObjetivoController } from "../controllers";
import { Router } from "express";
import { authenticate } from "../middlewares";
import { authenticateAsADM } from "../middlewares/authMiddleware";


const routes = Router();

routes.get("/buscar", authenticate, ObjetivoController.buscarTodosOsObjetivos);
routes.get("/buscar/:id", ObjetivoController.buscarPorUmObjetivo);
routes.post("/criar", authenticate, ObjetivoController.cadastrarObjetivo);
routes.delete("/deletar/:id", ObjetivoController.excluirObjetivo);
routes.put("/mudarPrioridade/:id", ObjetivoController.alterarPrioridade);
routes.patch("/editar/:id", ObjetivoController.editarObjetivo);
routes.put("/adicionarUser/:id",authenticate, ObjetivoController.adicionarUsuariosWork);
routes.get("/buscarPorData", authenticate, ObjetivoController.getObjectivesByMonth);

export default routes;