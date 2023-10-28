import { Request, Response } from "express";
import { ObjetivoService } from "../services";
import { IUsuarios } from "../models";
import { idEhValido, verificarPrioridade, verificarStatus } from "../utils/utils";
import { TarefaService } from "../services"


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

    public async buscarTarefaPorId(req: Request, res: Response) {
        try {
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
            await TarefaService.deleteTarefa(id)
            return res.json(`tarefa ${id} excluida com sucesso...`)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    public async alterarPrioridade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { prioridade } = req.body
            if (!verificarPrioridade(prioridade)) {
                return res.status(422).json("O valor da prioridade não é válido.");
            }
            const result = await TarefaService.changePriority(id, prioridade)
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
                console.log(titulo, descricao, data_estimada, prioridade)
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

    public async mudarStatusDaTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!verificarStatus(status)) {
                return res.status(422).json("O valor do status não é válido.");
            }
            const tarefa = await TarefaService.changeTaskStatus(id, status);
            return res.json(tarefa);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async adicionarUsuariosTarefa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const novosUsuarios: IUsuarios[] = req.body;
            const updatetarefa = await TarefaService.updateUsuarios(id, novosUsuarios);
            return res.status(200).json(updatetarefa);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async buscarTarefaStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const usuario = res.locals.jwtPayload;

            const tarefas = await TarefaService.findTarefaByStatus(usuario, status);

            return res.json(tarefas);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca de tarefas por filtro." })
        }
    }

    public async buscarTarefasExpiradas(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;

            const tarefasExpiradas = await TarefaService.findTarefasExpiradasUsuario(usuario);

            return res.json(tarefasExpiradas)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca de tarefas expiradas" })
        }
    }

    public async atualizarCronometro(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { cronometro } = req.body;
            if (!cronometro) {
                return res.status(400).json({ error: 'O campo "cronometro" é obrigatório.' });
            }
            const cronometroNumber = parseInt(cronometro, 10); 
            if (isNaN(cronometroNumber)) {
                return res.status(400).json({ error: 'O formato do novo cronômetro não é válido. Deve ser um número.' });
            }
            const tarefaAtualizada = await TarefaService.updateChronometer(id, cronometroNumber);
            return res.json(tarefaAtualizada);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async buscarCronometro(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'O campo "id" é obrigatório.' });
            }
            const cronometro = await TarefaService.findChronometer(id);
            return res.json({ cronometro });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default new TarefaController();