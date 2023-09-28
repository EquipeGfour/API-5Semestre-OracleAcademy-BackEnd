import { Request, Response } from "express";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { ObjetivoService } from "../services";
import { idEhValido } from "../utils/utils";
import { Tarefa } from "../models";
import TarefaService from "../services/TarefaService";


class TarefaController{
    public async criarTarefa(req: Request, res: Response){
        try{
            const {id} = req.params;
            if(!idEhValido(id)){
                throw `id ${id} não é valido...`;
            }
            const objetivo = await ObjetivoService.getObjetivoById(id);
            const { titulo, descricao, data_estimada, prioridade } = req.body;

            const response = await  TarefaService.createTarefa(titulo, descricao, data_estimada, prioridade, objetivo);
            return res.status(200).json(response);
        }catch(error){
            res.status(500).json(error);
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
    // public async BuscarTarefaID(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; 
    //         const { id:taskId } = req.body;
    //         const tarefas: Tarefas[] = await TarefaService.findtaskID(id); 
    //         const taskEncontrada = tarefas.find((task) => task.id === taskId);
    //         if (taskEncontrada) {
    //             res.json(taskEncontrada);
    //         } else {
    //             res.status(404).json({ message: `Tarefa com ID ${taskId} não encontrada no objetivo ${id}` });
    //         }
    //     } catch (error) {
    //         res.status(500).json(error);
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