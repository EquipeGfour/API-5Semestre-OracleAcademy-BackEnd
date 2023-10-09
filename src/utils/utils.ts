import { Types } from "mongoose";
import { STATUS } from "./enum";

const idEhValido = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
}

const verificarStatus =(status: number): boolean => {
    return Object.values(STATUS).includes(status);
}

export { idEhValido, verificarStatus };