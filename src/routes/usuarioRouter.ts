import { Router } from "express";
import { UsuarioController } from "../controllers";
import { authenticate } from "../middlewares";



const routes = Router();

routes.post("/criar", UsuarioController.cadastrarUsuario);
routes.get("/buscar", authenticate, UsuarioController.buscarTodosUsuarios);
routes.get("/buscar/:id", UsuarioController.buscarPorUmUsuario);
routes.get("/buscarUsuario/:nome",authenticate, UsuarioController.buscarUsuariosPorNome);
routes.put("/editar/:id", UsuarioController.editarUsuario);
routes.delete("/excluir/:id", UsuarioController.excluirUsuario);

export default routes;