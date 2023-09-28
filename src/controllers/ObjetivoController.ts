import { Request, Response } from "express";
import { ObjetivoService } from "../services";
import { Objetivo, IObjetivo } from "../models";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { idEhValido } from "../utils/utils";

class ObjetivoController {
    public async cadastrarObjetivo(req: Request, res: Response) {
        try {
            const { titulo, descricao, data_estimada, prioridade } = req.body;
            console.log(req.body)
            let novoObjetivo = new Objetivo({
                titulo: titulo,
                descricao: descricao,
                data_estimada: data_estimada,
                prioridade: prioridade,
            });
            const objetivo = await ObjetivoService.createObjetivo(novoObjetivo);
            return res.json(objetivo);
        } catch (error){
            res.status(500).json(error);
        }
    }

    public async buscarTodosOsObjetivos(req: Request, res: Response) {
        try {
            const objetivos = await ObjetivoService.findAll();
            return res.json(objetivos);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async buscarPorUmObjetivo(req: Request, res: Response){
        try{
            const { id } = req.params;
            if(!idEhValido(id)){
                throw `id ${id} não é valido...`;
            }
            const objetivo = await ObjetivoService.getObjetivoById(id);
            res.status(200).json(objetivo);
        }catch(error){
            res.status(500).json({message:error});
        }
    }
    // public async deletarObjetivo(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; 
    //         await ObjetivoService.deleteObjetivo(id);
    //         return res.json({ message: `Objetivo com ID ${id} deletado com sucesso` });
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
    // public async editarObjetivo(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; 
    //         const { titulo, descricao, data_estimada } = req.body;
    //         const objetivo: IObjetivos = await ObjetivoService.getObjetivoById(id);
    //         objetivo.id = id
    //         objetivo.titulo = titulo
    //         objetivo.data_estimada = data_estimada
    //         objetivo.descricao = descricao
    //         await ObjetivoService.updateObjetivo(id, titulo, descricao, data_estimada)
    //         return res.json(objetivo)
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
    // public async alterarPrioridade(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const { novaPrioridade } = req.body;
    //         const prioridadeInt = parseInt(novaPrioridade);
    //         if (![1, 2, 3, 4].includes(prioridadeInt)) {
    //             return res.status(400).json({ error: "Valor de prioridade inválido. A prioridade deve ser 1, 2, 3 ou 4" });
    //         }
    //         const result = await ObjetivoService.changePriority(id, prioridadeInt);
    //         return res.json(result);
    //     } catch (error) {
    //         res.status(500).json(error);
    //     }
    // }
}


export default new ObjetivoController();