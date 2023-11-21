import { IUsuarios, Objetivo, Tarefa, Usuarios } from "../models"
import { PERMISSAO } from "../utils/enum";
import { startOfMonth, endOfMonth } from 'date-fns';
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

    public async getDataByMonth(date: Date, usuario): Promise<any> {
        try {
            const firstDayOfMonth = startOfMonth(date);
            const lastDayOfMonth = endOfMonth(date);

            const formattedFirstDay = firstDayOfMonth.toLocaleDateString('pt-BR');
            const formattedLastDay = lastDayOfMonth.toLocaleDateString('pt-BR');

            const result = await Objetivo.find({
                $and: [
                    { data_criacao: { $gte: formattedFirstDay, $lt: formattedLastDay } },
                    { proprietario: usuario._id }
                ]
            });
            // Inicializa o dicionário para contar os objetivos por status
            const statusCount: { [status: number]: number } = {
                1: 0,
                2: 0,
                3: 0,
            };

            // Conta os objetivos por status
            result.forEach(objetivo => {
                const status = objetivo.status;
                const parts = objetivo.data_criacao.split('/');
                const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                
                if (
                    new Date(formattedDate) &&
                    new Date(formattedDate) >= new Date(firstDayOfMonth) &&
                    new Date(formattedDate) <= new Date(lastDayOfMonth)
                ) {
                    statusCount[status] += 1;
                }
            });

            return statusCount;
        } catch (error) {
            throw error;
        }
    }
}
export default new ObjetivoService();