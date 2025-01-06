-- Migration: Update email fields in leads and contacts tables

-- Step 1: Add new columns to main.leads
ALTER TABLE main.leads
ADD COLUMN communication_email varchar(100);

-- Add comments for new columns in main.leads
COMMENT ON COLUMN main.leads.communication_email IS 'Email used for communication purposes.';

-- Step 4: Add new columns to main.contacts
ALTER TABLE main.contacts
ADD COLUMN communication_email varchar(100);

-- Add comments for new columns in main.contacts
COMMENT ON COLUMN main.contacts.communication_email IS 'Email used for communication purposes.';

-- End of migration
