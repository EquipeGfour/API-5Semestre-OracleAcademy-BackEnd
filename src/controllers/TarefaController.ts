import { Request, Response } from "express";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { ObjetivoService } from "../services";
import { idEhValido } from "../utils/utils";
import { IUsuarios, Tarefa } from "../models";
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
    public async buscarTarefaID(req:Request , res:Response){
        try{
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
    public async adicionarUsuariosTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const novosUsuarios: IUsuarios[] = req.body.usuarios; 
            const updatetarefa = await TarefaService.updateUsuarios(id, novosUsuarios);
            return res.status(200).json(updatetarefa);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new TarefaController();