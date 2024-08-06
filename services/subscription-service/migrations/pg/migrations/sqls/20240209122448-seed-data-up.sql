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
                cycle_name = 'MONTHLY'), 0);

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
                cycle_name = 'MONTHLY'), 1);

INSERT INTO main.plan_items (created_on, created_by, "name", plan_item_type, plan_id, value)
VALUES (
    CURRENT_TIMESTAMP,
    '123e4567-e89b-12d3-a456-426614174002',
    'Database',
    'database',
    (
        SELECT id
        FROM main.plans pl
        WHERE pl.name = 'Premium'
    ),
    '{
        "service": {
            "features": [
                { "name": "video call", "enabled": true, "description": "High quality video calling", "maxParticipants": 100 }
            ]
        }
    }'
);

INSERT INTO main.plan_items (created_on, created_by, "name", plan_item_type, plan_id, value)
VALUES (
    CURRENT_TIMESTAMP,
    '123e4567-e89b-12d3-a456-426614174002',
    'Database',
    'database',
    (
        SELECT id
        FROM main.plans pl
        WHERE pl.name = 'Premium'
    ),
    '{
        "service": {
            "features": [
                { "name": "video call", "enabled": true, "description": "High quality video calling", "maxParticipants": 100 },
                { "name": "chat", "enabled": true, "description": "Real-time text chat", "property4": "value" },
                { "name": "recording", "enabled": false, "description": "Record meetings", "priority": 3, "storageLimit": "5GB" }
            ]
        }
    }'
);






