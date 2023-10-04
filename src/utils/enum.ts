enum STATUS{
    COMPLETO = 1,
    EM_ANDAMENTO = 2,
    NAO_INICIADO = 3,
    ATRASADO = 4
}

enum PRIORIDADES{
    URGENTE = 1,
    ALTA = 2,
    MEDIA = 3,
    BAIXO = 4
}

enum PERMISSAO{
    ADM = 1,
    EDICAO_E_CRIACAO = 2,
    LEITURA = 3
}


export { STATUS, PRIORIDADES, PERMISSAO }