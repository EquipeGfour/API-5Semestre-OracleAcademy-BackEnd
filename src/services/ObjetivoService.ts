import { connection } from "../config/db";
import { Objetivos, Tarefas } from "../models";
import { PRIORIDADES } from "../utils/enum";


class ObjetivoService{
    public async createObjetivo(objetivo: Objetivos) {
        try {
            const response = await connection.collection("objetivos").doc().create(objetivo);
            return response;
        } catch (error) {
            throw error;
        }
    }
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
                throw (`Objetivo com ID ${id} não encontrado!!.`);
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
    public async changePriority(id: string, novaPrioridade: PRIORIDADES) {
        try {
            if (![1, 2, 3, 4].includes(novaPrioridade)) {
                throw ("Valor de prioridade inválido. A prioridade deve ser 1, 2, 3 ou 4!!.");
            }
            const objetivoRef = connection.collection("objetivos").doc(id);
            const objetivoDoc = await objetivoRef.get();
            if (!objetivoDoc.exists) {
                throw (`Objetivo com ID ${id} não encontrado!!.`);
            }
            await objetivoRef.update({ prioridade: novaPrioridade });
            return { message: `Prioridade do objetivo com ID ${id} foi atualizada com sucesso!!.` };
        } catch (error) {
            throw error;
        }
    }
}


export default new ObjetivoService();