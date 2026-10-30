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
  'beslenme_planlari'
];

async function migrate() {
  try {
    await client.connect();
    for (const table of tables) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      await client.query(`DROP POLICY IF EXISTS "${table}_authenticated_access" ON ${table};`);
      await client.query(`
        CREATE POLICY "${table}_authenticated_access"
        ON ${table}
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
      `);
    }
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log('Authenticated RLS policies enabled.');
  } catch (error) {
    console.error('Auth migration failed:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

migrate();
