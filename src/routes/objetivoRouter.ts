import { ObjetivoController } from "../controllers";
import { Router } from "express";


const routes = Router();

routes.post("/criar", ObjetivoController.cadastrarObjetivos);
routes.delete("/deletar/:id", ObjetivoController.deletarObjetivo);
routes.get("/buscar", ObjetivoController.buscarTodosOsObjetivos);
routes.put("/mudarPrioridade/:id", ObjetivoController.alterarPrioridade);



export default routes;