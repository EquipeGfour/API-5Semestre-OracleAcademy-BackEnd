import { connection } from "../config/db";
import { Objetivos, Tarefas } from "../models";


class TarefaService {
    public async createTarefa(id: string, tarefa: Tarefas): Promise<Tarefas[]> {
        try {
            const response = await connection.collection("objetivos").doc(id).get();
            if (!response.exists) {
                throw `Objetivo ${id} não encontrado...`
            }
            const listaObjetivos: Tarefas[] = (response.data() as Objetivos).tarefas;
            listaObjetivos.push(tarefa);
            await connection.collection("objetivos").doc(id).update({ tarefas: listaObjetivos });
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
}


export default new TarefaService();