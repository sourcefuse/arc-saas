INSERT INTO main."plans"("name", created_on, created_by, description, price, currency_id, meta_data, billing_cycle_id, tier)
    VALUES ('Standard', CURRENT_TIMESTAMP, '123e4567-e89b-12d3-a456-426614174002', 'Standard plan', 50,(
            SELECT
                id
            FROM main.currencies
            WHERE
                currency_code = 'USD'), '{}',(
            SELECT
                id
            FROM
                main.billing_cycles bb
            WHERE
                cycle_name = 'MONTHLY'), "STANDARD");

INSERT INTO main."plans"("name", created_on, created_by, description, price, currency_id, meta_data, billing_cycle_id, tier)
    VALUES ('Premium', CURRENT_TIMESTAMP, '123e4567-e89b-12d3-a456-426614174002', 'Premium plan', 150,(
            SELECT
                id
            FROM main.currencies
            WHERE
                currency_code = 'USD'), '{}',(
            SELECT
                id
            FROM
                main.billing_cycles bb
            WHERE
                cycle_name = 'MONTHLY'), "PREMIUM");

INSERT INTO main.plan_items(created_on, created_by, "name", plan_item_type, plan_id, value)
    VALUES (CURRENT_TIMESTAMP, '123e4567-e89b-12d3-a456-426614174002', 'Database', 'database',(
            SELECT
                id
            FROM
                main."plans" pl
            WHERE
                pl.name = 'Standard'), '{"name": "RDS_POSTGRES_STORAGE", "value": 50}');

INSERT INTO main.plan_items(created_on, created_by, "name", plan_item_type, plan_id, value)
    VALUES (CURRENT_TIMESTAMP, '123e4567-e89b-12d3-a456-426614174002', 'Database', 'database',(
            SELECT
                id
            FROM
                main."plans" pl
            WHERE
                pl.name = 'Premium'), '{"name": "RDS_POSTGRES_STORAGE", "value": 100}');

