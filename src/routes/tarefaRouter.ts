import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
routes.get("/buscarTarefas/:id", TarefaController.buscarTarefas);
routes.get("/buscarTarefaID/:id", TarefaController.buscarTarefaID);
routes.put("/editar/:id", TarefaController.editarTarefa);
routes.delete("/deletar/:id", TarefaController.excluirTarefa);
routes.get("/buscarTarefa/:id", TarefaController.buscarTarefaPorIds);
routes.put("/mudarPrioridade/:id", TarefaController.alterarPrioridade);

export default routes;