import mongoose from "mongoose"
import { PRIORIDADES, STATUS } from "../utils/enum"
import Arquivos from "./Arquivos"


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
    arquivos: Arquivos
}

const tarefa = new Schema({
    titulo: String,
    descricao: String,
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
    anexo: Boolean,
    //arquivos: Arquivos
});

const Tarefa = mongoose.model<ITarefa>("tarefas", tarefa);

export { Tarefa, ITarefa };