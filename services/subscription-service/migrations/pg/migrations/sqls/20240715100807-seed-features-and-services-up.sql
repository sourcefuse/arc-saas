INSERT INTO main.services (id, created_on, modified_on, deleted, deleted_on, deleted_by, created_by, modified_by, name)
VALUES (
    '91f3c086-8794-4a62-98a0-7f02d4e8c103', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP,
    false,
    NULL, 
    NULL, 
    '123e4567-e89b-12d3-a456-426614174002', 
    NULL, 
    'video conferencing service' 
);

INSERT INTO main.features (created_by, name, properties, service_id)
VALUES 
(
    '123e4567-e89b-12d3-a456-426614174002',
    'video call',
    '{
        "enabled": true,
        "description": "High quality video calling",
        "maxParticipants": 100
    }',
    '91f3c086-8794-4a62-98a0-7f02d4e8c103'
),
(
    '123e4567-e89b-12d3-a456-426614174002',
    'chat',
    '{
        "enabled": true,
        "description": "Real-time text chat",
        "property4": "value"
    }',
    '91f3c086-8794-4a62-98a0-7f02d4e8c103'
),
(
    '123e4567-e89b-12d3-a456-426614174002',
    'recording',
    '{
        "enabled": false,
        "description": "Record meetings",
        "priority": 3,
        "storageLimit": "5GB"
    }',
    '91f3c086-8794-4a62-98a0-7f02d4e8c103'
);