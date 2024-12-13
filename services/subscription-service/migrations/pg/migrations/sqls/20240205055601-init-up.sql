CREATE SCHEMA IF NOT EXISTS main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE  TABLE plans ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
	name                 varchar(100)  NOT NULL  ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
    description          varchar(500)    ,
    price                numeric(10,2)    ,
    currency_id             uuid  NOT NULL    ,
	meta_data            jsonb,
    billing_cycle_id        uuid  NOT NULL ,
	CONSTRAINT pk_plans_id PRIMARY KEY ( id )
 );



CREATE  TABLE subscriptions ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
    subscriber_id        uuid  NOT NULL  ,
    plan_id              uuid  NOT NULL  ,
    start_date           varchar(10)    ,
    end_date             varchar(10)    ,
    status        smallint DEFAULT 0 NOT NULL  ,
	CONSTRAINT pk_subscriptions_id PRIMARY KEY ( id ),
    CONSTRAINT fk_subscriptions_plans FOREIGN KEY ( plan_id ) REFERENCES plans( id )   
 );

CREATE  TABLE plan_items ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
    name                 varchar(100)  NOT NULL  ,
    plan_item_type       varchar(30)  NOT NULL  ,
	plan_id              uuid  NOT NULL  ,
    value                jsonb NOT NULL,
	CONSTRAINT pk_plan_items_id PRIMARY KEY ( id ),
	CONSTRAINT fk_plan_items_plans FOREIGN KEY ( plan_id ) REFERENCES plans( id )   
);

CREATE  TABLE resources ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
    name                 varchar(100)  NOT NULL  ,
    config                jsonb NOT NULL,
	CONSTRAINT pk_resources_id PRIMARY KEY ( id )
);

CREATE  TABLE services ( 
	id                   uuid DEFAULT (md5(((random())::text || (clock_timestamp())::text)))::uuid NOT NULL  ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted              boolean DEFAULT false NOT NULL  ,
    deleted_on           timestamptz    ,
	deleted_by           uuid    ,
	created_by           uuid  NOT NULL  ,
	modified_by          uuid    ,
    name                 varchar(100)  NOT NULL  ,
	CONSTRAINT pk_services_id PRIMARY KEY ( id )
);