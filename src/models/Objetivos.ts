import Tarefas from "./Tarefas"

export default interface Objetivos {
    id?: string | null,
    titulo: string,
    descricao: string,
    progresso: number,
    total_tarefas: number,
    prioridade: Enumerator
    data_criacao: Date,
    data_inicio: Date,
    data_conclusao: Date,
    data_estimada: Date,
    status: Enumerator
    tarefas: Tarefas
}