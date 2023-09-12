import { Router } from "express";


const routes = Router();

routes.get('/', (req, res) => res.json('Is Rodando......') );

export default routes;