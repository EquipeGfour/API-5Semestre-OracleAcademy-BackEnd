import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';
import { UsuarioService, WorkspaceService } from '../services';
import { IObjetivo } from '../models';
import mongoose from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'API_5_ORACLE';
const UNAUTHORIZED_ERROR_MESSAGE = 'Usuario não possui autorização necessaria para está ação....'


export const generateToken = async (dados: any) => {
    return jwt.sign(dados.toJSON(), JWT_SECRET);
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: UNAUTHORIZED_ERROR_MESSAGE });
    }
    try {
        const [, token] = authorization.split(" ")
        const decoded = jwt.verify(token, JWT_SECRET);
        res.locals.jwtPayload = decoded;
    } catch (error) {
        res.status(401).send({ error: UNAUTHORIZED_ERROR_MESSAGE });
    }
    next();
};

export const authenticateAsADM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const workspaces = await WorkspaceService.findWorkByID(id);
        const usuario = res.locals.jwtPayload
        const usuarioObjectId = new mongoose.Types.ObjectId(usuario._id);
        if (workspaces.proprietario._id.toString() === usuarioObjectId.toString()) {
            next()
        } else {
            return res.status(403).json({message: "Permissão negada."})
        }
    } catch (error) {
        return res.json(error)
    }
}