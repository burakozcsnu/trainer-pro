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
        ADD COLUMN IF NOT EXISTS degerlendirme_tarihi TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS trainer_id TEXT;

      CREATE TABLE IF NOT EXISTS trainers (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      INSERT INTO trainers (id, full_name)
      VALUES ('burak-ozcan', 'Burak Özcan')
      ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uyeler_trainer_id_fkey'
        ) THEN
          ALTER TABLE uyeler ADD CONSTRAINT uyeler_trainer_id_fkey
            FOREIGN KEY (trainer_id) REFERENCES trainers(id);
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS weekly_program_schedule (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        trainer_id TEXT NOT NULL DEFAULT 'burak-ozcan' REFERENCES trainers(id),
        day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time TIME NOT NULL,
        end_time TIME,
        branch TEXT NOT NULL DEFAULT 'Fitness',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (member_id, day_of_week, start_time)
      );
      ALTER TABLE weekly_program_schedule
        ADD COLUMN IF NOT EXISTS trainer_id TEXT;
      UPDATE weekly_program_schedule
        SET trainer_id = 'burak-ozcan'
        WHERE trainer_id IS NULL;
      ALTER TABLE weekly_program_schedule
        ALTER COLUMN trainer_id SET DEFAULT 'burak-ozcan',
        ALTER COLUMN trainer_id SET NOT NULL;
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'weekly_program_schedule_trainer_id_fkey'
        ) THEN
          ALTER TABLE weekly_program_schedule
            ADD CONSTRAINT weekly_program_schedule_trainer_id_fkey
            FOREIGN KEY (trainer_id) REFERENCES trainers(id);
        END IF;
      END $$;

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

      CREATE TABLE IF NOT EXISTS schedule_notifications (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        schedule_id BIGINT REFERENCES weekly_program_schedule(id) ON DELETE SET NULL,
        action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        read_at TIMESTAMPTZ,
        push_sent_at TIMESTAMPTZ
      );
      ALTER TABLE schedule_notifications
        ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMPTZ;

      CREATE TABLE IF NOT EXISTS schedule_attendance (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        schedule_id BIGINT NOT NULL REFERENCES weekly_program_schedule(id) ON DELETE CASCADE,
        occurrence_date DATE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('attending', 'declined')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (member_id, schedule_id, occurrence_date)
      );

      CREATE TABLE IF NOT EXISTS workout_completions (
        id BIGINT PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES uyeler(id) ON DELETE CASCADE,
        workout_id BIGINT NOT NULL REFERENCES antrenmanlar(id) ON DELETE CASCADE,
        exercise_index INTEGER NOT NULL,
        completion_date DATE NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (member_id, workout_id, exercise_index, completion_date)
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
