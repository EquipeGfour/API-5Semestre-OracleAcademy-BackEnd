import { Objetivo, Tarefa } from "../models";
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
            return Workspace;
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
    public async findworkspaceByStatus(usuario, status) {
        try {
            const objetivos = await Objetivo.find({
                $and: [
                    { proprietario: usuario._id },
                    { workspace: true },
                    { status: status }
                ]
            }, '-__v').populate("tarefas proprietario usuarios.usuario", "-__v").exec();
            return objetivos;
        } catch (error) {
            throw error;
        }
    }



}


export default new WorkspaceService();