-- =============================================================
-- Production Migration: Resend Email Integration
-- Date: 2026-06-02
-- Description: Adds the resend_from setting to site_settings.
--              This is the only schema/data change required for
--              the Resend email integration. Safe to run multiple
--              times (ON CONFLICT DO NOTHING).
-- =============================================================

-- Step 1: Ensure the site_settings table exists (idempotent)
CREATE TABLE IF NOT EXISTS site_settings (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key    VARCHAR(100) NOT NULL UNIQUE,
  setting_value  TEXT         NOT NULL,
  setting_type   VARCHAR(50)  NOT NULL,
  label          VARCHAR(255),
  description    TEXT,
  updated_by     VARCHAR,
  updated_at     TIMESTAMP    DEFAULT now()
);

-- Step 2: Insert the resend_from setting (skip if already present)
INSERT INTO site_settings (setting_key, setting_value, setting_type, label, description)
VALUES (
  'resend_from',
  '',
  'email',
  'From Address (Resend)',
  'Verified sender address used for all outgoing emails via Resend. Must match a verified domain in your Resend account (e.g. noreply@yourdomain.com).'
)
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================================
-- After running this script:
--   1. Log in to the Admin Dashboard → System Settings
--   2. Under "Email (Resend)" enter your verified From address
--   3. Save — emails from the contact form will now send via Resend
-- =============================================================
