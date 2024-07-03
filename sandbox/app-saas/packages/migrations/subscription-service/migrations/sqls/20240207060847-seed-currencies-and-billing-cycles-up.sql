INSERT INTO main.currencies (currency_code, currency_name, symbol, country, created_by) VALUES
('USD', 'United States Dollar', '$', 'United States', '123e4567-e89b-12d3-a456-426614174000'),
('INR', 'Indian Rupee', '₹', 'India', '123e4567-e89b-12d3-a456-426614174001'),
('EUR', 'Euro', '€', 'Eurozone', '123e4567-e89b-12d3-a456-426614174002'),
('GBP', 'British Pound Sterling', '£', 'United Kingdom', '123e4567-e89b-12d3-a456-426614174003'),
('JPY', 'Japanese Yen', '¥', 'Japan', '123e4567-e89b-12d3-a456-426614174004');

-- Insert WEEKLY billing cycle
INSERT INTO main.billing_cycles (cycle_name, duration, duration_unit, description, created_by)
VALUES ('WEEKLY', 1, 'week', 'Billing occurs every week.', '123e4567-e89b-12d3-a456-426614174002');

-- Insert MONTHLY billing cycle
INSERT INTO main.billing_cycles (cycle_name, duration, duration_unit, description, created_by)
VALUES ('MONTHLY', 1, 'month', 'Billing occurs every month.', '123e4567-e89b-12d3-a456-426614174002');

-- Insert QUARTERLY billing cycle
INSERT INTO main.billing_cycles (cycle_name, duration, duration_unit, description, created_by)
VALUES ('QUARTERLY', 3, 'months', 'Billing occurs every quarter.', '123e4567-e89b-12d3-a456-426614174002');

-- Insert HALF_YEARLY billing cycle
INSERT INTO main.billing_cycles (cycle_name, duration, duration_unit, description, created_by)
VALUES ('HALF_YEARLY', 6, 'months', 'Billing occurs every half year.', '123e4567-e89b-12d3-a456-426614174002');

-- Insert YEARLY billing cycle
INSERT INTO main.billing_cycles (cycle_name, duration, duration_unit, description, created_by)
VALUES ('YEARLY', 1, 'year', 'Billing occurs every year.', '123e4567-e89b-12d3-a456-426614174002');