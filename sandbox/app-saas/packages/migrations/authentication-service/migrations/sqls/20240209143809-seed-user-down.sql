// reverse OF seed script DELETE FROM main.user_credentials
WHERE user_id IN (
        SELECT
            id
        FROM
            main.users
        WHERE
            username = '{{TENANT_EMAIL}}');

DELETE FROM main.user_tenants
WHERE user_id IN (
        SELECT
            id
        FROM
            main.users
        WHERE
            username = '{{TENANT_EMAIL}}');

DELETE FROM main.users
WHERE username = '{{TENANT_EMAIL}}';

DELETE FROM main.roles
WHERE tenant_id =(
        SELECT
            id
        FROM
            main.tenants
        WHERE
            key = '{{TENANT_KEY}}');

DELETE FROM main.tenants
WHERE key = '{{TENANT_KEY}}';

DELETE FROM main.auth_clients
WHERE client_id = 'tata-elxsi-control-plane';

