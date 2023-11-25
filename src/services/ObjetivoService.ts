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
    public async getByCompletion(id: string) {
        try {
            const objetivos = await Objetivo.find({ $and: [{ status: 1 }, { proprietario: id }, { workspace: false }] }, '-__v').populate("tarefas proprietario usuarios.usuario", "-__v").exec();
            return objetivos;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async getDataByMonth(date: Date, usuario): Promise<any> {
        try {
            const firstDayOfMonth = startOfMonth(date);
            const lastDayOfMonth = endOfMonth(date);


            const result = await Objetivo.find({
                $and: [
                    { workspace: false },
                    { proprietario: usuario._id }
                ]
            }, '-__v').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios', populate: { path: 'usuario' }
                }
            })
                .populate('proprietario', '-__v').exec();

            // Inicializa o dicionário para contar os objetivos por status
            const statusCount: { [status: number]: number } = {
                1: 0,
                2: 0,
                3: 0,
                4: 0
            };
            
            // Conta os objetivos por status
            result.forEach(objetivo => {
                objetivo.tarefas.forEach(tarefa => {

                    const status = tarefa.status;
                    const parts = tarefa.data_estimada.split('/');
                    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    console.log(formattedDate)
                    if (
                        new Date(tarefa.data_estimada) &&
                        new Date(tarefa.data_estimada) >= new Date(firstDayOfMonth) &&
                        new Date(tarefa.data_estimada) <= new Date(lastDayOfMonth)
                    ) {
                        statusCount[status] += 1;
                    }
                });
            });
            
            return statusCount;

        } catch (error) {
            throw error;
        }
    }

    public async countWorkedHours(userId: string): Promise<any> {
        try {
            const objetivos = await Objetivo.findOne({
                $and: [
                    { workspace: false },
                    { proprietario: userId }
                ]
            }, '-__v').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios', populate: { path: 'usuario' }
                }
            }).exec();
            let count = 0;
            objetivos.tarefas.forEach(tarefa => {
                count += tarefa.cronometro
            });
            let sec = count / 1000

            function converte(segundo) {
                const FATOR_DE_CONVERSAO_HORAS = 3600;
                const FATOR_DE_CONVERSAO_MINUTOS = 60;
                const FATOR_DE_CONVERSAO_SEGUNDOS = 60;
                const horas = (segundo / FATOR_DE_CONVERSAO_HORAS)
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
                return { horas: h.horas_inteiras, minutos: m.minutos_inteiros, segundos: s }
            }
            return converte(sec)
        } catch (error) {
            throw error
        }
    }
}
export default new ObjetivoService();