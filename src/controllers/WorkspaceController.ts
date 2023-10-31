import { Request, Response } from "express";
import { WorkspaceService } from "../services";


class WorkspaceController {
    public async buscarWorkspaces(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findAllWorkspacesByUser(usuario._id);
            return res.json(workspaces);
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    public async buscarWorkspacesByOwner(req: Request, res: Response){
        try {
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findAllWorkspacesByOwner(usuario);
            return res.json(workspaces);
        } catch (error) {
            return res.status(500).json(error)
        }        
    }

    public async buscarWorkspaceUsuario(req: Request, res: Response) {
        try {
            const usuario = res.locals.jwtPayload;
            console.log(JSON.stringify(usuario));
            const workspaces = await WorkspaceService.findWorkspaceByUser(usuario);

            return res.json(workspaces);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error || "Ocorreu um erro durante a busca de objetivos por filtro." });
        }
    }

}


export default new WorkspaceController()