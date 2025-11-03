const sql = require('mssql');
const config = require('./dbConfig');

async function testConnection() {
  try {
    console.log('Connecting to SQL Server...');
    const pool = await sql.connect(config);
    console.log('✅ Connected successfully to', config.database);
    const result = await pool.request().query('SELECT name FROM sys.tables');
    console.table(result.recordset);
    await sql.close();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();
