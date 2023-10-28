import { Router } from "express";
import { TarefaController } from "../controllers";
import { authenticate } from "../middlewares";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
routes.get("/buscarTarefas/:id", TarefaController.buscarTarefas);
routes.get("/buscarTarefa/:id", TarefaController.buscarTarefaPorId);
routes.patch("/editar/:id", TarefaController.editarTarefa);
routes.delete("/deletar/:id", TarefaController.excluirTarefa);
routes.put("/mudarPrioridade/:id", TarefaController.alterarPrioridade);
routes.put("/adicionarUser/:id", TarefaController.adicionarUsuariosTarefa);
routes.put("/mudarStatus/:id", TarefaController.mudarStatusDaTarefa);
routes.get("/buscarTarefasStatus", authenticate, TarefaController.buscarTarefaStatus);
routes.get("/buscarTarefasExpiradas", authenticate, TarefaController.buscarTarefasExpiradas);
routes.put("/atualizarCronometro/:id", TarefaController.atualizarCronometro);
routes.get('/buscarCronometro/:id', TarefaController.buscarCronometro);

export default routes;