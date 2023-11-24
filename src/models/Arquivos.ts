import mongoose from "mongoose";


const { Schema } = mongoose;

interface IArquivos {
    nome: string,
    ext: string,
    url: string,
    downloadUrl: string
}

const Arquivo = new Schema({
    nome: String,
    ext: String,
    url: String,
    downloadUrl: String
})

export { IArquivos, Arquivo };