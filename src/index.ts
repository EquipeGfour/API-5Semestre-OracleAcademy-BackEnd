import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
// import routes from "./routes";
import startDb from "./config/db";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger_output.json';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

startDb();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
// app.use(routes);

app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`));