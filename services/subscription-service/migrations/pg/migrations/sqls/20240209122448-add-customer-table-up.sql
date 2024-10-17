
CREATE TABLE main.billing_customer (
    id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    tenant_id            varchar(255) NOT NULL,
    customer_id          varchar(255) NOT NULL,
    payment_source_id    varchar(255),
    created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted              boolean DEFAULT false NOT NULL,
    deleted_on           timestamptz,
    deleted_by           uuid,
    created_by           uuid NOT NULL,
    modified_by          uuid,
    CONSTRAINT pk_billing_customer_id PRIMARY KEY (id),
    CONSTRAINT uq_billing_customer_customer_id UNIQUE (customer_id)
);



CREATE TABLE main.invoice (
    id UUID DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL,
    invoice_id VARCHAR(255) NOT NULL,
    invoice_status VARCHAR(255),
    billing_customer_id uuid NOT NULL,
    -- subscription_id uuid,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted BOOLEAN DEFAULT false NOT NULL,
    deleted_on TIMESTAMPTZ,
    deleted_by UUID,
    created_by UUID NOT NULL,
    modified_by UUID,
    CONSTRAINT pk_invoice_id PRIMARY KEY (id),
    CONSTRAINT fk_invoice_customer FOREIGN KEY (billing_customer_id) REFERENCES main.billing_customer(id)

    -- CONSTRAINT fk_invoice_subscription FOREIGN KEY (subscription_id) REFERENCES main.subscriptions(id) -- Add this constraint
);

ALTER TABLE main.subscriptions
ADD COLUMN invoice_id uuid NOT NULL,
ADD CONSTRAINT fk_subscriptions_invoice FOREIGN KEY (invoice_id) REFERENCES main.invoice(id);