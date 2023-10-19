import { Request, Response } from "express";
import { WorkspaceService } from "../services";


class WorkspaceController{
    public async buscarWorkspaces(req: Request, res: Response){
        try{
            const usuario = res.locals.jwtPayload;
            const workspaces = await WorkspaceService.findAllWorkspacesByUser(usuario._id);
            return res.json(workspaces);
        }catch(error){
            return res.status(500).json(error)
        }
    }
}


export default new WorkspaceController()