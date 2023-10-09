import { IUsuarios, ITarefa, Tarefa } from "../models";
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
            await objetivo.save();
            return response;
        } catch (error) {
            throw error
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

    public async findTaskByID(id): Promise<ITarefa> {
        try {
            const tarefas = await Tarefa.findById(id)
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
}


export default new TarefaService();