import mongoose from "mongoose"
import { PRIORIDADES, STATUS } from "../utils/enum"
import { Arquivos, IArquivos } from "./Arquivos"
import { IObjetivo, Objetivo } from "./Objetivos";


const { Schema } = mongoose;

interface ITarefa {
    titulo: string,
    descricao: string,
    prioridade: PRIORIDADES
    data_criacao: string,
    data_inicio: string,
    data_conclusao: string,
    data_estimada: string,
    status: STATUS,
    anexo: Boolean,
    arquivos: IArquivos,
    // objetivo_id: IObjetivo
}

const tarefa = new Schema({
    titulo: String,
    descricao: String,
    prioridade: {
        type: Number,
        enum: PRIORIDADES,
        default: PRIORIDADES.BAIXO
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
    data_estimada: String,
    status: {
        type: Number,
        enum: STATUS,
        default: STATUS.NAO_INICIADO,
        require:false
    },
    anexo: Boolean,
    //arquivos: Arquivos,
    // objetivo_id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: Objetivo,
    //     require: false
    // }
});

const Tarefa = mongoose.model<ITarefa>("tarefas", tarefa);

export { Tarefa, ITarefa };