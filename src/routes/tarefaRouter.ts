import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
// routes.get("/buscarTarefas/:id", TarefaController.BuscarTarefas);
// routes.put("/editar/:id", TarefaController.EditarTarefa);
// routes.delete("/deletar/:id/:idtarefa", TarefaController.DeletarTarefa);
// routes.get("/buscarTarefa/:id", TarefaController.BuscarTarefaID);
// routes.put("/mudarPrioridade/:id", TarefaController.MudarPrioridadeDaTarefa);

export default routes;