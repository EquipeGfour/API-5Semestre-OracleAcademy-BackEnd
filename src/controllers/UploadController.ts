import { Request, Response } from "express";


class UploadController{
    public async uploadFile(req: Request, res: Response){
        try{
            console.log("aqui")
            const file = req.files; // Use req.files['file'] to access the uploaded file
            console.log(file);

            return file;
        }catch(error){
            console.log(error);
            res.json(error);
        }
    }
}

export default new UploadController();