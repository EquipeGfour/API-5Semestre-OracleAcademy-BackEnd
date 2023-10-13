import { IUsuarios, Objetivo, Tarefa, Usuarios } from "../models"
import { PERMISSAO } from "../utils/enum";
import mongoose from "mongoose";


class ObjetivoService {
    public async createObjetivo(objetivo) {
        try {
            const response = await Objetivo.create(objetivo);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async findAllObjetivosByUser(usuario) {
        try {
            const objetivos = await Objetivo.find({$and:[{proprietario:usuario._id}, {workspace:false}]}, '-__v').populate("tarefas proprietario usuarios.usuario", "-__v").exec();
            return objetivos;
        } catch (error) {
            throw error;
        }
    }

    public async getObjetivoById(id: string) {
        try {
            const objetivo = await Objetivo.findById(id, '-__v').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios',populate:{path: 'usuario'}
                }
            })
            .populate('proprietario', '-__v').exec();
            if (!objetivo) {
                throw `objetivo ${id} não encontrado....`;
            }
            return objetivo;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async updateObjetivo(id: string, objetivoData: any) {
        try {
            const updatedObjetivo = await Objetivo.findByIdAndUpdate(
                id,
                objetivoData,
                { new: true }
            );
            if (!updatedObjetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            return updatedObjetivo;
        } catch (error) {
            throw error;
        }
    }

    public async deleteObjetivo(id: string) {
        try {
            const deleteObjetivo = await Objetivo.findByIdAndDelete(id);
            return deleteObjetivo
        } catch (error) {
            throw error
        }
    }

    public async addUserWorkspace(id, usuarios) {
        try {
            const novaLista = usuarios.map((usuario) => {
                return {usuario: usuario._id, permissao:PERMISSAO.LEITURA}
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

    public async changePriority(id: string, novaPrioridade: any) {
        try {
            const objetivo = await Objetivo.findById(id);
            if (!objetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            const prioridadeObjetivo = await objetivo.updateOne({ prioridade: novaPrioridade });
            return prioridadeObjetivo;
        } catch (error) {
            throw error;
        }
    }

    public async findAllWorkspacesByUser(id){
        try{
            const workspaces = await Objetivo.find({$and: [{workspace: true}, {$or: [{proprietario: id}, {"usuarios.usuario": id}]}]}).populate('tarefas proprietario usuarios.usuario').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios',populate:{path: 'usuario'}
                }
            }).exec();
            return workspaces;
        }catch(error){
            console.log(error)
            throw error;
        }
    }

}


export default new ObjetivoService();