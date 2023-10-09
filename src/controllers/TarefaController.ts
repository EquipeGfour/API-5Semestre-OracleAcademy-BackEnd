import { Request, Response } from "express";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { ObjetivoService } from "../services";
import { idEhValido } from "../utils/utils";
import { Tarefa } from "../models";
import TarefaService from "../services/TarefaService";


class TarefaController {
    public async criarTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!idEhValido(id)) {
                throw `id ${id} não é valido...`;
            }
            const objetivo = await ObjetivoService.getObjetivoById(id);
            const { titulo, descricao, data_estimada, prioridade } = req.body;
            const response = await TarefaService.createTarefa(titulo, descricao, data_estimada, prioridade, objetivo);
            return res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async buscarTarefaPorIds(req: Request, res: Response) {
        try {
            const { objetivoId } = req.params;
            const { tarefaId } = req.body;
            const tarefa = await TarefaService.findTarefaById(objetivoId, tarefaId);
            return res.json(tarefa);
        } catch (error) {
            res.status(500).json({ error: error.message || "Ocorreu um erro durante a busca da tarefa." });
        }
    }

    public async excluirTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await TarefaService.findTaskByID(id);
            const deletedTarefa = await TarefaService.deleteTarefa(id)
            return res.json(`tarefa ${id} excluida com sucesso...`)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    public async alterarPrioridade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { prioridade } = req.body
            const prioridadeInt = parseInt(prioridade)
            const result = await TarefaService.changePriority(id, prioridadeInt)
            return res.json(result)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    public async editarTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { titulo, descricao, data_estimada, prioridade } = req.body;
            if (
                !titulo ||
                !descricao ||
                !data_estimada ||
                !prioridade
            ) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            } 
            const tarefa = await TarefaService.editarTarefa(
                id,
                titulo,
                descricao,
                data_estimada,
                prioridade
            );
            return res.json(tarefa);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async buscarTarefaID(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tarefas = await TarefaService.findTaskByID(id);
            return res.json(tarefas);
        } catch (error) {
            res.status(500).json({ error: error.message || "Ocorreu um erro durante a busca das tarefas do objetivo." });
        }
    }
    public async buscarTarefas(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tarefas = await TarefaService.findTarefasByObjetivoId(id);
            return res.json(tarefas);
        } catch (error) {
            res.status(500).json({ error: error.message || "Ocorreu um erro durante a busca das tarefas do objetivo." });
        }
    }
    // public async BuscarTarefas(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; 
    //         const tarefas: Tarefas[] = await TarefaService.findtaskID(id); 
    //         res.json(tarefas);
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
    // public async EditarTarefa(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; 
    //         const { taskId } = req.body; 
    //         const updatedTaskData: Tarefas = req.body.updatedTask; 
    //         const tarefas: Tarefas[] = await TarefaService.findtaskID(id);
    //         const taskIndex = tarefas.findIndex((task) => task.id === taskId);
    //         if (taskIndex === -1) {
    //             return res.status(404).json({ message: `Tarefa com ID ${taskId} não encontrada no objetivo ${id}...` });
    //         }
    //         tarefas[taskIndex] = { ...tarefas[taskIndex], ...updatedTaskData };
    //         const updatedTarefas: Tarefas[] = await TarefaService.editTask(id, taskId, updatedTaskData);
    //         res.json(updatedTarefas);
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
    // public async DeletarTarefa(req: Request, res: Response){
    //     try {
    //         const { id, idtarefa } = req.params            
    //         await TarefaService.deleteTafefa(id, idtarefa)
    //         return res.json({ message: `Tarefa com ID ${id} deletado com sucesso` })
    //     } catch (error) {

    //         res.status(500).json(error)
    //     }
    // }
    // public async MudarPrioridadeDaTarefa(req: Request, res: Response){
    //     try{
    //         const {id} = req.params;
    //         const idTarefa = req.body.id;
    //         const prioridade = req.body.prioridade

    //         const response = await TarefaService.changeTaskPriority(id, idTarefa, prioridade);
    //         return res.json(response);
    //     }catch(error){
    //         res.status(500).json(error);
    //     }
    // }
}

export default new TarefaController();