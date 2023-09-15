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
}


export default new ObjetivoService();