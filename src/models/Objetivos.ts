import { PRIORIDADES, STATUS } from "../utils/enum"
import Tarefas from "./Tarefas"

export default interface Objetivos {
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
    tarefas: [Tarefas]
}

