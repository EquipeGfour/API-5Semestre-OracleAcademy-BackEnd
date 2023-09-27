import mongoose from 'mongoose';
import { PRIORIDADES, STATUS } from "../utils/enum"
import Tarefas from "./Tarefas"

const { Schema } = mongoose;

export default interface IObjetivos {
    id?: string | null,
    titulo: string,
    descricao: string,
    progresso: number,
    total_tarefas: number,
    prioridade: PRIORIDADES,
    data_criacao: string,
    data_inicio: string,
    data_conclusao: string,
    data_estimada: string,
    status: STATUS,
    tarefas: Tarefas []
}

const objetivo = new Schema({
    titulo: String,
    descricao: String,
    progresso: Number,
    total_tarefas: Number,
    prioridade: {
        type: Number,
        enum: PRIORIDADES,
        default: PRIORIDADES.BAIXO
    },
    data_criacao: String,
    data_inicio: String,
    data_conclusao: String,
    data_estimada: String,
    status: STATUS,
    //tarefas: Tarefas []
})

export const Objetivo = mongoose.model<IObjetivos>("objetivos", objetivo);