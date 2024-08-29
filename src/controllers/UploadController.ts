import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import UploadService from "../services/UploadService";
import UploadSchema from "../schemas/UploadSchema";
import verifyExtensions from "../utils/verifyExtension";
import DatabaseService from "../services/DatabaseService";
import getMeasureMonth from "../utils/getMeasureMonth";

const uploadService = new UploadService();

class UploadController {
    async processImage(req: Request, res: Response) {
        try {
            // validar os dados que chegam no body
            await UploadSchema.validate(req.body);

            // verificar se o arquivo de imagem foi enviado
            const uploadedFile = req.file;

            // não existindo retornar o erro
            if (!uploadedFile) {
                throw new Error("Image is required");
            }

            // verificar se a extensão está correta para o uso da APi do Gemini
            const { isVerified, fileMimeType } = verifyExtensions(uploadedFile);

            if (!isVerified && fileMimeType === "") {
                throw new Error("File extension not allowed.");
            }

            // verificar o mês da medição e se o mês é valido
            const { measureMonth, monthIsValid } = getMeasureMonth(
                req.body.measure_datetime
            );

            // se o mês não for entre 1 e 12 vai retornar erro
            if (!monthIsValid) {
                throw new Error("Month informed is not valid.");
            }

            // verificar se já foi feita medição para aquele tipo e mês
            const existingMeasurement =
                await DatabaseService.getMeasurementByMonth(
                    req.body.customer_code,
                    req.body.measure_type,
                    measureMonth
                );

            if (existingMeasurement) {
                throw new Error("Leitura do mês já realizada");
            }

            // definir o path do arquivo em variável
            const filePath = path.join(
                __dirname,
                "../..",
                "uploads",
                uploadedFile.filename
            );

            // ler o arquivo salvo e converter para base64
            const fileBuffer = await fs.readFile(filePath);
            const imageBase64 = fileBuffer.toString("base64");

            const measureValue = await uploadService.processImage(
                fileMimeType,
                imageBase64
            );

            const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
                uploadedFile.filename
            }`;

            // incluir a medida na database
            const savedMeasurement = await DatabaseService.saveMeasurement({
                customer_code: req.body.customer_code,
                measure_datetime: new Date(req.body.measure_datetime).toISOString(),
                measured_month: measureMonth,
                measure_type: req.body.measure_type,
                measure_value: measureValue,
                image_url: imageUrl,
            });

            res.status(200).json({
                image_url: savedMeasurement.image_url,
                measure_value: savedMeasurement.measure_value,
                measure_uuid: savedMeasurement.id,
            });
        } catch (err: any) {
            // remover o arquivo que foi criado se os outros parâmetros não forem informados
            if (req.file) {
                const filePath = path.join(
                    __dirname,
                    "../..",
                    "uploads",
                    req.file.filename
                );
                await fs.unlink(filePath);
            }

            if (err.message === "Leitura do mês já realizada") {
                return res.status(409).json({
                    error_code: "DOUBLE_REPORT",
                    error_description: err.message,
                });
            }

            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: err.message,
            });
        }
    }
}

export default UploadController;
