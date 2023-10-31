import { Request, Response } from "express";
import { TarefaService, WorkspaceService } from "../services";
import { Tarefa } from "../models";
import { STATUS } from "../utils/enum";


class WorkspaceController {
    public async buscarWorkspaces(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findAllWorkspacesByUser(usuario._id);
            return res.json(workspaces);
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    public async buscarWorkspaceStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findworkspaceByStatus(usuario, status);
            return res.json(workspaces);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca de objetivos por filtro." });
        }
    }
    public async buscarWorkspaceByID(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const workspace = await WorkspaceService.findWorkByID(id);
            if (!workspace) {
                return res.status(404).json({ error: `Objetivo ${id} não encontrado.` });
            }
            return res.json(workspace);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    public async changeStatusWorkspace(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const {id,idTarefa} = req.params;
            const usuario = res.locals.jwtPayload;
            const workspace = await WorkspaceService.findWorkByID(id);

            if (workspace.proprietario._id === usuario._id) {
                const tarefa = await TarefaService.findTaskByID(idTarefa);
                tarefa.status = status;
                const tarefaAtualizada = await Tarefa.updateOne(tarefa);
                return res.json(tarefaAtualizada);
            } else {
                if (status === STATUS.COMPLETO) {
                    return res.status(403).json({ error: 'Sem Nivel de Acesso a Funcionalidade' });
                } else {
                    const tarefa = await TarefaService.findTaskByID(idTarefa);
                    tarefa.status = status;
                    const tarefaAtualizada = await Tarefa.updateOne(tarefa);
                    return res.json(tarefaAtualizada);
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}


export default new WorkspaceController()