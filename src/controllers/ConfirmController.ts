import { Request, Response } from "express";
import ConfirmSchema from "../schemas/ConfirmSchema";
import DatabaseService from "../services/DatabaseService";

class ConfirmController {
    async confirmOrUpdate(req: Request, res: Response) {
        try {
            // validar os dados que chegam no body
            await ConfirmSchema.validate(req.body);

            // verificar se o id da leitura informado existe na db
            const existingId = await DatabaseService.checkId(
                req.body.measure_uuid
            );

            // se o id não existir lançar erro
            if (!existingId) {
                throw new Error("Leitura não encontrada");
            }

            // verificar se a leitura ja foi confirmada
            const confirmedReading = await DatabaseService.confirmReadingStatus(
                req.body.measure_uuid
            );

            if (confirmedReading.value_confirmed) {
                throw new Error("Leitura do mês já realizada");
            }

            // salvar no banco de dados o valor informado e atualizar status
            await DatabaseService.updateValueAndStatus(
                req.body.measure_uuid,
                req.body.confirmed_value
            );

            res.status(200).json({ success: true });
        } catch (err: any) {
            if (err.message === "Leitura não encontrada") {
                return res.status(404).json({
                    error_code: "MEASURE_NOT_FOUND",
                    error_description: err.message,
                });
            }

            if (err.message === "Leitura do mês já realizada") {
                return res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
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

export default ConfirmController;
