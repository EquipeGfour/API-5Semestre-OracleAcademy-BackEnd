import mongoose from "mongoose"
import { Arquivo, IArquivos } from "./Arquivos";


const { Schema } = mongoose;


export default interface IUsuarios {
    _id: string;
    nome: string,
    senha: string,
    email: string,
    anexo: Boolean,
    foto: IArquivos
};

const usuarios = new Schema({
    nome: String,
    senha: String,
    email: String,
    anexo: {
        type: Boolean,
        default: false
    },
    foto: {
        type: Arquivo,
        require:false
    }
});

const Usuarios = mongoose.model<IUsuarios>("usuarios", usuarios);

export { Usuarios, IUsuarios };