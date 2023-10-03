import { Types } from "mongoose";

const idEhValido = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
}

export { idEhValido };