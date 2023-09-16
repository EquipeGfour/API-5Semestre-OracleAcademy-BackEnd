import { connection } from "../config/db";
import { Objetivos, Tarefas } from "../models";


class TarefaService {
    public async createTarefa(id: string, tarefa: Tarefas): Promise<Tarefas[]> {
        try {
            let response = await connection.collection("objetivos").doc(id);
            let values = await response.get();
            if (values.exists) {
                const listaObjetivos: Tarefas[] = (values.data() as Objetivos).tarefas;
                listaObjetivos.push(tarefa);
                console.log(listaObjetivos)
                response.update({ tarefas: listaObjetivos })
                return listaObjetivos;
            } else {
                throw `Objetivo ${id} não encontrado...`
            }
        } catch (error) {
            throw error
        }
    }
}


export default new TarefaService();