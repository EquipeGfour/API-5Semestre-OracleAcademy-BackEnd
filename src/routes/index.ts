import { Router } from "express";
import objetivoRouter from "./objetivoRouter";

const routes = Router();

routes.get('/', (req, res) => res.json('Is Rodando......') );
routes.use('/objetivo', objetivoRouter);


export default routes;