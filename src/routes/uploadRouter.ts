import { Router } from "express";
import { UploadController } from "../controllers";


const routes = Router();

routes.post("/usuario", UploadController.uploadUserFile);
routes.post("/tarefa/:id", UploadController.uploadFileFromTask);


export default routes;