import multer from "multer";


const storage = multer.memoryStorage();
const uploadDriver = multer({ storage: storage });


export default uploadDriver;