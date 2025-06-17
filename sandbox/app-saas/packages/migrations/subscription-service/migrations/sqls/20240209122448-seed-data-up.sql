INSERT INTO main."plans"("name", created_on, created_by, description, price, currency_id, meta_data, billing_cycle_id, tier)
    VALUES ('Standard', CURRENT_TIMESTAMP, '{{ADMIN_USER_TENANT_ID}}', 'Standard plan', 50,(
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
                cycle_name = 'MONTHLY'), 0);

INSERT INTO main."plans"("name", created_on, created_by, description, price, currency_id, meta_data, billing_cycle_id, tier)
    VALUES ('Premium', CURRENT_TIMESTAMP, '{{ADMIN_USER_TENANT_ID}}', 'Premium plan', 150,(
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
                cycle_name = 'MONTHLY'), 1);

INSERT INTO main.plan_items(created_on, created_by, "name", plan_item_type, plan_id, value)
    VALUES (CURRENT_TIMESTAMP, '{{ADMIN_USER_TENANT_ID}}', 'Database', 'database',(
            SELECT
                id
            FROM
                main."plans" pl
            WHERE
                pl.name = 'Standard'), '{"name": "RDS_POSTGRES_STORAGE", "value": 50}');

INSERT INTO main.plan_items(created_on, created_by, "name", plan_item_type, plan_id, value)
    VALUES (CURRENT_TIMESTAMP, '{{ADMIN_USER_TENANT_ID}}', 'Database', 'database',(
            SELECT
                id
            FROM
                main."plans" pl
            WHERE
                pl.name = 'Premium'), '{"name": "RDS_POSTGRES_STORAGE", "value": 100}');

