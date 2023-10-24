import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import routes from "./routes";
import startDb from "./config/db";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger_output.json';
import { DriveController } from "./controllers";
import fileupload from "express-fileupload";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

startDb();

const GOOGLE_DRIVE_CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID
const GOOGLE_DRIVE_CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET
const GOOGLE_DRIVE_REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI
const GOOGLE_DRIVE_REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN

try{
    DriveController.initialize(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN);
}catch(error){
    console.error(error)
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(fileupload({limits:{files:1}}));
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`));