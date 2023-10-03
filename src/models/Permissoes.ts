import mongoose from "mongoose";
import { PERMISSAO } from "../utils/enum";


const { Schema } = mongoose;

interface IPermissoes {
    //usuario:
    permissao:PERMISSAO
}

const Permissoes = new Schema({
    //usuario
    permissao: {
        type: Number,
        enum: PERMISSAO,
        default: PERMISSAO.LEITURA
    }
})

export { IPermissoes, Permissoes };