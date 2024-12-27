-- Add a foreign key constraint to `subscriptions` to ensure `plan_id` references `id` in `plans`
ALTER TABLE main.subscriptions
ADD CONSTRAINT fk_subscriptions_plan_id
FOREIGN KEY (plan_id) REFERENCES main.plans(id);

-- Add a foreign key constraint to `plans` to ensure `currency_id` references `id` in `currencies`
ALTER TABLE main.plans
ADD CONSTRAINT fk_plans_currency_id
FOREIGN KEY (currency_id) REFERENCES main.currencies(id);

-- Add a foreign key constraint to `plans` to ensure `billing_cycle_id` references `id` in `billing_cycles`
ALTER TABLE main.plans
ADD CONSTRAINT fk_plans_billing_cycle_id
FOREIGN KEY (billing_cycle_id) REFERENCES main.billing_cycles(id);

-- Add a foreign key constraint to `plan_items` to ensure `plan_id` references `id` in `plans`
ALTER TABLE main.plan_items
ADD CONSTRAINT fk_plan_items_plan_id
FOREIGN KEY (plan_id) REFERENCES main.plans(id);
