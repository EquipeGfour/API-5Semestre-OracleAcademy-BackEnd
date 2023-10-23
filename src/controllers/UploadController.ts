import DriveController from "./DriveController";
import { Request, Response } from "express";
import { buildUploadObject, extractDataFromFile } from "../utils/uploadUtils"
import { IArquivos, Tarefa } from "../models";
import { TarefaService } from "../services";


class UploadController{

    public async uploadUserFile(req: Request, res: Response){
        try{
            let body = req.files.file;
            if(Array.isArray(body)){
                body = body[0]
            }
            const file = extractDataFromFile(body);
            const drive = DriveController.DriveInstance;
            const folders = await drive.searchFolder("users");
            if(folders.length < 1){
                return res.status(404).json(`Pasta users não encontrada.`);
            }
            await drive.sendFile(file.fileName, file.mimeType, file.fileContent, folders[0].id);
            return res.json(`arquivo enviado com sucesso!`);
        }catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }

    public async uploadFileFromTask(req: Request, res: Response){
        try{
            const { id } = req.params;
            const task = await TarefaService.findTaskByID(id);
            let body = req.files.file;
            if(Array.isArray(body)){
                body = body[0]
            }
            const file = extractDataFromFile(body);
            const drive = DriveController.DriveInstance;
            const folders = await drive.searchFolder("tasks");
            if(folders.length < 1){
                return res.status(404).json(`Pasta users não encontrada.`);
            }
            const response = await drive.sendFile(file.fileName, file.mimeType, file.fileContent, folders[0].id);
            const arquivo: IArquivos = buildUploadObject(file.fileName, file.ext, response.data.id);
            task.anexo = true;
            task.arquivos.push(arquivo);
            await Tarefa.updateOne({_id:task._id}, {$set:{arquivos: task.arquivos}});
            return res.json(`arquivo enviado com sucesso!`);
        }catch(error){
            console.error(error);
            res.status(500).json(error);
        }
    }

}

export default new UploadController();