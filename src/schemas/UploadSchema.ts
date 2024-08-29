import { object, string } from "yup";

// Regular expression para garantir o formato da data "yyyy-mm-dd"
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

const UploadSchema = object().shape({
    customer_code: string().required(),
    measure_datetime: string()
        .required()
        .matches(
            dateFormatRegex,
            "measure_datetime precisa ser no formato yyyy-mm-dd"
        ),
    measure_type: string()
        .required()
        .test("isValid", (measure_type) => {
            if (measure_type === "WATER" || measure_type === "GAS") {
                return true;
            } else {
                return false;
            }
        }),
});

export default UploadSchema;
