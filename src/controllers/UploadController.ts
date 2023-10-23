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

    
    public async uploadFileFromTask(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const task = await TarefaService.findTaskByID(id);

            //verifica se o campo "file" esta sendo enviado
            if (!req.files) {
                return res.status(400).json("Campo file não recebido.");
            }

            //verifica se esta sendo enviado algum arquivo
            const [file] = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
            if (!file) {
                return res.status(400).json("Nenhum arquivo recebido.");
            }

            //extrai as informações do arquivo
            const fileData = extractDataFromFile(file);
            const drive = DriveController.DriveInstance;

            //busca pasta "task" no drive e verifica se ela foi encontrada
            const folders = await drive.searchFolder("tasks");
            if (folders.length < 1) {
                return res.status(404).json("Pasta tasks não encontrada.");
            }

            //envia arquivo para o drive
            const response = await drive.sendFile(fileData.fileName, fileData.mimeType, fileData.fileContent, folders[0].id);

            //monta o objeto do arquivo e adiciona na listad e arquivos para atualizar a tarefa
            const arquivo: IArquivos = buildUploadObject(fileData.fileName, fileData.ext, response.data.id);
            task.anexo = true;
            task.arquivos.push(arquivo);
            await Tarefa.updateOne({ _id: task._id }, { $set: { arquivos: task.arquivos } });
            return res.json("Arquivo enviado com sucesso!");
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    }

}

export default new UploadController();