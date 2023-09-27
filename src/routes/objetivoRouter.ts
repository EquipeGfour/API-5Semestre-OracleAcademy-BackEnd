import { ObjetivoController } from "../controllers";
import { Router } from "express";


const routes = Router();

routes.get("/buscar", ObjetivoController.buscarTodosOsObjetivos);
routes.post("/criar", ObjetivoController.cadastrarObjetivos);
// routes.delete("/deletar/:id", ObjetivoController.deletarObjetivo);
// routes.put("/mudarPrioridade/:id", ObjetivoController.alterarPrioridade);
// routes.put("/editar/:id", ObjetivoController.editarObjetivo);


export default routes;