import mongoose from "mongoose";
import { IObjetivo, Objetivo } from "./Objetivos";
import IUsuarios, { Usuarios } from "./Usuarios";


const { Schema } = mongoose;


interface IWorkspace {
    titulo: string,
    data_criacao: string,
    objetivos:[IObjetivo],
    proprietario: IUsuarios,
    usuarios:[IUsuarios]
}


const workspace = new Schema({
    titulo: String,
    data_criacao:{
        type: String, 
        require: false,
        default: new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(',')[0],
    },
    objetivos: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:Objetivo
    }],
    proprietario: Usuarios,
    usuarios: [Permissions]
});


const Workspace = mongoose.model<IWorkspace>("tarefas", workspace);

export { Workspace, IWorkspace };