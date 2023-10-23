import { UploadedFile } from "express-fileupload";

const extractDataFromFile = (uploadFile: UploadedFile) => {
    const [,ext] = uploadFile.name.split(".");
    const fileName = `${Date.now()}.${ext}`;
    const file = { fileName: fileName, mimeType: uploadFile.mimetype, fileContent: uploadFile.data }
    return file;
}

export { extractDataFromFile }