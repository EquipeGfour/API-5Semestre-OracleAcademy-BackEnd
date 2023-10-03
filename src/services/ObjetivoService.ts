
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
            const objetivos = await Objetivo.find({},'-__v').populate("tarefas", "-__v").exec();
            return objetivos;
        }catch(error){
            throw error;
        }
    }
    public async getObjetivoById(id: string):Promise<IObjetivo> {
        try {
            const objetivo = await Objetivo.findById(id, '-__v').populate("tarefas", "-__v").exec();
            if(!objetivo){
                throw  `objetivo ${id} não encontrado....`;
            }
            return objetivo;
        } catch (error) {
            throw error;
        }
    }
    public async updateObjetivo(id: string, objetivoData: any) {
        try {
            const updatedObjetivo = await Objetivo.findByIdAndUpdate(
                id,
                objetivoData,
                { new: true }
            );

            if (!updatedObjetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }

            return updatedObjetivo;
        } catch (error) {
            throw error;
        }
    }
    public async deleteObjetivo(id:string) {
        try {
            const deleteObjetivo = await Objetivo.findByIdAndDelete(id);
            return deleteObjetivo
        } catch (error) {
            throw error
        }
    }
    public async changePriority(id:string, novaPrioridade:any) {
        try{
            const objetivo = await Objetivo.findById(id)
            if (!objetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            const prioridadeObjetivo = await objetivo.updateOne({ prioridade: novaPrioridade })
            return prioridadeObjetivo
        } catch (error) {
            throw error
        }
    }
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