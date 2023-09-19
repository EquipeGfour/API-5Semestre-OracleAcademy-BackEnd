import { connection } from "../config/db";
import { Objetivos, Tarefas } from "../models";


class TarefaService {
    public async createTarefa(id: string, tarefa: Tarefas): Promise<Tarefas[]> {
        try {
            const response = await connection.collection("objetivos").doc(id).get();
            if (!response.exists) {
                throw `Objetivo ${id} não encontrado...`
            }
            let total_tarefas: number = (response.data() as Objetivos).total_tarefas;
            total_tarefas++;
            const listaObjetivos: Tarefas[] = (response.data() as Objetivos).tarefas;
            listaObjetivos.push(tarefa);
            await connection.collection("objetivos").doc(id).update({ tarefas: listaObjetivos, total_tarefas:total_tarefas });
            return listaObjetivos;
        } catch (error) {
            throw error
        }
    }

    public async findtaskID(id: string): Promise<Tarefas[]> {
        try {
            const response = await connection.collection("objetivos").doc(id).get();
            if (!response.exists) {
                throw `Objetivo ${id} não encontrado...`;
            }
            const listaObjetivos: Tarefas[] = (response.data() as Objetivos).tarefas;
            return listaObjetivos;
        } catch (error) {
            throw error;
        }
    }
    public async editTask(objetivoId: string, taskIdFromBody: string, updatedTask: Tarefas): Promise<Tarefas[]> {
        try {
            const listaObjetivos = await this.findtaskID(objetivoId);
            const taskIndex = listaObjetivos.findIndex((task) => task.id === taskIdFromBody);
            if (taskIndex === -1) {
                throw `Tarefa com ID ${taskIdFromBody} não encontrada no objetivo ${objetivoId}...`;
            }
            listaObjetivos[taskIndex] = { ...listaObjetivos[taskIndex], ...updatedTask };
            await connection.collection("objetivos").doc(objetivoId).update({ tarefas: listaObjetivos });
            return listaObjetivos;
        } catch (error) {
            throw error;
        }
    }
    public async deleteTafefa(id: string, taskIdFromBody: string) {
        try{
            const response = await connection.collection("objetivos").doc(id).get();
            if (!response.exists) {
                throw `Objetivo ${id} não encontrado...`
            }
            const Tarefa = (response.data() as Objetivos).tarefas
            const taskIndex = Tarefa.filter((T) => T.id != taskIdFromBody)
            console.log(taskIndex)
            await connection.collection("objetivos").doc(id).update({ tarefas: taskIndex});
            return `Tarefa de ID ${id} excluída`;
        } catch (error) {
            throw error
        }
    }
}


export default new TarefaService();