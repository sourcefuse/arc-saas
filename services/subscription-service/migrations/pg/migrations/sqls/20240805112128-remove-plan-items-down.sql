CREATE TABLE plan_items ( 
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