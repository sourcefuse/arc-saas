CREATE TABLE main.billing_customer (
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,    tenant_id        uuid  NOT NULL  ,
    customer_id VARCHAR(255) NOT NULL,
    payment_source_id VARCHAR(255),
    invoice_id VARCHAR(255),
    invoice_status BOOLEAN,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
);
