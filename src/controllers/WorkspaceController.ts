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

    public async buscarWorkspacesByOwner(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findAllWorkspacesByOwner(usuario);
            return res.json(workspaces);
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    public async buscarWorkspaceUsuario(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            console.log(JSON.stringify(usuario));
            const workspaces = await WorkspaceService.findWorkspaceByUser(usuario);

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
            const id = req.query.id as string;
            const idTarefa = req.query.idTarefa as string;
            if (!res.locals.jwtPayload) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            const usuario = res.locals.jwtPayload;
            const workspace = await WorkspaceService.findWorkByID(id);
            if (workspace.proprietario._id.toString() === usuario._id) {
                await Tarefa.updateOne({ _id: idTarefa }, { status: status });
                const tarefaAtualizada = await Tarefa.findOne({ _id: idTarefa });
                if (tarefaAtualizada) {
                    return res.json(tarefaAtualizada);
                } else {
                    return res.status(404).json({ error: 'Tarefa não encontrada' });
                }
            } else {
                if (status === STATUS.COMPLETO) {
                    return res.status(403).json({ error: 'Sem Nível de Acesso à Funcionalidade' });
                } else {
                    const result = await WorkspaceService.updateTarefaStatusWork(idTarefa, status);
                    return res.json(result);
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


    public async countDelayedTasksWorkspace(req: Request, res: Response): Promise<void> {
        const workspaceId = req.params.workspaceId;
        try {
            const delayedTasksCount = await WorkspaceService.countDelayedTasksWorkspace(workspaceId);
            res.status(200).json({ count: delayedTasksCount });
        } catch (error) {
            res.status(500).json({ error: error.message || 'Erro interno do servidor' });
        }
    }

    public async countWorkedHours(req: Request, res: Response): Promise<void> {
        const userId = res.locals.jwtPayload
        try {
            const workedHoursCount = await WorkspaceService.countWorkedHours(userId)
            res.status(200).json({ workedHoursCount })
        } catch (error) {
            res.status(500).json({ error: error.message || 'Erro interno do servidor' })
        }
    }
    public async countInProgressTasks(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.jwtPayload._id;
            const inProgressTasksCount = await WorkspaceService.countInProgressTasks(userId);
            const inCompletedTasksCount = await WorkspaceService.countIncompletedTasks(userId);
            const workedHoursCount = await WorkspaceService.countWorkedHours(userId);
            const taskslate = await WorkspaceService.countInlateTasks(userId);
            const TasksWorkspaceCount = await WorkspaceService.countTasksWorkspace(userId)
            res.status(200).json({
                EmAndamento: inProgressTasksCount,
                Concluídos: inCompletedTasksCount,
                Atrasadas:taskslate,
                TarefasTotais: TasksWorkspaceCount,
                HorasTrabalhadas: workedHoursCount
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}


export default new WorkspaceController()