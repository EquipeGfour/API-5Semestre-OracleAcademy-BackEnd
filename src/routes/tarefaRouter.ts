import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
// routes.get("/buscarTarefas/:id", TarefaController.BuscarTarefas);
// routes.put("/editar/:id", TarefaController.EditarTarefa);
routes.delete("/deletar/:id", TarefaController.excluirTarefa);
routes.get("/buscarTarefa/:id", TarefaController.buscarTarefaPorIds);
// routes.put("/mudarPrioridade/:id", TarefaController.MudarPrioridadeDaTarefa);

export default routes;