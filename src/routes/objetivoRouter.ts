import { ObjetivoController } from "../controllers";
import { Router } from "express";


const routes = Router();


routes.get("/buscar", ObjetivoController.buscarTodosOsObjetivos);


export default routes;