drop from main.plan_items where plan_id = (select id from main.plans where name = 'Standard');
drop from main.plan_items where plan_id = (select id from main.plans where name = 'Premium');
drop from main.plans where name = 'Standard';
drop from main.plans where name = 'Premium';