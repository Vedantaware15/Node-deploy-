const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration - using environment variables for security
const config = {
  server: process.env.DB_SERVER || 'Actin-20\\SQLEXPRESS',
  database: process.env.DB_DATABASE || 'goem_portal',
  user: process.env.DB_USER || 'testuser',
  password: process.env.DB_PASSWORD || 'Test@123',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    trustServerCertificate: true
  }
};

// Test database connection
sql.connect(config)
  .then(() => {
    console.log('✅ Connected to SQL Server');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, username, requester_name, email, category, module, goem_name, active 
      FROM users 
      ORDER BY id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, name, module 
      FROM categories 
      ORDER BY id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get EWAP requests
app.get('/api/requests', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT TOP 20 
        request_id, request_no, request_raise_by, request_raise_name, 
        request_status, category, sub_category, short_description,
        request_raise_date, goem_name
      FROM ewap_request_details 
      ORDER BY request_raise_date DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get product updates
app.get('/api/product-updates', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, title, description, category, created_at, link 
      FROM product_updates 
      ORDER BY created_at DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching product updates:', err);
    res.status(500).json({ error: 'Failed to fetch product updates' });
  }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
