export interface IMeasure {
    image: IImage;
    customer_code: string;
    measure_datetime: Date;
    measure_type: "water" | "gas";
}

export interface IImage {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}
