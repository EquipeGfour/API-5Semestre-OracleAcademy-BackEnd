import { ObjetivoController } from "../controllers";
import { Router } from "express";


const routes = Router();

routes.delete("/deletar/:id", ObjetivoController.deletarObjetivo);
routes.get("/buscar", ObjetivoController.buscarTodosOsObjetivos);



export default routes;