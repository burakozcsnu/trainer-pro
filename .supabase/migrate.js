const { Client } = require('pg');

const client = new Client({
  user: 'postgres.mdcvljbbnoxqsfwcjvqz',
  host: 'aws-1-eu-central-1.pooler.supabase.com',
  database: 'postgres',
  password: 'HvRG@L2MV5L@-?@',
  port: 6543,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to Supabase successfully.');
    
    const res = await client.query("ALTER TABLE master_egzersizler ADD COLUMN IF NOT EXISTS gruplar JSONB DEFAULT '{}'::jsonb;");
    console.log('Migration successful:', res);
    
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
