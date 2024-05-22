CREATE SCHEMA IF NOT EXISTS main;

CREATE TABLE main.addresses(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    address varchar(500),
    city varchar(100),
    "state" varchar(100),
    zip varchar(25),
    country varchar(25),
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_on timestamptz,
    deleted_by uuid,
    created_by uuid,
    modified_by uuid,
    CONSTRAINT pk_address_id PRIMARY KEY (id)
);

CREATE TABLE main.leads(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_on timestamptz,
    deleted_by uuid,
    email varchar(100) NOT NULL,
    created_by uuid,
    modified_by uuid,
    is_validated boolean DEFAULT FALSE NOT NULL,
    company_name varchar(100),
    address_id uuid,
    CONSTRAINT pk_leads_id PRIMARY KEY (id),
    CONSTRAINT fk_leads_address FOREIGN KEY (address_id) REFERENCES main.addresses(id)
);

CREATE TABLE main.tenants(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    name varchar(100) NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    modified_by uuid,
    deleted boolean DEFAULT FALSE NOT NULL,
    "key" varchar(20) NOT NULL,
    deleted_on timestamptz,
    deleted_by uuid,
    spoc_user_id uuid,
    lead_id uuid,
    domains varchar[] DEFAULT '{}' NOT NULL,
    address_id uuid,
    CONSTRAINT pk_tenants_id PRIMARY KEY (id),
    CONSTRAINT idx_tenant_key UNIQUE ("key"),
    CONSTRAINT fk_tenants_address FOREIGN KEY (address_id) REFERENCES main.addresses(id)
);

CREATE TABLE main.branding_metadata(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    theme_metadata jsonb,
    description varchar(500),
    logo varchar(500),
    website varchar(500),
    tenant_id uuid NOT NULL,
    CONSTRAINT pk_branding_metadata PRIMARY KEY (id),
    CONSTRAINT fk_branding_metadata_tenants FOREIGN KEY (tenant_id) REFERENCES main.tenants(id)
);

CREATE TABLE main.contacts(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    contact_type varchar(100),
    is_primary boolean DEFAULT FALSE NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz,
    created_by uuid,
    modified_by uuid,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_by uuid,
    deleted_on timestamptz,
    tenant_id uuid NOT NULL,
    CONSTRAINT pk_tenant_contacts PRIMARY KEY (id),
    CONSTRAINT fk_tenant_contacts_leads FOREIGN KEY (tenant_id) REFERENCES main.tenants(id)
);

CREATE TABLE main.resources(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    "type" varchar(100) NOT NULL,
    metadata jsonb NOT NULL,
    external_identifier varchar(200) NOT NULL,
    tenant_id uuid NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    modified_by uuid,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_on timestamptz,
    deleted_by uuid,
    CONSTRAINT pk_resources_id_1 PRIMARY KEY (id),
    CONSTRAINT idx_resource_ext_id UNIQUE (external_identifier,tenant_id)
);

ALTER TABLE main.resources
    ADD CONSTRAINT fk_resources_tenants FOREIGN KEY (tenant_id) REFERENCES main.tenants(id);

CREATE TABLE main.invoices(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    start_date timestamptz,
    end_date timestamptz,
    amount numeric NOT NULL,
    currency_code char(3),
    invoice_file varchar(100),
    due_date timestamptz,
    status smallint DEFAULT 0 NOT NULL,
    tenant_id uuid NOT NULL,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP,
    modified_on timestamptz,
    created_by uuid,
    modified_by uuid,
    deleted boolean DEFAULT FALSE NOT NULL,
    deleted_by uuid,
    deleted_on timestamptz,
    CONSTRAINT pk_invoices PRIMARY KEY (id),
    CONSTRAINT fk_invoices_tenants FOREIGN KEY (tenant_id) REFERENCES main.tenants(id)
);

COMMENT ON TABLE main.leads IS 'represents the leads that could or could not lead to an actual tenant as a customer for application.';

COMMENT ON TABLE main.addresses IS 'represents the addresses of leads and tenants';

COMMENT ON COLUMN main.leads.id IS 'unique identifier for a row';

COMMENT ON COLUMN main.leads.first_name IS 'name of the person who applied for a new tenant';

COMMENT ON COLUMN main.addresses.address IS 'address of the company the lead represents';

COMMENT ON COLUMN main.addresses.city IS 'city of the company the lead represents';

COMMENT ON COLUMN main.addresses."state" IS 'state of the company the lead represents';

COMMENT ON COLUMN main.addresses.zip IS 'zip code of the company the lead represents';

COMMENT ON COLUMN main.addresses.country IS 'country of the company the lead represents';

COMMENT ON COLUMN main.leads.email IS 'email id of person trying to create a tenant for his organisation';

COMMENT ON COLUMN main.tenants.id IS 'unique identifier for a row';

COMMENT ON COLUMN main.tenants.name IS 'name of the tenant';

COMMENT ON COLUMN main.tenants.status IS 'status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)';

COMMENT ON COLUMN main.tenants. "key" IS 'a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant';

COMMENT ON COLUMN main.tenants.spoc_user_id IS 'user id of the admin user who acts as a spoc for this tenant.';

COMMENT ON COLUMN main.tenants.lead_id IS 'id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.';

COMMENT ON TABLE main.contacts IS 'represents contacts of a tenant';

COMMENT ON COLUMN main.contacts.id IS 'unique identifier for a row';

COMMENT ON COLUMN main.contacts.first_name IS 'name of the contact of a tenant';

COMMENT ON COLUMN main.contacts.email IS 'email id of the contact';

COMMENT ON COLUMN main.contacts.is_primary IS 'Boolean value donating if the contact is a primary contact for it''s tenant.';

COMMENT ON COLUMN main.contacts.tenant_id IS 'tenant id this contact belongs to';

COMMENT ON COLUMN main.invoices.status IS 'status of the invoice, 0 - pending, 1 - paid';

COMMENT ON TABLE main.resources IS 'model for resources that are provisioned for a tenant';

COMMENT ON COLUMN main.resources. "type" IS 'type of the resource like storage, compute, etc';

COMMENT ON COLUMN main.resources.metadata IS 'any type specific metadata of the resource like connection info, size, etc';

COMMENT ON COLUMN main.resources.external_identifier IS 'identifier for the resource in the external system it was provisioned';

COMMENT ON COLUMN main.resources.tenant_id IS 'id of the tenant for which this resource is provisioned';

