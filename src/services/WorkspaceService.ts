import { IObjetivo, Objetivo, Tarefa } from "../models";
import { PERMISSAO, STATUS } from "../utils/enum";
import { startOfMonth, endOfMonth } from 'date-fns';
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
            const workspaces = await Objetivo.find({ $and: [{ workspace: true }, { "usuarios.usuario": _id }] }).populate('usuarios.usuario proprietario').exec();

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
    public async findWorkspacesByCompletion(id: string) {
        try {
            const workspaces = await Objetivo.find({ $and: [{ status: 1 }, { workspace: true }, { $or: [{ proprietario: id }] }] }).populate('tarefas proprietario usuarios.usuario').exec();
            return workspaces;
        } catch (error) {
            console.log(error)
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


    public async countTasksWorkspace(userId: string): Promise<number> {
        try {
            const workspaces = await Objetivo.find({ $or: [{ proprietario: userId }, { "usuarios.usuario": userId }] }).populate('tarefas').exec();
            if (!workspaces) {
                throw new Error(`Worspaces do Usuário ${userId} não encontrados.`);
            }
            let TasksCount = 0
            workspaces.forEach(workspaces => {
                workspaces.tarefas.forEach((tarefa, i) => {
                    if (tarefa.status === STATUS.COMPLETO && tarefa.usuarios.some(u => u.usuario.toString() === userId) ||
                        tarefa.status === STATUS.EM_ANDAMENTO && tarefa.usuarios.some(u => u.usuario.toString() === userId) ||
                        tarefa.status === STATUS.ATRASADO && tarefa.usuarios.some(u => u.usuario.toString() === userId)) {
                        TasksCount += workspaces.total_tarefas
                    }
                })
            })
            return TasksCount;
        } catch (error) {
            throw error;
        }
    }


    public async countWorkedHours(date: Date, userId: string): Promise<any> {
        try {
            const firstDayOfMonth = startOfMonth(date);
            const lastDayOfMonth = endOfMonth(date);

            const workspace = await Objetivo.findOne({ $or: [{ proprietario: userId }, { "usuarios.usuario": userId }], $and: [{ workspace: true }] }).populate('tarefas').exec();
            let count = 0;
            workspace.tarefas.forEach(tarefa => {
                if (
                    new Date(tarefa.data_estimada) &&
                    new Date(tarefa.data_estimada) >= new Date(firstDayOfMonth) &&
                    new Date(tarefa.data_estimada) <= new Date(lastDayOfMonth)
                ) {
                    count += tarefa.cronometro
                }
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

    public async getDataByMonth(date: Date, id: string) {
        try {
            const firstDayOfMonth = startOfMonth(date);
            const lastDayOfMonth = endOfMonth(date);

            const workspaces = await Objetivo.find({ $and: [{ workspace: true }, { $or: [{ proprietario: id }, { "usuarios.usuario": id }] }] }).populate('tarefas proprietario usuarios.usuario').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios', populate: { path: 'usuario' }
                }
            }).exec();

            // Inicializa o dicionário para contar os objetivos por status
            const statusCount: { [status: number]: number } = {
                1: 0,
                2: 0,
                3: 0,
                4: 0
            };

            // Conta os objetivos por status
            workspaces.forEach(objetivo => {
                objetivo.tarefas.forEach(tarefa => {
                    const status = tarefa.status;
                    const parts = tarefa.data_estimada.split('/');
                    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

                    if (
                        new Date(tarefa.data_estimada) &&
                        new Date(tarefa.data_estimada) >= new Date(firstDayOfMonth) &&
                        new Date(tarefa.data_estimada) <= new Date(lastDayOfMonth)
                    ) {
                        statusCount[status] += 1;
                    }
                });
            });


            return statusCount;
        } catch (error) {
            throw error;
        }
    }
}


export default new WorkspaceService();