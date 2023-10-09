import { Request, Response } from "express";
import UsuarioService from "../services/UsuarioService";
import { Usuarios, IUsuarios } from "../models";
import { idEhValido } from "../utils/utils";

class UsuarioController {
    public async cadastrarUsuario(req: Request, res: Response){
        try {
            const { nome, senha, email } = req.body
            let novoUsuario = new Usuarios({
                nome: nome,
                senha: senha,
                email: email
            })
            const usuarios = await UsuarioService.createUsuarios(novoUsuario)
            return res.json(usuarios)
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async buscarTodosUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await UsuarioService.findAll()
            return res.json(usuarios)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    public async buscarPorUmUsuario(req: Request, res: Response){
        try {
            const { id } = req.params
            if(!idEhValido(id)){
                throw `id ${id} não é valido...`;
            }
            const usuario = await UsuarioService.findUsuariosById(id)
            res.status(200).json(usuario)
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
    
    public async editarUsuario(req: Request, res: Response){
        try {
            const { id } = req.params
            const usuarioData = req.body
            const updatedUsuario = await UsuarioService.updateUsuarios(id, usuarioData)
            return res.json(updatedUsuario)
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async filtroUsuarioUnico (req:Request, res:Response) {
        try{
            const { id } = req.params
            const usuario = await  UsuarioService.findUsuariosById(id)
            res.json(usuario)
        }catch(error){
            res.status(500).json(error);
        }
    }
    public async buscarUsuariosPorNome(req: Request, res: Response) {
        try {
            const { nome } = req.params;
            if (!nome) {
                throw "Nome não fornecido na consulta.";
            }
            const usuarios = await UsuarioService.findUsuariosByName(nome.toString());
            return res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}

export default new UsuarioController()