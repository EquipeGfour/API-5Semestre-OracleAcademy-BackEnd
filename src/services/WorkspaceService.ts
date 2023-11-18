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
    public async getDataByMonth(date: Date, id : string) {
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
            };

            // Conta os objetivos por status
            workspaces.forEach(objetivo => {
                const status = objetivo.status;
                const parts = objetivo.data_criacao.split('/');
                const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

                if (
                    new Date(formattedDate) &&
                    new Date(formattedDate) >= new Date(firstDayOfMonth) &&
                    new Date(formattedDate) <= new Date(lastDayOfMonth)
                ) {
                    statusCount[status] += 1;
                }
            });

            return statusCount;
        } catch (error) {
            throw error;
        }
    }
}

export default new WorkspaceService();