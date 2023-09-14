import { PRIORIDADES, STATUS } from "../utils/enum"
import Tarefas from "./Tarefas"

export default interface Objetivos {
    id?: string | null,
    titulo: string,
    descricao: string,
    progresso: number,
    total_tarefas: number,
    prioridade: PRIORIDADES,
    data_criacao: Date,
    data_inicio: Date,
    data_conclusao: Date,
    data_estimada: Date,
    status: STATUS,
    tarefas: Tarefas
}

