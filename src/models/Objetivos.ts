import mongoose from 'mongoose';
import { PRIORIDADES, STATUS } from "../utils/enum";
import { ITarefa } from './Tarefas';


const { Schema } = mongoose;

interface IObjetivo {
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
    tarefas: ITarefa []
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
    status: {
        type: Number,
        enum: STATUS,
        default: STATUS.NAO_INICIADO
    },
    //tarefas: Tarefas []
})

const Objetivo = mongoose.model<IObjetivo>("objetivos", objetivo);

export { Objetivo, IObjetivo };