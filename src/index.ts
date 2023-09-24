import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes";
import db from "./config/db";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger_output.json';

dotenv.config();
const PORT = process.env.PORT || 3004;

const app = express();

db()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(cors());

app.use(routes);

app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`));