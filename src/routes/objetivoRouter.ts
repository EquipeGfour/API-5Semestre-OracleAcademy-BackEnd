import { ObjetivoController } from "../controllers";
import { Router } from "express";
import { authenticate } from "../middlewares";


const routes = Router();

routes.get("/buscar", ObjetivoController.buscarTodosOsObjetivos);
routes.get("/buscar/:id", ObjetivoController.buscarPorUmObjetivo);
routes.post("/criar", authenticate, ObjetivoController.cadastrarObjetivo);
routes.delete("/deletar/:id", ObjetivoController.excluirObjetivo);
routes.put("/mudarPrioridade/:id", ObjetivoController.alterarPrioridade);
routes.put("/editar/:id", ObjetivoController.editarObjetivo);
routes.put("/adicionarUser/:id",authenticate, ObjetivoController.adicionarUsuariosWork);


export default routes;