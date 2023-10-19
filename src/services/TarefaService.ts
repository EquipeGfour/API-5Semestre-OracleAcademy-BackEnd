import { IUsuarios, ITarefa, Tarefa } from "../models";
import { PERMISSAO } from "../utils/enum";
import ObjetivoService from "./ObjetivoService";
import mongoose from "mongoose";


class TarefaService {
    public async createTarefa(titulo, descricao, data_estimada, prioridade, objetivo) {
        try {
            const tarefa = new Tarefa({
                titulo: titulo,
                descricao: descricao,
                data_estimada: data_estimada,
                prioridade: prioridade
            })
            const response = await tarefa.save();
            objetivo.tarefas.push(response);
            await objetivo.save();
            return response;
        } catch (error) {
            throw error
        }
    }

    public async findTarefasByObjetivoId(id) {
        try {
            const objetivo = await ObjetivoService.getObjetivoById(id);
            let tarefas = objetivo.tarefas
            if(tarefas.length > 1){
                tarefas.sort((a, b) => {
                    const dataEstimadaA = new Date(a.data_estimada.split('/').reverse().join('-')).getTime();
                    const dataEstimadaB = new Date(b.data_estimada.split('/').reverse().join('-')).getTime();
                    const dataAtual = new Date().getTime();

                    const diferencaA = Math.abs(dataEstimadaA - dataAtual);
                    const diferencaB = Math.abs(dataEstimadaB - dataAtual);

                    if (a.prioridade === b.prioridade) {
                        return diferencaA - diferencaB;
                    } else {
                        return a.prioridade - b.prioridade;
                    }
                });
            }

            return tarefas;
        } catch (error) {
            throw error;
        }
    }

    public async findTaskByID(id): Promise<ITarefa> {
        try {
            const tarefas = await Tarefa.findOne({_id:id}).populate('usuarios.usuario')
            if (!tarefas) {
                throw `Tarefa ${id} não encontrada.`;
            }
            return tarefas;
        } catch (error) {
            throw error;
        }
    }

    public async deleteTarefa(id: string) {
        try {
            const deleteTarefa = await Tarefa.findByIdAndDelete(id)
            return deleteTarefa
        } catch (error) {
            throw error;
        }
    }

    public async changePriority(id: string, novaPrioridade: any) {
        try {
            const tarefa = await Tarefa.findById(id)
            if (!tarefa) {
                throw `Tarefa ${id} não encontrada.`;
            }
            const prioridadeTarefa = await tarefa.updateOne({ prioridade: novaPrioridade })
            return prioridadeTarefa
        } catch (error) {
            throw error
        }
    }

    public async editarTarefa(tarefaId: string, titulo: string, descricao: string, data_estimada: string, prioridade: number) {
        try {
            const tarefa = await Tarefa.findById(tarefaId);

            if (!tarefa) {
                throw `Tarefa com ID ${tarefaId} não encontrada.`;
            }
            tarefa.titulo = titulo;
            tarefa.descricao = descricao;
            tarefa.data_estimada = data_estimada;
            tarefa.prioridade = prioridade;
            const tarefaAtualizada = await tarefa.save();

            return tarefaAtualizada;
        } catch (error) {
            throw error;
        }
    }

    public async updateUsuarios(id: string, novosUsuarios: IUsuarios[]) {
        try {
            const novaLista = novosUsuarios.map((usuario) => {
                return { usuario: new mongoose.Types.ObjectId(usuario._id) , permissao: PERMISSAO.LEITURA };
            });
            
            const tarefa = await Tarefa.findById(id);
            
            if (tarefa) {
                // Verifique se o usuário já está na lista
                const usuariosParaAdicionar = novaLista.filter((novoUsuario) => {
                    return !tarefa.usuarios.some((usuarioNaTarefa) => usuarioNaTarefa.usuario.equals(novoUsuario.usuario));
                });
            
                if (usuariosParaAdicionar.length > 0) {
                    // Adicione os novos usuários à lista
                    tarefa.usuarios.push(...usuariosParaAdicionar);
                    await tarefa.save();
                }
            }
            if (!tarefa) {
                throw `tarefa ${id} não encontrado.`;
            }

            // tarefa.usuarios = novosUsuarios;
            //await tarefa.save();
            return tarefa;
        } catch (error) {
            throw error;
        }
    }

    public async changeTaskStatus(id, status) {
        try {
            const task = await this.findTaskByID(id);
            task.status = status;
            await Tarefa.findByIdAndUpdate(id, task);
            return task;
        } catch (error) {
            throw error;
        }
    }

    public async onDeleteObjetivoDeleteAllTarefas(tarefas){
        const session = await mongoose.startSession();
        session.startTransaction()
        try{
            const options = { session };
            const filtro = { _id: { $in: tarefas } };
            await Tarefa.deleteMany(filtro, options);
            const result = await session.commitTransaction()
            return result;
        }catch(error){
            await session.abortTransaction();
            session.endSession()
            throw error;
        }
    }
}


export default new TarefaService();