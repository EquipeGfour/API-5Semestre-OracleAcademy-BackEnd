import { Request, Response } from "express";
import { ObjetivoService, TarefaService, WorkspaceService } from "../services";
import { Objetivo } from "../models";
import { idEhValido, verificarPrioridade } from "../utils/utils";


class ObjetivoController {
    public async cadastrarObjetivo(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const { titulo, descricao, data_estimada, prioridade, workspace } = req.body;
            const workspaceValue = workspace || false;
            let novoObjetivo = new Objetivo({
                titulo: titulo,
                descricao: descricao,
                data_estimada: data_estimada,
                prioridade: prioridade,
                proprietario: usuario._id,
                workspace:workspaceValue
            });
            const objetivo = await ObjetivoService.createObjetivo(novoObjetivo);
            return res.json(objetivo);
        } catch (error){
            res.status(500).json(error);
        }
    }

    public async adicionarUsuariosWork(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const usuarios = req.body;
            const objetivo = await ObjetivoService.getObjetivoById(id);
            if (objetivo && objetivo.workspace === true) {
                const updatedObjetivo = await WorkspaceService.addUserToWorkspace(id, usuarios);
                return res.status(200).json(updatedObjetivo);
            } else {
                return res.status(400).json({ message: "O campo 'workspace' precisa ser true para adicionar usuários." });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async buscarTodosOsObjetivos(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const objetivos = await ObjetivoService.findAllObjetivosByUser(usuario);
            return res.json(objetivos);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async buscarPorUmObjetivo(req: Request, res: Response){
        try{
            const { id } = req.params;
            if(!idEhValido(id)){
                throw `id ${id} não é valido...`;
            }
            const objetivo = await ObjetivoService.getObjetivoById(id);
            res.status(200).json(objetivo);
        }catch(error){
            res.status(500).json({message:error});
        }
    }

    public async editarObjetivo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const objetivoData = req.body;
            const updatedObjetivo = await ObjetivoService.updateObjetivo(id, objetivoData);
            return res.json(updatedObjetivo);
        } catch (error) {
            res.status(500).json({ error: error.message || "Ocorreu um erro durante a atualização do objetivo." });
        }
    }

    public async excluirObjetivo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const objetivo = await ObjetivoService.getObjetivoById(id);
            await TarefaService.onDeleteObjetivoDeleteAllTarefas(objetivo.tarefas)
            await ObjetivoService.deleteObjetivo(id);
            return res.json(`objetivo ${id} excluido com sucesso...`);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    public async alterarPrioridade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { prioridade } = req.body
            if(!verificarPrioridade(prioridade)){
                return res.status(422).json("O valor da prioridade não é válido.");
            }
            const result = await ObjetivoService.changePriority(id, prioridade);
            return res.json(result)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}


export default new ObjetivoController();