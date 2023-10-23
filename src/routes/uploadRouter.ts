import { Router } from "express";
import { UploadController } from "../controllers";
import uploadDrive from "../middlewares/uploadMiddleware";


const routes = Router();

routes.post("/usuario", UploadController.uploadUserFile);


export default routes;