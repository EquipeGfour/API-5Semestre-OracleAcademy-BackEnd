import { IUsuarios, Objetivo, Tarefa, Usuarios } from "../models"
import { PERMISSAO } from "../utils/enum";
import mongoose from "mongoose";


class ObjetivoService {
    public async createObjetivo(objetivo) {
        try {
            const response = await Objetivo.create(objetivo);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async findAllObjetivosByUser(usuario) {
        try {
            const objetivos = await Objetivo.find({ $and: [{ proprietario: usuario._id }, { workspace: false }] }, '-__v').populate("tarefas proprietario usuarios.usuario", "-__v").exec();
            return objetivos;
        } catch (error) {
            throw error;
        }
    }

    public async getObjetivoById(id: string) {
        try {
            const objetivo = await Objetivo.findById(id, '-__v').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios', populate: { path: 'usuario' }
                }
            })
                .populate('proprietario', '-__v').exec();
            if (!objetivo) {
                throw `objetivo ${id} não encontrado....`;
            }
            return objetivo;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async updateObjetivo(id: string, objetivoData: any) {
    try {
        const objetivo = await Objetivo.findByIdAndUpdate(id, {}, { new: true });
        if (!objetivo) {
            throw new Error(`Objetivo ${id} não encontrado.`);
        }
        if (objetivoData.titulo) {
            objetivo.titulo = objetivoData.titulo;
        }
        if (objetivoData.descricao) {
            objetivo.descricao = objetivoData.descricao;
        }
        if (objetivoData.data_estimada) {
            objetivo.data_estimada = objetivoData.data_estimada;
        }
        if (objetivoData.prioridade) {
            objetivo.prioridade = objetivoData.prioridade;
        }
        const updatedObjetivo = await objetivo.save();
        return updatedObjetivo;
    } catch (error) {
        throw error;
    }
}


    public async deleteObjetivo(id: string) {
        try {
            const deleteObjetivo = await Objetivo.findByIdAndDelete(id);
            return deleteObjetivo
        } catch (error) {
            throw error
        }
    }

    public async changePriority(id: string, novaPrioridade: any) {
        try {
            const objetivo = await Objetivo.findById(id);
            if (!objetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            const prioridadeObjetivo = await objetivo.updateOne({ prioridade: novaPrioridade });
            return prioridadeObjetivo;
        } catch (error) {
            throw error;
        }
    }

    public async countWorkedHours(workspaceId: string): Promise<any> {
        try {
            const objetivo = await Objetivo.findOne({ _id: workspaceId }).populate('tarefas').exec();
            let count = 0;
            objetivo.tarefas.forEach(tarefa => {
                count += tarefa.cronometro
            });
            let sec = count / 1000

            function converte (segundo) {
                const FATOR_DE_CONVERSAO_HORAS    = 3600;
                const FATOR_DE_CONVERSAO_MINUTOS  = 60;
                const FATOR_DE_CONVERSAO_SEGUNDOS = 60;
                const horas = (segundo/FATOR_DE_CONVERSAO_HORAS)
                const h = {
                    horas_inteiras: Math.trunc(horas), 
                    horas_quebradas: (horas % 1), 
                }
            
                const minutos = (h.horas_quebradas * FATOR_DE_CONVERSAO_MINUTOS)
                const m = {
                    minutos_inteiros: Math.trunc(minutos),
                    minutos_quebrados: minutos % 1,
                }
                const s = Math.floor((m.minutos_quebrados * FATOR_DE_CONVERSAO_SEGUNDOS))
                return {horas : h.horas_inteiras, minutos : m.minutos_inteiros,segundos : s}
            }
            return converte(sec)
        } catch (error) {
            throw error
        }
    }

}


export default new ObjetivoService();