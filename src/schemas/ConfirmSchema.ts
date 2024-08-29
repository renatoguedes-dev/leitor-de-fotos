import { number, object, string } from "yup";

const ConfirmSchema = object().shape({
    measure_uuid: string().required(),
    confirmed_value: number().required(),
});

export default ConfirmSchema;
