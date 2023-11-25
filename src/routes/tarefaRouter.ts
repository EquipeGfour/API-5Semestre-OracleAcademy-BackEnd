import { Router } from "express";
import { TarefaController } from "../controllers";
import { authenticate } from "../middlewares";
import { authenticateAsADM } from "../middlewares/authMiddleware";


const routes = Router();

routes.post("/criar/:id",authenticate, TarefaController.criarTarefa);
routes.get("/buscarTarefas/:id", TarefaController.buscarTarefas);
routes.get("/buscarTarefa/:id", TarefaController.buscarTarefaPorId);
routes.patch("/editar/:id",authenticate, authenticateAsADM, TarefaController.editarTarefa);
routes.delete("/deletar/:id",authenticate, TarefaController.excluirTarefa);
routes.put("/mudarPrioridade/:id",authenticate, authenticateAsADM, TarefaController.alterarPrioridade);
routes.put("/adicionarUser/:id",authenticate, authenticateAsADM, TarefaController.adicionarUsuariosTarefa);
routes.put("/mudarStatus/:id", TarefaController.mudarStatusDaTarefa);
routes.get("/buscarTarefasStatus/", TarefaController.buscarTarefaStatus);
routes.get("/buscarTarefasExpiradas", authenticate, TarefaController.buscarTarefasExpiradas);
routes.put("/atualizarCronometro/:id", TarefaController.salvarDiferencaDoCronometro);
routes.get('/buscarCronometro/:id', TarefaController.buscarCronometro);

export default routes;