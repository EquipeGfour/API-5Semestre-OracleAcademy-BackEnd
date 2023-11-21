import { IObjetivo, Objetivo, Tarefa } from "../models";
import { PERMISSAO, STATUS } from "../utils/enum";
import TarefaService from "./TarefaService";



class WorkspaceService {

    public async findWorkByID(id: string) {
        try {
            const Workspace = await Objetivo.findOne({ _id: id, workspace: true })
                .populate('proprietario');
            if (!Workspace) {
                throw `Objetivo ${id} não encontrada.`;
            }
            return Workspace as IObjetivo
        } catch (error) {
            throw error;
        }
    }


    public async findAllWorkspacesByUser(id: string) {
        try {
            const workspaces = await Objetivo.find({ $and: [{ workspace: true }, { $or: [{ proprietario: id }, { "usuarios.usuario": id }] }] }).populate('tarefas proprietario usuarios.usuario').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios', populate: { path: 'usuario' }
                }
            }).exec();
            return workspaces;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async addUserToWorkspace(id, usuarios) {
        try {
            const novaLista = usuarios.map((usuario) => {
                return { usuario: usuario._id, permissao: PERMISSAO.MEMBRO }
            })
            const objetivo = await Objetivo.findById(id);
            if (objetivo) {
                const usuariosParaAdicionar = novaLista.filter((novoUsuario) => {
                    return !objetivo.usuarios.some((usuarioNaTarefa) => usuarioNaTarefa.usuario.equals(novoUsuario.usuario));
                });
                if (usuariosParaAdicionar.length > 0) {
                    objetivo.usuarios.push(...usuariosParaAdicionar);
                    await objetivo.save();
                }
            }

            return objetivo;
        } catch (error) {
            throw error;
        }
    }
    public async findWorkspaceByUser(usuario) {
        try {
            const { _id } = usuario;
            console.log(JSON.stringify(_id));
            const workspaces = await Objetivo.find({ $and: [{ workspace: true }, { "usuarios.usuario": _id }] }).populate('usuarios.usuario').exec();

            return workspaces;
        } catch (error) {
            throw error;
        }
    }

    public async updateTarefaStatusWork(idTarefa: string, status: string) {
        try {
            const tarefaExiste = await Tarefa.findById(idTarefa);
            if (!tarefaExiste) {
                throw `Tarefa ${idTarefa} não encontrada.`;
            }
            await Tarefa.updateOne({ _id: idTarefa }, { status: status });
            console.log("Tarefa atualizada com sucesso");
            return { message: 'Tarefa atualizada com sucesso' };
        } catch (error) {
            throw error;
        }
    }
    public async findAllWorkspacesByOwner(id: string) {
        try {
            const workspaces = await Objetivo.find({ $and: [{ workspace: true }, { $or: [{ proprietario: id }] }] }).populate('tarefas proprietario usuarios.usuario').exec();
            return workspaces;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    public async countDelayedTasksWorkspace(workspaceId: string): Promise<number> {
        try {
            const workspace = await Objetivo.findOne({ _id: workspaceId, workspace: true }).populate('tarefas').exec();
            if (!workspace) {
                throw new Error(`Workspace ${workspaceId} não encontrado.`);
            }
            const delayedTasksCount = workspace.tarefas.reduce((count, tarefa) => {
                if (tarefa.status === STATUS.ATRASADO) {
                    count++;
                }
                return count;
            }, 0);
            return delayedTasksCount;
        } catch (error) {
            throw error;
        }
    }
    public async countWorkedHours(userId: string): Promise<any> {
        try {
            const workspace = await Objetivo.findOne({ $or: [{ proprietario: userId }, { "usuarios.usuario": userId }] }).populate('tarefas').exec();
            let count = 0;
            workspace.tarefas.forEach(tarefa => {
                count += tarefa.cronometro
            });
            let sec = count / 1000

            function converte(segundo) {
                const FATOR_DE_CONVERSAO_HORAS = 3600;
                const FATOR_DE_CONVERSAO_MINUTOS = 60;
                const FATOR_DE_CONVERSAO_SEGUNDOS = 60;
                const horas = (segundo / FATOR_DE_CONVERSAO_HORAS)
                const h = {
                    horas_inteiras: Math.trunc(horas),
                    horas_quebradas: (horas % 1),
                }

                const minutos = (h.horas_quebradas * FATOR_DE_CONVERSAO_MINUTOS)
                const m = {
                    minutos_inteiros: Math.trunc(minutos),
                    minutos_quebrados: minutos % 1,
                }
                const s = Math.floor((m.minutos_quebrados * FATOR_DE_CONVERSAO_SEGUNDOS))
                return { horas: h.horas_inteiras, minutos: m.minutos_inteiros, segundos: s }
            }
            return converte(sec)
        } catch (error) {
            throw error
        }
    }
    public async countInProgressTasks(userId: string): Promise<number> {
        try {
            const workspaces = await Objetivo.find({
                $or: [
                    { proprietario: userId },
                    { "usuarios.usuario": userId }
                ]
            }).populate('tarefas');
            let count = 0;
            workspaces.forEach(workspace => {
                workspace.tarefas.forEach(tarefa => {
                    if (tarefa.status === STATUS.EM_ANDAMENTO && tarefa.usuarios.some(u => u.usuario.toString() === userId)) {
                        count++;
                    }
                });
            });
            return count;
        } catch (error) {
            throw error;
        }
    }
    public async countIncompletedTasks(userId: string): Promise<number> {
        try {
            const workspaces = await Objetivo.find({
                $or: [
                    { proprietario: userId },
                    { "usuarios.usuario": userId }
                ]
            }).populate('tarefas');
            let count = 0;
            workspaces.forEach(workspace => {
                workspace.tarefas.forEach(tarefa => {
                    if (tarefa.status === STATUS.COMPLETO && tarefa.usuarios.some(u => u.usuario.toString() === userId)) {
                        count++;
                    }
                });
            });
            return count;
        } catch (error) {
            throw error;
        }
    }
    public async countInlateTasks(userId: string): Promise<number> {
        try {
            const workspaces = await Objetivo.find({
                $or: [
                    { proprietario: userId },
                    { "usuarios.usuario": userId }
                ]
            }).populate('tarefas');
            let count = 0;
            workspaces.forEach(workspace => {
                workspace.tarefas.forEach(tarefa => {
                    if (tarefa.status === STATUS.ATRASADO && tarefa.usuarios.some(u => u.usuario.toString() === userId)) {
                        count++;
                    }
                });
            });
            return count;
        } catch (error) {
            throw error;
        }
    }
}


export default new WorkspaceService();