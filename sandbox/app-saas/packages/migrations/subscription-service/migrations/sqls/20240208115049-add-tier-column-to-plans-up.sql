-- add tier column to plans table
ALTER TABLE main.plans ADD COLUMN tier smallint DEFAULT 0 NOT NULL ;