
import { Objetivo, IObjetivo } from "../models"
import { PRIORIDADES } from "../utils/enum";


class ObjetivoService{
    public async createObjetivo(objetivo) {
        try {
            const response = await Objetivo.create(objetivo);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async findAll():Promise<IObjetivo[]>{
        try{
            const objetivos = await Objetivo.find({},'-__v');
            return objetivos;
        }catch(error){
            throw error;
        }
    }
    public async getObjetivoById(id: string):Promise<IObjetivo> {
        try {
            const objetivo = await Objetivo.findById(id, '-__v');
            if(!objetivo){
                throw  `usuario ${id} não encontrado....`;
            }
            return objetivo;
        } catch (error) {
            throw error;
        }
    }
    // public async deleteObjetivo(id: string) {
    //     try {
    //         const objetivoByID = connection.collection("objetivos").doc(id);
    //         const objetivoDoc = await objetivoByID.get();
    //         if (!objetivoDoc.exists) {
    //             throw (`Objetivo com ID ${id} não encontrado!!.`);
    //         }
    //         await objetivoByID.delete();
    //         return { message: `Objetivo com ID ${id} foi excluído com sucesso!!.` };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // public async updateObjetivo(id:string, titulo:string, descricao:string, data_estimada:string) {
    //     try{
    //         await connection.collection("objetivos").doc(id).update({titulo: titulo, descricao: descricao, data_estimada: data_estimada});
    //     } catch (error) {
    //         console.log(error)
    //         throw error
    //     }
    // }
    // public async changePriority(id: string, novaPrioridade: PRIORIDADES) {
    //     try {
    //         if (![1, 2, 3, 4].includes(novaPrioridade)) {
    //             throw ("Valor de prioridade inválido. A prioridade deve ser 1, 2, 3 ou 4!!.");
    //         }
    //         const objetivoRef = connection.collection("objetivos").doc(id);
    //         const objetivoDoc = await objetivoRef.get();
    //         if (!objetivoDoc.exists) {
    //             throw (`Objetivo com ID ${id} não encontrado!!.`);
    //         }
    //         await objetivoRef.update({ prioridade: novaPrioridade });
    //         return { message: `Prioridade do objetivo com ID ${id} foi atualizada com sucesso!!.` };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}


export default new ObjetivoService();