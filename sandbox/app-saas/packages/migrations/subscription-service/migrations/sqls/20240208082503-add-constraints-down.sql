-- Drop the foreign key constraint from the `subscriptions` table
ALTER TABLE main.subscriptions
DROP CONSTRAINT fk_subscriptions_plan_id;

-- Drop the foreign key constraint from the `plans` table related to `currency_id`
ALTER TABLE main.plans
DROP CONSTRAINT fk_plans_currency_id;

-- Drop the foreign key constraint from the `plans` table related to `billing_cycle_id`
ALTER TABLE main.plans
DROP CONSTRAINT fk_plans_billing_cycle_id;

-- Drop the foreign key constraint from the `plan_items` table
ALTER TABLE main.plan_items
DROP CONSTRAINT fk_plan_items_plan_id;
