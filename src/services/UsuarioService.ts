import { Usuarios, IUsuarios } from "../models"

class UsuarioService {
    public async createUsuarios(usuarios) {
        try {
            const response = await Usuarios.create(usuarios)
            return response
        } catch (error) {
            throw error
        }
    }

    public async findAll():Promise<IUsuarios[]>{
        try{
            const usuarios = await Usuarios.find()
            return usuarios;
        }catch(error){
            throw error;
        }
    }

    public async findUsuariosById(id: string):Promise<IUsuarios> {
        try {
            const usuarios = await Usuarios.findById(id, '-__v')
            if(!usuarios){
                throw  `objetivo ${id} não encontrado....`;
            }
            return usuarios
        } catch (error) {
            throw error
        }
    }

    public async updateUsuarios(id: string, usuariosData: any) {
        try {
            const updatedUsuario = await Usuarios.findByIdAndUpdate(
                id,
                usuariosData,
                { new: true }
            )

            if (!updatedUsuario) {
                throw new Error(`Usuário ${id} não encontrado.`);
            }

            return updatedUsuario
        } catch (error) {
            throw error
        }   
    }
    public async deleteUsuario(id:string) {
        try {
            const deleteUsuario = await Usuarios.findByIdAndDelete(id)
            return deleteUsuario
        } catch (error) {
            throw error
        }
    }
}

export default new UsuarioService()