import { Request, Response } from "express";
import { ObjetivoService } from "../services";

class ObjetivoController {
    public async buscarTodosOsObjetivos(req: Request, res: Response) {
        try {
            const objetivos = await ObjetivoService.findAll();
            return res.json(objetivos);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async deletarObjetivo(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            await ObjetivoService.deleteObjetivo(id);
            return res.json({ message: `Objetivo com ID ${id} deletado com sucesso` });
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async alterarPrioridade(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { novaPrioridade } = req.body;
            const prioridadeInt = parseInt(novaPrioridade);
            if (![1, 2, 3, 4].includes(prioridadeInt)) {
                return res.status(400).json({ error: "Valor de prioridade inválido. A prioridade deve ser 1, 2, 3 ou 4" });
            }
            const result = await ObjetivoService.changePriority(id, prioridadeInt);
            return res.json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}


export default new ObjetivoController();