import { IUsuarios, Objetivo } from "../models"


class ObjetivoService {
    public async createObjetivo(objetivo) {
        try {
            const response = await Objetivo.create(objetivo);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async findAllObjetivosByUser(usuario) {
        try {
            const objetivos = await Objetivo.find({proprietario:usuario._id}, '-__v').populate("tarefas proprietario", "-__v").exec();
            return objetivos;
        } catch (error) {
            throw error;
        }
    }

    public async getObjetivoById(id: string) {
        try {
            const objetivo = await Objetivo.findById(id, '-__v').populate("tarefas proprietario", "-__v").exec();
            if (!objetivo) {
                throw `objetivo ${id} não encontrado....`;
            }
            return objetivo;
        } catch (error) {
            console.log(error)
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

    public async deleteObjetivo(id: string) {
        try {
            const deleteObjetivo = await Objetivo.findByIdAndDelete(id);
            return deleteObjetivo
        } catch (error) {
            throw error
        }
    }

    public async addUserWorkspace(id: string) {
        try { 
            const objetivo = await Objetivo.findById(id);
            if (!objetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            await objetivo.save();
            return objetivo;
        } catch (error) {
            throw error;
        }
    }

    public async changePriority(id: string, novaPrioridade: any) {
        try {
            const objetivo = await Objetivo.findById(id);
            if (!objetivo) {
                throw new Error(`Objetivo ${id} não encontrado.`);
            }
            const prioridadeObjetivo = await objetivo.updateOne({ prioridade: novaPrioridade });
            return prioridadeObjetivo;
        } catch (error) {
            throw error;
        }
    }

}


export default new ObjetivoService();