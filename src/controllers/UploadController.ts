import { Request, Response } from "express";
import DriveController from "./DriveController";
import { extractDataFromFile } from "../utils/uploadUtils"


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

}

export default new UploadController();