CREATE TABLE IF NOT EXISTS main.tenant_configs
(
    id uuid NOT NULL DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid,
    config_key varchar(100) NOT NULL,
    config_value jsonb NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP,
    modified_on timestamptz,
    created_by uuid,
    modified_by uuid,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_by uuid,
    deleted_on timestamptz,
    tenant_id uuid NOT NULL,
    CONSTRAINT pk_tenant_configs_id PRIMARY KEY (id),
    CONSTRAINT fk_tenant_configs_tenants FOREIGN KEY (tenant_id)
        REFERENCES main.tenants(id)
)