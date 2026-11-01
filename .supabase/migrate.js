const { Client } = require('pg');

const dbPassword = process.env.SUPABASE_DB_PASSWORD;
if (!dbPassword) {
  throw new Error('SUPABASE_DB_PASSWORD environment variable is required.');
}

const client = new Client({
  user: 'postgres.mdcvljbbnoxqsfwcjvqz',
  host: 'aws-1-eu-central-1.pooler.supabase.com',
  database: 'postgres',
  password: dbPassword,
  port: 6543,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to Supabase successfully.');

    await client.query(`
      ALTER TABLE master_egzersizler
        ADD COLUMN IF NOT EXISTS gruplar JSONB DEFAULT '{}'::jsonb;

      ALTER TABLE uyeler
        ADD COLUMN IF NOT EXISTS boy NUMERIC,
        ADD COLUMN IF NOT EXISTS cinsiyet TEXT,
        ADD COLUMN IF NOT EXISTS kayit_tarihi DATE,
        ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE,
        ADD COLUMN IF NOT EXISTS email TEXT,
        ADD COLUMN IF NOT EXISTS telefon TEXT,
        ADD COLUMN IF NOT EXISTS dogum_tarihi DATE,
        ADD COLUMN IF NOT EXISTS saglik_gecmisi TEXT,
        ADD COLUMN IF NOT EXISTS alerjiler TEXT,
        ADD COLUMN IF NOT EXISTS beslenme_aliskanliklari TEXT,
        ADD COLUMN IF NOT EXISTS hareket_aliskanliklari TEXT,
        ADD COLUMN IF NOT EXISTS spor_gecmisi TEXT,
        ADD COLUMN IF NOT EXISTS beklentiler TEXT,
        ADD COLUMN IF NOT EXISTS degerlendirme_verileri JSONB DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS degerlendirme_tamamlandi BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS degerlendirme_tarihi TIMESTAMPTZ;

      CREATE TABLE IF NOT EXISTS weekly_program_schedule (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time TIME NOT NULL,
        end_time TIME,
        branch TEXT NOT NULL DEFAULT 'Fitness',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (member_id, day_of_week, start_time)
      );

      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS push_reminder_deliveries (
        id BIGINT PRIMARY KEY,
        subscription_id BIGINT NOT NULL REFERENCES push_subscriptions(id) ON DELETE CASCADE,
        schedule_id BIGINT NOT NULL REFERENCES weekly_program_schedule(id) ON DELETE CASCADE,
        occurrence_key TEXT NOT NULL,
        reminder_type TEXT NOT NULL CHECK (reminder_type IN ('day-before', 'hour-before')),
        delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (subscription_id, schedule_id, occurrence_key, reminder_type)
      );

      NOTIFY pgrst, 'reload schema';
    `);
    console.log('Migration successful.');

  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

migrate();
