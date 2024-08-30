CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE measurements (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code VARCHAR(50) NOT NULL,
  measure_datetime TIMESTAMP NOT NULL,
  measured_month VARCHAR(5) NOT NULL,
  measure_type VARCHAR(10) NOT NULL CHECK (measure_type IN ('WATER', 'GAS')),
  measure_value INTEGER NOT NULL,
  value_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);