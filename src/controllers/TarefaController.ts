import { Request, Response } from "express";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { ObjetivoService } from "../services";
import { IUsuarios, Tarefa } from "../models";
import { idEhValido, verificarStatus } from "../utils/utils";
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

    public async buscarTarefas(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tarefas = await TarefaService.findTarefasByObjetivoId(id);
            return res.json(tarefas);
        } catch (error) {
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca das tarefas do objetivo." });
        }
    }

    public async buscarTarefaPorId(req:Request , res:Response){
        try{
            const { id } = req.params;
            const tarefas = await TarefaService.findTaskByID(id);
            return res.json(tarefas);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca das tarefas do objetivo." });
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

    public async mudarStatusDaTarefa(req:Request, res:Response){
        try{
            const { id } = req.params;
            const { status } = req.body;
            if(!verificarStatus(status)){
                return res.status(422).json("O valor do status não é válido.");
            }
            const tarefa = await TarefaService.changeTaskStatus(id, status);
            return res.json(tarefa);
        }catch(error){
            res.status(500).json(error);
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