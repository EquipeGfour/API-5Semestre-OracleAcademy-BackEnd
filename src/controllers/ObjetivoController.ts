import { Request, Response } from "express";
import { ObjetivoService } from "../services";
import { Objetivo, IObjetivo, IUsuarios } from "../models";
import { PRIORIDADES, STATUS } from "../utils/enum";
import { idEhValido } from "../utils/utils";

class ObjetivoController {
    public async cadastrarObjetivo(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const { titulo, descricao, data_estimada, prioridade, workspace } = req.body;
            const workspaceValue = workspace || false;
            let novoObjetivo = new Objetivo({
                titulo: titulo,
                descricao: descricao,
                data_estimada: data_estimada,
                prioridade: prioridade,
                proprietario: usuario._id,
                workspace:workspaceValue
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
    public async editarObjetivo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const objetivoData = req.body;
            const updatedObjetivo = await ObjetivoService.updateObjetivo(id, objetivoData);
            return res.json(updatedObjetivo);
        } catch (error) {
            res.status(500).json({ error: error.message || "Ocorreu um erro durante a atualização do objetivo." });
        }
    }
    public async excluirObjetivo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ObjetivoService.getObjetivoById(id);
            const deletedObjetivo = await ObjetivoService.deleteObjetivo(id);
            return res.json(`objetivo ${id} excluido com sucesso...`);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    public async alterarPrioridade(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { prioridade } = req.body
            const prioridadeInt = parseInt(prioridade)
            const result = await ObjetivoService.changePriority(id, prioridadeInt)
            return res.json(result)
        } catch (error) {
            res.status(500).json(error)
        }
    }
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