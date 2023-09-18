import { Router } from "express";
import { TarefaController } from "../controllers";


const routes = Router();

routes.post("/criar/:id", TarefaController.criarTarefa);
routes.get("/listarTarefas/:id", TarefaController.BuscarTarefaID);


export default routes;