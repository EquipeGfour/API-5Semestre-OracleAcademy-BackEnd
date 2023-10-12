import { Types } from "mongoose";
import { PRIORIDADES, STATUS } from "./enum";

const idEhValido = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
}

const verificarStatus =(status: number): boolean => {
    return Object.values(STATUS).includes(status);
}

const verificarPrioridade =(status: number): boolean => {
    return Object.values(PRIORIDADES).includes(status);
}

export { idEhValido, verificarStatus, verificarPrioridade };