import mongoose from 'mongoose';
import { PRIORIDADES, STATUS } from "../utils/enum";


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
    status: STATUS
}

const objetivo = new Schema({
    titulo: String,
    descricao: String,
    progresso: {
        type: Number,
        default: 0,
        require: false
    },
    total_tarefas: {
        type: Number,
        default: 0,
        require: false
    },
    prioridade: {
        type: Number,
        enum: PRIORIDADES,
        default: PRIORIDADES.BAIXO,
        require: false
    },
    data_criacao: {
        type: String, 
        require: false,
        default: new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(',')[0],
    },
    data_inicio: {
        type: String, 
        require: false,
        default:""
    },
    data_conclusao: {
        type: String, 
        require: false,
        default:""
    },
    data_estimada: {
        type: String, 
        require: true,
        default: new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(',')[0],
    },
    status: {
        type: Number,
        enum: STATUS,
        default: STATUS.NAO_INICIADO,
        require: false
    }
})

const Objetivo = mongoose.model<IObjetivo>("objetivos", objetivo);

export { Objetivo, IObjetivo };