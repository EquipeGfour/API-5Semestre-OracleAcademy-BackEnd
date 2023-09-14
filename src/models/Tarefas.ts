import Arquivos from "./Arquivos"

export default interface Tarefas {
    id?: string | null,
    titulo: string,
    descricao: string,
    prioridade: Enumerator
    data_criacao: Date,
    data_inicio: Date,
    data_conclusao: Date,
    data_estimada: Date,
    status: Enumerator,
    anexo: Boolean,
    arquivos: Arquivos
}