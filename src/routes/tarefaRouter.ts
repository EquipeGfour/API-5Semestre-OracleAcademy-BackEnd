import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
routes.get("/listarTarefas/:id", TarefaController.BuscarTarefas);
routes.put("/editarTarefa/:id", TarefaController.EditarTarefa);
routes.delete("/deletar/:id", TarefaController.deletarTarefa);
routes.get("/listaTarefaEspecifica/:id", TarefaController.BuscarTarefaID);

export default routes;