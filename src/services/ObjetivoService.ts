import { connection } from "../config/db";
import { Objetivos } from "../models";


class ObjetivoService{
    public async findAll(){
        try{
            const listaObjetivos: Objetivos[] = [];
            const objetivos = await connection.collection("objetivos").get();
            if(!objetivos.empty){
                objetivos.forEach(doc => {
                    listaObjetivos.push({id: doc.id, ...doc.data() as Objetivos})
                })
            }
            return listaObjetivos;
        }catch(error){
            throw error;
        }
    }
    public async getObjetivoById(id: string) {
        try {
            const objetivoRef = connection.collection("objetivos").doc(id);
            const objetivoDoc = await objetivoRef.get();
            if (!objetivoDoc.exists) {
                throw new Error(`Objetivo com ID ${id} não encontrado!!.`);
            }
            const objetivoData = objetivoDoc.data();
            return objetivoData;
        } catch (error) {
            throw error;
        }
    }
    public async deleteObjetivo(id: string) {
        try {
            const objetivoByID = connection.collection("objetivos").doc(id);
            const objetivoDoc = await objetivoByID.get();
            if (!objetivoDoc.exists) {
                throw (`Objetivo com ID ${id} não encontrado!!.`);
            }
            await objetivoByID.delete();
            return { message: `Objetivo com ID ${id} foi excluído com sucesso!!.` };
        } catch (error) {
            throw error;
        }
    }
    
}


export default new ObjetivoService();