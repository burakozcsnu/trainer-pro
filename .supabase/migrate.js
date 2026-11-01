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
