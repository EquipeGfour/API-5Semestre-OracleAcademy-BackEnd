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

const buildDownloadLink = (fileId) : string => {
    return `https://drive.google.com/uc?id=${fileId}&export=download `;
}

//FORMATOS DOS LINKS DO DRIVE
//https://drive.google.com/u/1/uc?id={fileId}&export=download                  - BAIXA INSTANEO
//https://drive.google.com/file/d/{fileId}/view                                - ABRE O DRIVE PERMITINDO VISUALIZAR O ARQUIVO E BAIXAR
//https://drive.google.com/thumbnail?id={fileId}                               - SOMENTE VISUALIZA O ARQUIVO




const buildUploadObject = (nome, ext, id) : IArquivos => {
    const arquivo = {
        nome: nome,
        ext: ext,
        url: buildFileAccessLink(id),
        downloadUrl: buildDownloadLink(id)
    } as IArquivos
    return arquivo;
}

export { extractDataFromFile, buildFileAccessLink, buildUploadObject }