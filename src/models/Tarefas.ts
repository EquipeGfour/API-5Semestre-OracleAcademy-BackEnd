import mongoose from "mongoose";
import { IArquivos } from "./Arquivos";
import IUsuarios from './Usuarios';
import { PERMISSAO, PRIORIDADES, STATUS } from "../utils/enum";


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
    usuarios:IUsuarios[]
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
    status: {
        type: Number,
        enum: STATUS,
        default: STATUS.NAO_INICIADO,
        require:false
    },
    anexo: Boolean,
    usuarios:[{
        usuario: {
            type: Schema.Types.Mixed,
            required: true // Defina como requerido se necessário
        },
        permissao: {
            type: Number,
            enum: PERMISSAO,
            default: PERMISSAO.LEITURA
        }
    }]
    //arquivos: Arquivos,
    // objetivo_id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: Objetivo,
    //     require: false
    // }
});

const Tarefa = mongoose.model<ITarefa>("tarefas", tarefa);

export { Tarefa, ITarefa };