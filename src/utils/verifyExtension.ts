import { IImage } from "../models/Measure";

const allowedFileTypes = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/gif": ["gif"],
    "image/webp": ["webp"],
};

const allowedExtensions = Object.values(allowedFileTypes).flat();

function verifyExtensions(uploadedFile: IImage) {
    // pegar a extensão do arquivo enviado em variável e fazer as verificações
    const splitFilename = uploadedFile.filename.split(".");
    let extension = splitFilename[1];

    // verificar se a extensão é aceita ou não
    if (allowedExtensions.includes(extension)) {
        if (extension === "jpg") {
            extension = "jpeg";
        }

        const isVerified = true;
        const fileMimeType = `image/${extension}`;

        return { isVerified, fileMimeType };
    } else {
        const isVerified = false;
        const fileMimeType = "";

        return { isVerified, fileMimeType };
    }
}

export default verifyExtensions;
