import { Objetivo } from "../models";



class WorkspaceService{
    public async findAllWorkspacesByUser(id : string){
        try{
            const workspaces = await Objetivo.find({$and: [{workspace: true}, {$or: [{proprietario: id}, {"usuarios.usuario": id}]}]}).populate('tarefas proprietario usuarios.usuario').populate({
                path: 'tarefas',
                populate: {
                    path: 'usuarios',populate:{path: 'usuario'}
                }
            }).exec();
            return workspaces;
        }catch(error){
            console.log(error)
            throw error;
        }
    }
}


export default new WorkspaceService();