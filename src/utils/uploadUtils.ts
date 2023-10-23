import { UploadedFile } from "express-fileupload";
import { IArquivos } from "../models/Arquivos";

const extractDataFromFile = (uploadFile: UploadedFile) => {
    const [,ext] = uploadFile.name.split(".");
    const fileName = `${Date.now()}.${ext}`;
    const file = { fileName: fileName, mimeType: uploadFile.mimetype, fileContent: uploadFile.data, ext:ext }
    return file;
}


const buildFileAccessLink = (fileId) : string => {
    return `https://drive.google.com/thumbnail?id=${fileId}`;
}

const buildUploadObject = (nome, ext, id) : IArquivos => {
    const arquivo = {
        nome: nome,
        ext: ext,
        url: buildFileAccessLink(id)
    } as IArquivos
    return arquivo;
}

export { extractDataFromFile, buildFileAccessLink, buildUploadObject }