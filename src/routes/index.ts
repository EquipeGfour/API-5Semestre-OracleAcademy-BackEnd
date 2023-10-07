import { Router } from "express";
import objetivoRouter from "./objetivoRouter";
import tarefaRouter from "./tarefaRouter";
import usuarioRouter from "./usuarioRouter";

const routes = Router();

routes.get('/', (req, res) => res.json('Is Rodando......') );
routes.use('/objetivo', objetivoRouter);
routes.use('/tarefa', tarefaRouter); 
routes.use('/usuario', usuarioRouter);


export default routes;