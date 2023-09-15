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
}


export default new ObjetivoController();