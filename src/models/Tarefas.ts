import { PRIORIDADES, STATUS } from "../utils/enum"
import Arquivos from "./Arquivos"

export default interface Tarefas {
    id?: string | null,
    titulo: string,
    descricao: string,
    prioridade: PRIORIDADES
    data_criacao: string,
    data_inicio: string,
    data_conclusao: string,
    data_estimada: string,
    status: STATUS,
    anexo: Boolean,
    arquivos: Arquivos | null
}