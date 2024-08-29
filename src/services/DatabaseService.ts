import { Pool } from "pg";
import pool from "../repositories/database";

interface Measurement {
    id: string;
    customer_code: string;
    measure_datetime: string;
    measured_month: string;
    measure_type: "WATER" | "GAS";
    measure_value: number;
    value_confirmed: boolean;
    image_url: string;
    created_at: Date;
}

type MeasurementInput = Omit<
    Measurement,
    "id" | "created_at" | "value_confirmed"
>;

class DatabaseService {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async saveMeasurement(measurement: MeasurementInput): Promise<Measurement> {
        const query = `
            INSERT INTO measurements (customer_code, measure_datetime, measured_month, measure_type, measure_value, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            measurement.customer_code,
            measurement.measure_datetime,
            measurement.measured_month,
            measurement.measure_type,
            measurement.measure_value,
            measurement.image_url,
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async getMeasurementByMonth(
        customerCode: string,
        measureType: "WATER" | "GAS",
        month: string
    ): Promise<Measurement | null> {
        const query = `
            SELECT * FROM measurements
            WHERE customer_code = $1
                AND measure_type = $2
                AND measured_month = $3
            LIMIT 1
        `;

        const values = [customerCode, measureType, month];

        const result = await this.pool.query(query, values);
        return result.rows[0] || null;
    }

    async checkId(id: string) {
        const query = `
            SELECT id FROM measurements
            WHERE id = $1
        `;

        const values = [id];

        const result = await this.pool.query(query, values);
        return result.rows[0] || null;
    }

    async confirmReadingStatus(id: string) {
        const query = `
            SELECT value_confirmed FROM measurements
            WHERE id = $1
        `;

        const values = [id];

        const result = await this.pool.query(query, values);

        return result.rows[0];
    }

    async updateValueAndStatus(id: string, confirmed_value: number) {
        const query = `
            UPDATE measurements
            SET measure_value = $1, value_confirmed = true
            WHERE id = $2
            RETURNING *
        `;

        const values = [confirmed_value, id];

        const result = await this.pool.query(query, values);

        return result.rows[0];
    }

    async getListByCustomer(customerCode: string) {
        const query = `
            SELECT * FROM measurements
            WHERE customer_code = $1
        `;

        const values = [customerCode];

        const result = await this.pool.query(query, values);

        return result.rows;
    }

    async getListByCustomerAndType(customerCode: string, type: string) {
        const query = `
            SELECT * FROM measurements
            WHERE customer_code = $1
            AND measure_type = $2
        `;

        const values = [customerCode, type];

        const result = await this.pool.query(query, values);
        
        return result.rows;
    }
}

export default new DatabaseService();
