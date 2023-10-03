import mongoose from "mongoose";


const { Schema } = mongoose;

interface IArquivos {
    nome: string,
    ext: string,
    url: string
}

const Arquivos = new Schema({
    nome: String,
    ext: String,
    url: String
})

export { IArquivos, Arquivos };