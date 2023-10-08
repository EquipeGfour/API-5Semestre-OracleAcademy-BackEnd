import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
routes.get("/buscarTarefas/:id", TarefaController.buscarTarefas);
routes.get("/buscarTarefa/:id", TarefaController.buscarTarefaPorId);
routes.put("/editar/:id", TarefaController.editarTarefa);
routes.delete("/deletar/:id", TarefaController.excluirTarefa);
routes.put("/mudarPrioridade/:id", TarefaController.alterarPrioridade);
routes.put("/mudarStatus/:id", TarefaController.mudarStatusDaTarefa);

export default routes;