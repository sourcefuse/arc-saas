CREATE TABLE main.billing_cycles (
    id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    cycle_name           varchar(100) NOT NULL,
    duration             integer NOT NULL,
    duration_unit        varchar(50) NOT NULL,
    description          varchar(500),
    created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted              boolean DEFAULT false NOT NULL,
    deleted_on           timestamptz,
    deleted_by           uuid,
    created_by           uuid NOT NULL,
    modified_by          uuid,
    CONSTRAINT pk_billing_cycles_id PRIMARY KEY (id)
);


