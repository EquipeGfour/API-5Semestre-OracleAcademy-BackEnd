import mongoose from "mongoose";
import { PERMISSAO } from "../utils/enum";
import { IUsuarios, Usuarios } from "../models"


const { Schema } = mongoose;

interface IPermissoes {
    usuario: IUsuarios
    permissao:PERMISSAO
}

const Permissoes = new Schema({
    usuario:Usuarios,
    permissao: {
        type: Number,
        enum: PERMISSAO,
        default: PERMISSAO.LEITURA
    }
})

export { IPermissoes, Permissoes };