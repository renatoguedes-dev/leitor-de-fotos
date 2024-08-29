import { Request, Response } from "express";
import DatabaseService from "../services/DatabaseService";

class MeasureListController {
    async getAll(req: Request, res: Response) {
        try {
            // armazenar o parâmetro customer_code em variável
            const customerCode = req.params.customer_code;
            const customerMeasurementList =
                await DatabaseService.getListByCustomer(customerCode);

            // lançar erro se não for encontrado nenhum resultado na db
            if (customerMeasurementList.length === 0) {
                throw new Error("Nenhuma leitura encontrada");
            }

            // verificar se a query measure_type foi enviada
            const measureTypeQuery = req.query.measure_type;

            // criar array que vai ser usada nas respostas
            const responseArray = [];

            if (measureTypeQuery && typeof measureTypeQuery === "string") {
                const upperMeasureTypeQuery = measureTypeQuery.toUpperCase();

                // verificar se o query parameter está correto
                if (
                    upperMeasureTypeQuery === "WATER" ||
                    upperMeasureTypeQuery === "GAS"
                ) {
                    // verificar na db se o registro com o tipo informado existe
                    const measureByType =
                        await DatabaseService.getListByCustomerAndType(
                            customerCode,
                            upperMeasureTypeQuery
                        );

                    if (measureByType.length === 0) {
                        throw new Error("Nenhuma leitura encontrada");
                    }

                    // efetuar loop para incluir os dados solicitados no formato correto
                    for (let i = 0; i < measureByType.length; i++) {
                        const newObject = {
                            measure_uuid: measureByType[i].id,
                            measure_datetime: measureByType[i].measure_datetime,
                            measure_type: measureByType[i].measure_type,
                            has_confirmed: measureByType[i].value_confirmed,
                            image_url: measureByType[i].image_url,
                        };

                        responseArray.push(newObject);
                    }

                    return res.status(200).json({
                        customer_code: customerCode,
                        measures: responseArray,
                    });
                } else {
                    throw new Error("Tipo de medição não permitida");
                }
            }

            // efetuar loop para incluir os dados solicitados no formato correto
            for (let i = 0; i < customerMeasurementList.length; i++) {
                const newObject = {
                    measure_uuid: customerMeasurementList[i].id,
                    measure_datetime:
                        customerMeasurementList[i].measure_datetime,
                    measure_type: customerMeasurementList[i].measure_type,
                    has_confirmed: customerMeasurementList[i].value_confirmed,
                    image_url: customerMeasurementList[i].image_url,
                };

                responseArray.push(newObject);
            }

            res.status(200).json({
                customer_code: customerCode,
                measures: responseArray,
            });
        } catch (err: any) {
            if (err.message === "Nenhuma leitura encontrada") {
                return res.status(404).json({
                    error_code: "MEASURES_NOT_FOUND",
                    error_description: err.message,
                });
            }

            return res.status(400).json({
                error_code: "INVALID_TYPE",
                error_description: err.message,
            });
        }
    }
}

export default MeasureListController;
