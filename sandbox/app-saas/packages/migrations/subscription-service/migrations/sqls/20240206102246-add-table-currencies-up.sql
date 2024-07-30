CREATE TABLE main.currencies (
    id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    currency_code        varchar(3) NOT NULL,
    currency_name        varchar(100) NOT NULL,
    symbol               varchar(10),
    country              varchar(100),
    created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted              boolean DEFAULT false NOT NULL,
    deleted_on           timestamptz,
    deleted_by           uuid,
    created_by           uuid NOT NULL,
    modified_by          uuid,
    CONSTRAINT pk_currencies_id PRIMARY KEY (id),
    CONSTRAINT uq_currencies_currency_code UNIQUE (currency_code)
);
