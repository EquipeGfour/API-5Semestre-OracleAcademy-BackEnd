import { PRIORIDADES, STATUS } from "../utils/enum"
import Arquivos from "./Arquivos"

export default interface Tarefas {
    id?: string | null,
    titulo: string,
    descricao: string,
    prioridade: PRIORIDADES
    data_criacao: Date,
    data_inicio: Date,
    data_conclusao: Date,
    data_estimada: Date,
    status: STATUS,
    anexo: Boolean,
    arquivos: Arquivos
}