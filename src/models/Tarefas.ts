import mongoose from "mongoose";
import { IArquivos, Arquivo } from "./Arquivos";
import { Usuarios } from './Usuarios';
import { PERMISSAO, PRIORIDADES, STATUS } from "../utils/enum";



const { Schema } = mongoose;

interface ITarefa {
    _id?: mongoose.Types.ObjectId,
    titulo: string,
    descricao: string,
    prioridade: PRIORIDADES
    data_criacao: string,
    data_inicio: string,
    data_conclusao: string,
    data_estimada: string,
    cronometro: string,
    status: STATUS,
    anexo: Boolean,
    arquivos: [IArquivos],
    // objetivo_id: IObjetivo
    usuarios:[{
        usuario: mongoose.Types.ObjectId,
        permissao: PERMISSAO
    }]
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
    data_estimada: {
        type: String, 
        require: true,
        default: new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(',')[0],
    },
    cronometro: {
        type: String,
        require: false,
        default: "00:00:00"
    },
    status: {
        type: Number,
        enum: STATUS,
        default: STATUS.NAO_INICIADO,
        require:false
    },
    anexo: Boolean,
    usuarios:[{
        usuario: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: Usuarios
        },
        permissao: {
            type: Number,
            enum: PERMISSAO,
            default: PERMISSAO.MEMBRO
        }
    }],
    arquivos: [Arquivo],
    // objetivo_id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: Objetivo,
    //     require: false
    // }
});

const Tarefa = mongoose.model<ITarefa>("tarefas", tarefa);

export { Tarefa, ITarefa };