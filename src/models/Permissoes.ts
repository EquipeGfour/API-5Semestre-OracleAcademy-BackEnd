import { Schema } from "mongoose";
import { PERMISSAO } from "../utils/enum";

interface IPermissoes {
    usuario: any; // Use 'any' ou 'Schema.Types.Mixed' para aceitar qualquer objeto
    permissao: PERMISSAO;
}

const Permissoes = new Schema<IPermissoes>({
    usuario: {
        type: Schema.Types.Mixed,
        required: true // Defina como requerido se necessário
    },
    permissao: {
        type: Number,
        enum: PERMISSAO,
        default: PERMISSAO.LEITURA
    }
});

export { IPermissoes, Permissoes };