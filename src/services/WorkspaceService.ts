import { Objetivo } from "../models";
import { PERMISSAO } from "../utils/enum";



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

    public async addUserToWorkspace(id, usuarios) {
        try {
            const novaLista = usuarios.map((usuario) => {
                return {usuario: usuario._id, permissao:PERMISSAO.LEITURA}
            })
            const objetivo = await Objetivo.findById(id);
            if (objetivo) {
                const usuariosParaAdicionar = novaLista.filter((novoUsuario) => {
                    return !objetivo.usuarios.some((usuarioNaTarefa) => usuarioNaTarefa.usuario.equals(novoUsuario.usuario));
                });
                if (usuariosParaAdicionar.length > 0) {
                    objetivo.usuarios.push(...usuariosParaAdicionar);
                    await objetivo.save();
                }
            }

            return objetivo;
        } catch (error) {
            throw error;
        }
    }
}


export default new WorkspaceService();