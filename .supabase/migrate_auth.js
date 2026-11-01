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
  ssl: { rejectUnauthorized: false }
});

const tables = [
  'uyeler',
  'programlar',
  'olcumler',
  'antrenmanlar',
  'dokumanlar',
  'master_egzersizler',
  'master_besinler',
  'beslenme_planlari',
  'weekly_program_schedule',
  'push_subscriptions',
  'push_reminder_deliveries'
];

async function migrate() {
  try {
    await client.connect();
    for (const table of tables) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      await client.query(`DROP POLICY IF EXISTS "${table}_authenticated_access" ON ${table};`);
      await client.query(`DROP POLICY IF EXISTS "${table}_admin_access" ON ${table};`);
      await client.query(`DROP POLICY IF EXISTS "${table}_member_read" ON ${table};`);
      if (table === 'uyeler') {
        await client.query(`DROP POLICY IF EXISTS "uyeler_member_update" ON uyeler;`);
      }
      if (table === 'olcumler') {
        await client.query(`DROP POLICY IF EXISTS "olcumler_member_insert" ON olcumler;`);
      }
      if (table === 'push_subscriptions') {
        await client.query(`DROP POLICY IF EXISTS "push_subscriptions_member_access" ON push_subscriptions;`);
      }
      if (table === 'push_reminder_deliveries') {
        await client.query(`DROP POLICY IF EXISTS "push_reminder_deliveries_member_read" ON push_reminder_deliveries;`);
      }
      await client.query(`
        CREATE POLICY "${table}_admin_access"
        ON ${table}
        FOR ALL
        TO authenticated
        USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
        WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
      `);
    }
    await client.query(`
      CREATE OR REPLACE FUNCTION public.assign_default_member_role()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = auth, public
      AS $$
      BEGIN
        IF COALESCE(NEW.raw_app_meta_data, '{}'::jsonb) ->> 'role' IS NULL THEN
          NEW.raw_app_meta_data := jsonb_set(
            COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
            '{role}',
            '"user"'::jsonb,
            true
          );
        END IF;
        RETURN NEW;
      END;
      $$;

      DROP TRIGGER IF EXISTS assign_default_member_role ON auth.users;
      CREATE TRIGGER assign_default_member_role
      BEFORE INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.assign_default_member_role();

      CREATE OR REPLACE FUNCTION public.create_member_profile_for_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = auth, public
      AS $$
      BEGIN
        INSERT INTO public.uyeler (id, ad_soyad, email, auth_user_id, brans, cinsiyet, kayit_tarihi)
        VALUES (
          floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint,
          COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
          NEW.email,
          NEW.id,
          'Fitness',
          'Belirtilmedi',
          CURRENT_DATE
        )
        ON CONFLICT (auth_user_id) DO NOTHING;
        RETURN NEW;
      END;
      $$;

      DROP TRIGGER IF EXISTS create_member_profile_for_user ON auth.users;
      CREATE TRIGGER create_member_profile_for_user
      AFTER INSERT ON auth.users
      FOR EACH ROW
      WHEN (COALESCE(NEW.raw_app_meta_data ->> 'role', 'user') = 'user')
      EXECUTE FUNCTION public.create_member_profile_for_user();

      CREATE POLICY "uyeler_member_read"
      ON uyeler
      FOR SELECT
      TO authenticated
      USING (auth.uid() = auth_user_id);

      CREATE POLICY "uyeler_member_update"
      ON uyeler
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = auth_user_id)
      WITH CHECK (auth.uid() = auth_user_id);

      CREATE POLICY "olcumler_member_insert"
      ON olcumler
      FOR INSERT
      TO authenticated
      WITH CHECK (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = olcumler.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "olcumler_member_read"
      ON olcumler
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = olcumler.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "antrenmanlar_member_read"
      ON antrenmanlar
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = antrenmanlar.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "dokumanlar_member_read"
      ON dokumanlar
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = dokumanlar.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "beslenme_planlari_member_read"
      ON beslenme_planlari
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = beslenme_planlari.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "weekly_program_schedule_member_read"
      ON weekly_program_schedule
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = weekly_program_schedule.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "push_subscriptions_member_access"
      ON push_subscriptions
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = push_subscriptions.member_id
          AND uyeler.auth_user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM uyeler
        WHERE uyeler.id = push_subscriptions.member_id
          AND uyeler.auth_user_id = auth.uid()
      ));

      CREATE POLICY "push_reminder_deliveries_member_read"
      ON push_reminder_deliveries
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM push_subscriptions
        JOIN uyeler ON uyeler.id = push_subscriptions.member_id
        WHERE push_subscriptions.id = push_reminder_deliveries.subscription_id
          AND uyeler.auth_user_id = auth.uid()
      ));
    `);
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log('Admin-only RLS policies enabled.');
  } catch (error) {
    console.error('Auth migration failed:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

migrate();
