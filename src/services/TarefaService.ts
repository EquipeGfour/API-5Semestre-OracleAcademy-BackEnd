import { IUsuarios, Tarefa } from "../models"
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
    public async updateUsuarios(id: string, novosUsuarios: IUsuarios[]) {
        try {
            const tarefa = await Tarefa.findById(id);
            if (!tarefa) {
                throw new Error(`tarefa ${id} não encontrado.`);
            }
            tarefa.usuarios = novosUsuarios;
            await tarefa.save();

            return tarefa;
        } catch (error) {
            throw error;
        }
    }
}


export default new TarefaService();