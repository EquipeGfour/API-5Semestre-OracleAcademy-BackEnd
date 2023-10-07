import { Router } from "express";
import objetivoRouter from "./objetivoRouter";
import tarefaRouter from "./tarefaRouter";
import usuarioRouter from "./usuarioRouter";
import { LoginController } from "../controllers";


const routes = Router();

routes.get('/', (req, res) => res.json('Is Rodando......') );
routes.use('/login', LoginController.login);
routes.use('/objetivo', objetivoRouter);
routes.use('/tarefa', tarefaRouter); 
routes.use('/usuario', usuarioRouter);

export default routes;