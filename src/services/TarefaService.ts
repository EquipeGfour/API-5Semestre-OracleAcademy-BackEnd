import { Tarefa } from "../models"
import ObjetivoService from "./ObjetivoService";

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
            await objetivo.save()
            return response;
        } catch (error) {
            throw error
        }
    }
    public async findTarefaById(objetivoId: string, tarefaId: string) {
        try {
            const tarefa = await Tarefa.findOne({ _id: tarefaId, objetivo: objetivoId });
            if (!tarefa) {
                throw `Tarefa com ID ${tarefaId} não encontrada no objetivo ${objetivoId}.`;
            }
            const atualizado = await tarefa.updateOne()
            return atualizado;
        } catch (error) {
            throw error;
        }
    }
    public async findallTarefa() {
        try {
            const tarefa = await Tarefa.find();
            if (!tarefa) {
                throw `tarefas nao encontradas`;
            }
            return tarefa;
        } catch (error) {
            throw error;
        }
    }
    public async findTarefasByObjetivoId(id) {
        try {
            const objetivo = await ObjetivoService.getObjetivoById(id);
            const tarefas = objetivo.tarefas
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

        }
    }
    public async findTaskByID(id) {
        try {
            const tarefas = await Tarefa.findById(id)
            if (!tarefas) {
                throw`Tarefa ${id} não encontrada.`;
            }
            return tarefas;
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

    public async editarTarefa(tarefaId: string, titulo: string, descricao: string, data_estimada:string, prioridade: number) {
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
    // public async editTask(objetivoId: string, taskIdFromBody: string, updatedTask: Tarefas): Promise<Tarefas[]> {
    //     try {
    //         const listaObjetivos = await this.findtaskID(objetivoId);
    //         const taskIndex = listaObjetivos.findIndex((task) => task.id === taskIdFromBody);
    //         if (taskIndex === -1) {
    //             throw `Tarefa com ID ${taskIdFromBody} não encontrada no objetivo ${objetivoId}...`;
    //         }
    //         listaObjetivos[taskIndex] = { ...listaObjetivos[taskIndex], ...updatedTask };
    //         await connection.collection("objetivos").doc(objetivoId).update({ tarefas: listaObjetivos });
    //         return listaObjetivos;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // public async deleteTafefa(id: string, taskIdFromBody: string) {
    //     try{
    //         const response = await connection.collection("objetivos").doc(id).get();
    //         if (!response.exists) {
    //             throw `Objetivo ${id} não encontrado...`
    //         }
    //         const Tarefa = (response.data() as IObjetivos).tarefas;
    //         let total_tarefas = (response.data() as IObjetivos).total_tarefas;          
    //         const taskIndex = Tarefa.filter((T) => T.id != taskIdFromBody)
    //         total_tarefas--;
    //         await connection.collection("objetivos").doc(id).update({ tarefas: taskIndex});
    //         return `Tarefa de ID ${id} excluída`;
    //     } catch (error) {
    //         throw error
    //     }
    // }
    // public async changeTaskPriority(idObjetivo: string, idTarefa: string, prioridade): Promise<string> {
    //     try{
    //         const response = await connection.collection("objetivos").doc(idObjetivo).get();
    //         if (!response.exists) {
    //             throw `Objetivo ${idObjetivo} não encontrado...`
    //         }
    //         const tarefas = (response.data() as IObjetivos).tarefas;
    //         tarefas.forEach((tarefa) => {
    //             if(tarefa.id === idTarefa){
    //                 tarefa.prioridade = prioridade;
    //             }
    //         })
    //         await connection.collection("objetivos").doc(idObjetivo).update({tarefas: tarefas})
    //         return `Prioridade da tarefa com ID ${idTarefa} foi atualizada com sucesso!!.`
    //     }catch(error){
    //         throw error
    //     }
    // }
}


export default new TarefaService();