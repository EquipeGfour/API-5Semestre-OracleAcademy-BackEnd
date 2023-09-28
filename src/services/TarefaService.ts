import {Tarefa} from "../models"


class TarefaService {
    public async createTarefa(titulo, descricao, data_estimada, prioridade, objetivo ) {
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

    // public async findtaskID(id: string): Promise<Tarefas[]> {
    //     try {
    //         const response = await connection.collection("objetivos").doc(id).get();
    //         if (!response.exists) {
    //             throw `Objetivo ${id} não encontrado...`;
    //         }
    //         const listaObjetivos: Tarefas[] = (response.data() as IObjetivos).tarefas;
    //         return listaObjetivos;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
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