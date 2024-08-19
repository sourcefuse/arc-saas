CREATE TABLE main.plan_sizes
(
	id uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
    size text NOT NULL,
    config jsonb,
    PRIMARY KEY (id),
    created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted              boolean DEFAULT false NOT NULL,
    deleted_on           timestamptz,
    deleted_by           uuid,
    created_by           uuid NOT NULL,
    modified_by          uuid,
    CONSTRAINT unique_size_name UNIQUE (size)
);