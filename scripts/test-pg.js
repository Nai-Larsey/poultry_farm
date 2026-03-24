const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_bExFcZg28lWp@ep-billowing-wind-aj21iyvm.us-east-2.aws.neon.tech/neondb?sslmode=require"
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');
    const res = await client.query('SELECT tablename FROM pg_catalog.pg_tables WHERE tablename = $1', ['users']);
    console.log('Query successful, found users table:', res.rows.length > 0);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
  }
}

testConnection();
