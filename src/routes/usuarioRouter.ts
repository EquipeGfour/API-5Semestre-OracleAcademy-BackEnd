import { Router } from "express";
import { UsuarioController } from "../controllers";


const routes = Router();

routes.post("/criar", UsuarioController.cadastrarUsuario);
routes.get("/buscar", UsuarioController.buscarTodosUsuarios);
routes.get("/buscar/:id", UsuarioController.buscarPorUmUsuario);
routes.put("/editar/:id", UsuarioController.editarUsuario);

export default routes;