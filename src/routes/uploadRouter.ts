import { Router } from "express";
import { UploadController } from "../controllers";
import { authenticate } from "../middlewares";


const routes = Router();

routes.post("/usuario", UploadController.uploadUserFile);
routes.post("/tarefa/:id", authenticate, UploadController.uploadFileFromTask);


export default routes;