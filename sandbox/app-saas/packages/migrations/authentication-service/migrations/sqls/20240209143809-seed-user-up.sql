SET search_path TO main, public;

ALTER TABLE main.roles
ADD IF NOT EXISTS tenant_id uuid  NOT NULL,
ADD IF NOT EXISTS allowed_clients text[],
ADD IF NOT EXISTS description varchar(500);

ALTER TABLE main.tenants
ADD IF NOT EXISTS website varchar(100);

ALTER TABLE main.users
ADD IF NOT EXISTS photo_url varchar(250),
ADD IF NOT EXISTS designation  varchar(50);

INSERT INTO main.auth_clients(id, client_id, client_secret, redirect_url, access_token_expiration, refresh_token_expiration, auth_code_expiration, secret)
    VALUES ('1', 'tata-elxsi-control-plane', 'TrPbi0xJT', '{{REDIRECT_URL}}', '900', '3600', '300', 'dGVsZXNjb3BlLWhlYWx0aA==');

INSERT INTO main.tenants(name, status, key)
    VALUES ('{{TENANT_NAME}}', 0, '{{TENANT_KEY}}');

INSERT INTO main.roles(name, permissions, role_type, tenant_id)
    VALUES ('SuperAdmin', '{CreateTenant,ViewTenant,UpdateTenant,DeleteTenant,CreateTenantUser,10200,10201,10202,10203,10204,10216,10205,10206,10207,10208,10209,10210,10211,10212,10213,10214,10215,2,7008,8000,8001,8002,8003,7001,7002,7003,7004,7005,7006,7007,7008,7009,7010,7011,7012,7013,7014,7015,7016,7017,7018,7019,7020,7021,7022,7023,7024,7025,7026,7027,7028}', 0,(
            SELECT
                id
            FROM
                main.tenants
            WHERE
                key = '{{TENANT_KEY}}'));

INSERT INTO main.users(first_name, last_name, username, email, auth_client_ids, default_tenant_id)
SELECT '{{USERNAME}}',
'',
'{{TENANT_EMAIL}}', 
'{{TENANT_EMAIL}}',
'{1}',
 id
FROM
    main.tenants
WHERE
    key = '{{TENANT_KEY}}';


INSERT INTO main.user_tenants(id, user_id, tenant_id, status, role_id)
SELECT
        '{{ADMIN_USER_TENANT_ID}}',
(
        SELECT
            id
        FROM
            main.users
        WHERE
            email = '{{TENANT_EMAIL}}'),(
        SELECT
            id
        FROM
            main.tenants
        WHERE
            key = '{{TENANT_KEY}}'), 1, id
FROM
    roles
WHERE
    role_type = 0;


INSERT INTO main.user_credentials(auth_id, auth_provider, user_id)
SELECT '{{USER_SUB}}', 'aws-cognito', id FROM main.users WHERE email = '{{TENANT_EMAIL}}';