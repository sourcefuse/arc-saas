CREATE TABLE main.features (
    id                uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    created_on        timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on       timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted           boolean DEFAULT false NOT NULL,
    deleted_on        timestamptz,
    deleted_by        uuid,
    created_by        uuid NOT NULL,
    modified_by       uuid,
    name              varchar(100) NOT NULL,
    properties        jsonb NOT NULL,
    service_id        uuid NOT NULL,
    CONSTRAINT pk_features_id PRIMARY KEY (id),
    CONSTRAINT fk_features_services FOREIGN KEY (service_id) REFERENCES services (id)
);