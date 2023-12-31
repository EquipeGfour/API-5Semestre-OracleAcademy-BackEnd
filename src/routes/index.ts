import { Router } from "express";
import objetivoRouter from "./objetivoRouter";
import tarefaRouter from "./tarefaRouter";
import usuarioRouter from "./usuarioRouter";
import workspaceRouter from  "./workspaceRouter";
import { LoginController } from "../controllers";
import uploadRouter from "./uploadRouter";


const routes = Router();

routes.post('/', (req, res) => res.json('Is Rodando......') );
routes.use('/login', LoginController.login);
routes.use('/objetivo', objetivoRouter);
routes.use('/tarefa', tarefaRouter); 
routes.use('/usuario', usuarioRouter);
routes.use('/workspace', workspaceRouter);
routes.use('/upload', uploadRouter);

export default routes;